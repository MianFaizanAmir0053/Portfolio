"use client";
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Adapted from the original for this project:
 *  - cleanup no longer hangs off `(img as any)._cleanup`, which was only ever
 *    assigned inside `img.onload`. Unmounting before the image finished loading
 *    leaked the rAF loop and three pointer listeners permanently.
 *  - the animation loop is gated on an IntersectionObserver, so it stops when
 *    the canvas scrolls out of view instead of burning frames forever.
 *  - honours prefers-reduced-motion by falling back to the static render.
 *  - `responsive` now actually fits the container. It renders at a fixed backing
 *    resolution and displays fluid (width:100%, height:auto), so the canvas can
 *    never overflow a narrow column. Originally it recomputed at the same fixed
 *    size, so a 400px canvas simply overflowed. Doing it in CSS rather than with
 *    a ResizeObserver avoids re-sampling the whole image on every resize tick.
 *  - `crossOrigin` is only set for remote sources. It is pointless for
 *    same-origin images, and a CORS miss silently taints the canvas, making
 *    getImageData throw and the component fall back to an unpixelated draw.
 *  - no `as any`.
 */

type Sample = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  drop: boolean;
  seed: number;
};

type PixelatedCanvasProps = {
  src: string;
  width?: number;
  height?: number;
  /** Size of each cell (in CSS pixels) used for sampling and spacing. */
  cellSize?: number;
  /** Dot size as a fraction of cell size (0..1). */
  dotScale?: number;
  shape?: "circle" | "square";
  backgroundColor?: string;
  grayscale?: boolean;
  className?: string;
  /** Display fluid (width:100%, height:auto) instead of at fixed pixel size. */
  responsive?: boolean;
  /** 0..1. Higher value removes more dots in low-contrast regions. */
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: "repel" | "attract" | "swirl";
  followSpeed?: number;
  sampleAverage?: boolean;
  tintColor?: string;
  tintStrength?: number;
  maxFps?: number;
  objectFit?: "cover" | "contain" | "fill" | "none";
  jitterStrength?: number;
  jitterSpeed?: number;
  fadeOnLeave?: boolean;
  fadeSpeed?: number;
  /** Accessible description of the picture. */
  label?: string;
};

const parseColor = (c: string): [number, number, number] | null => {
  if (c.startsWith("#")) {
    const hex = c.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const m = c.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
  if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  return null;
};

export const PixelatedCanvas: React.FC<PixelatedCanvasProps> = ({
  src,
  width = 400,
  height = 500,
  cellSize = 3,
  dotScale = 0.9,
  shape = "square",
  backgroundColor = "#000000",
  grayscale = false,
  className,
  responsive = false,
  dropoutStrength = 0.4,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = "swirl",
  followSpeed = 0.2,
  sampleAverage = true,
  tintColor = "#FFFFFF",
  tintStrength = 0.2,
  maxFps = 60,
  objectFit = "cover",
  jitterStrength = 4,
  jitterSpeed = 4,
  fadeOnLeave = true,
  fadeSpeed = 0.1,
  label = "Pixelated rendering of source image",
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const animate = interactive && !reduceMotion;

  // Backing resolution. Display size is handled in CSS when `responsive`.
  const displayWidth = width;
  const displayHeight = height;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let raf: number | null = null;
    let io: IntersectionObserver | null = null;
    let detachPointer: (() => void) | null = null;

    const samplesRef: { current: Sample[] } = { current: [] };
    const dims = { width: displayWidth, height: displayHeight, dot: 1 };
    const targetMouse = { x: -9999, y: -9999 };
    const animMouse = { x: -9999, y: -9999 };
    let lastFrame = 0;
    let pointerInside = false;
    let activity = 0;
    let activityTarget = 0;

    const img = new Image();
    // Only meaningful cross-origin; on same-origin it buys nothing.
    if (/^https?:\/\//i.test(src)) img.crossOrigin = "anonymous";

    const compute = () => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      canvas.width = Math.max(1, Math.floor(displayWidth * dpr));
      canvas.height = Math.max(1, Math.floor(displayHeight * dpr));
      if (responsive) {
        // Intrinsic ratio comes from the width/height attributes, so height:auto
        // keeps the aspect while the box never exceeds its container.
        canvas.style.width = "100%";
        canvas.style.height = "auto";
      } else {
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      } else {
        ctx.clearRect(0, 0, displayWidth, displayHeight);
      }

      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.floor(displayWidth));
      offscreen.height = Math.max(1, Math.floor(displayHeight));
      const off = offscreen.getContext("2d");
      if (!off) return;

      const iw = img.naturalWidth || displayWidth;
      const ih = img.naturalHeight || displayHeight;
      let dw = displayWidth;
      let dh = displayHeight;
      let dx = 0;
      let dy = 0;
      if (objectFit === "cover" || objectFit === "contain") {
        const scale =
          objectFit === "cover"
            ? Math.max(displayWidth / iw, displayHeight / ih)
            : Math.min(displayWidth / iw, displayHeight / ih);
        dw = Math.ceil(iw * scale);
        dh = Math.ceil(ih * scale);
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      } else if (objectFit === "fill") {
        dw = displayWidth;
        dh = displayHeight;
      } else {
        dw = iw;
        dh = ih;
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      }
      off.drawImage(img, dx, dy, dw, dh);

      let imageData: ImageData;
      try {
        imageData = off.getImageData(0, 0, offscreen.width, offscreen.height);
      } catch {
        // Tainted canvas (cross-origin without CORS) — draw the plain image.
        ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
        return;
      }

      const data = imageData.data;
      const stride = offscreen.width * 4;
      dims.dot = Math.max(1, Math.floor(cellSize * dotScale));

      const luminanceAt = (px: number, py: number) => {
        const ix = Math.max(0, Math.min(offscreen.width - 1, px));
        const iy = Math.max(0, Math.min(offscreen.height - 1, py));
        const i = iy * stride + ix * 4;
        return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      };

      const hash2D = (ix: number, iy: number) => {
        const s = Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453123;
        return s - Math.floor(s);
      };

      const tintRGB = tintColor && tintStrength > 0 ? parseColor(tintColor) : null;
      const samples: Sample[] = [];

      for (let y = 0; y < offscreen.height; y += cellSize) {
        const cy = Math.min(offscreen.height - 1, y + Math.floor(cellSize / 2));
        for (let x = 0; x < offscreen.width; x += cellSize) {
          const cx = Math.min(offscreen.width - 1, x + Math.floor(cellSize / 2));
          let r = 0;
          let g = 0;
          let b = 0;
          let a = 0;
          if (!sampleAverage) {
            const idx = cy * stride + cx * 4;
            r = data[idx];
            g = data[idx + 1];
            b = data[idx + 2];
            a = data[idx + 3] / 255;
          } else {
            let count = 0;
            for (let oy = -1; oy <= 1; oy++) {
              for (let ox = -1; ox <= 1; ox++) {
                const sx = Math.max(0, Math.min(offscreen.width - 1, cx + ox));
                const sy = Math.max(0, Math.min(offscreen.height - 1, cy + oy));
                const sIdx = sy * stride + sx * 4;
                r += data[sIdx];
                g += data[sIdx + 1];
                b += data[sIdx + 2];
                a += data[sIdx + 3] / 255;
                count++;
              }
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            a = a / count;
          }

          if (grayscale) {
            const L = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            r = L;
            g = L;
            b = L;
          } else if (tintRGB) {
            const k = Math.max(0, Math.min(1, tintStrength));
            r = Math.round(r * (1 - k) + tintRGB[0] * k);
            g = Math.round(g * (1 - k) + tintRGB[1] * k);
            b = Math.round(b * (1 - k) + tintRGB[2] * k);
          }

          const Lc = luminanceAt(cx, cy);
          const Lx1 = luminanceAt(cx - 1, cy);
          const Lx2 = luminanceAt(cx + 1, cy);
          const Ly1 = luminanceAt(cx, cy - 1);
          const Ly2 = luminanceAt(cx, cy + 1);
          const grad =
            Math.abs(Lx2 - Lx1) +
            Math.abs(Ly2 - Ly1) +
            Math.abs(Lc - (Lx1 + Lx2 + Ly1 + Ly2) / 4);
          const gradientNorm = Math.max(0, Math.min(1, grad / 255));
          const dropoutProb = Math.max(0, Math.min(1, (1 - gradientNorm) * dropoutStrength));
          const seed = hash2D(cx, cy);

          samples.push({ x, y, r, g, b, a, drop: seed < dropoutProb, seed });
        }
      }

      samplesRef.current = samples;
    };

    const paintDot = (ctx: CanvasRenderingContext2D, s: Sample, px: number, py: number) => {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(px, py, dims.dot / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(px - dims.dot / 2, py - dims.dot / 2, dims.dot, dims.dot);
      }
    };

    const clear = (ctx: CanvasRenderingContext2D) => {
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, dims.width, dims.height);
      } else {
        ctx.clearRect(0, 0, dims.width, dims.height);
      }
    };

    const drawStatic = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      clear(ctx);
      for (const s of samplesRef.current) {
        if (s.drop || s.a <= 0) continue;
        paintDot(ctx, s, s.x + cellSize / 2, s.y + cellSize / 2);
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      const now = performance.now();
      const minDelta = 1000 / Math.max(1, maxFps);
      if (now - lastFrame < minDelta) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastFrame = now;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(frame);
        return;
      }

      animMouse.x += (targetMouse.x - animMouse.x) * followSpeed;
      animMouse.y += (targetMouse.y - animMouse.y) * followSpeed;
      activity = fadeOnLeave
        ? activity + (activityTarget - activity) * fadeSpeed
        : pointerInside
          ? 1
          : 0;

      clear(ctx);

      const mx = animMouse.x;
      const my = animMouse.y;
      const sigma = Math.max(1, distortionRadius * 0.5);
      const t = now * 0.001 * jitterSpeed;
      const act = Math.max(0, Math.min(1, activity));

      for (const s of samplesRef.current) {
        if (s.drop || s.a <= 0) continue;
        let drawX = s.x + cellSize / 2;
        let drawY = s.y + cellSize / 2;
        const dx = drawX - mx;
        const dy = drawY - my;
        const dist2 = dx * dx + dy * dy;
        const influence = Math.exp(-dist2 / (2 * sigma * sigma)) * act;

        if (influence > 0.0005) {
          if (distortionMode === "repel" || distortionMode === "attract") {
            const dist = Math.sqrt(dist2) + 0.0001;
            const dir = distortionMode === "repel" ? 1 : -1;
            drawX += dir * (dx / dist) * distortionStrength * influence;
            drawY += dir * (dy / dist) * distortionStrength * influence;
          } else {
            const angle = distortionStrength * 0.05 * influence;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            drawX = mx + (cosA * dx - sinA * dy);
            drawY = my + (sinA * dx + cosA * dy);
          }

          if (jitterStrength > 0) {
            const k = s.seed * 43758.5453;
            drawX += Math.sin(t + k) * jitterStrength * influence;
            drawY += Math.cos(t + k * 1.13) * jitterStrength * influence;
          }
        }

        paintDot(ctx, s, drawX, drawY);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (raf === null) raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    img.onload = () => {
      if (cancelled) return;
      compute();

      if (!animate) {
        drawStatic();
        return;
      }

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        // Samples live in backing-resolution units; when displayed fluid the CSS
        // box is a different size, so map the pointer into that space.
        const sx = rect.width > 0 ? displayWidth / rect.width : 1;
        const sy = rect.height > 0 ? displayHeight / rect.height : 1;
        targetMouse.x = (e.clientX - rect.left) * sx;
        targetMouse.y = (e.clientY - rect.top) * sy;
        pointerInside = true;
        activityTarget = 1;
      };
      const onPointerEnter = () => {
        pointerInside = true;
        activityTarget = 1;
      };
      const onPointerLeave = () => {
        pointerInside = false;
        if (fadeOnLeave) {
          activityTarget = 0;
        } else {
          targetMouse.x = -9999;
          targetMouse.y = -9999;
        }
      };

      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerenter", onPointerEnter);
      canvas.addEventListener("pointerleave", onPointerLeave);
      detachPointer = () => {
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerenter", onPointerEnter);
        canvas.removeEventListener("pointerleave", onPointerLeave);
      };

      // Paint one frame immediately so the picture is there before any pointer
      // interaction, then only run the loop while on screen.
      drawStatic();
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) startLoop();
          else stopLoop();
        },
        { threshold: 0 },
      );
      io.observe(canvas);
    };

    img.onerror = () => {
      console.error("Failed to load image for PixelatedCanvas:", src);
    };

    img.src = src;

    return () => {
      cancelled = true;
      stopLoop();
      io?.disconnect();
      detachPointer?.();
      img.onload = null;
      img.onerror = null;
    };
  }, [
    src,
    displayWidth,
    displayHeight,
    responsive,
    cellSize,
    dotScale,
    shape,
    backgroundColor,
    grayscale,
    dropoutStrength,
    animate,
    distortionStrength,
    distortionRadius,
    distortionMode,
    followSpeed,
    sampleAverage,
    tintColor,
    tintStrength,
    maxFps,
    objectFit,
    jitterStrength,
    jitterSpeed,
    fadeOnLeave,
    fadeSpeed,
  ]);

  return (
    <div className="w-full min-w-0">
      {/*
       * `width`/`height` are set here as attributes, not only from the effect.
       * Without them the canvas has no intrinsic ratio in the server HTML, so
       * it lays out at zero height and the hero column jumps by ~600px the
       * moment the image decodes. The effect still overwrites them with the
       * device-pixel-ratio backing size; these are what hold the box until it
       * does. `aspectRatio` covers the responsive case, where CSS width is
       * 100% and the height has to be derived rather than fixed.
       */}
      <canvas
        ref={canvasRef}
        width={displayWidth}
        height={displayHeight}
        style={
          responsive
            ? { width: "100%", height: "auto", aspectRatio: `${displayWidth} / ${displayHeight}` }
            : { width: displayWidth, height: displayHeight }
        }
        className={className}
        aria-label={label}
        role="img"
      />
    </div>
  );
};
