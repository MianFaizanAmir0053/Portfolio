import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

export type ImageMeta = { width: number; height: number };

/*
 * What a figure falls back to when a file cannot be read: the ratio the
 * diagrams are drawn at. Wrong for a screenshot, but only by a letterbox —
 * the frame is `object-contain` — rather than a page that fails to build.
 */
const FALLBACK: ImageMeta = { width: 1600, height: 1000 };

const cache = new Map<string, ImageMeta>();

/**
 * The intrinsic size of an image under `public/`, read from its header.
 *
 * Case-study figures render at their own aspect ratio instead of being forced
 * into one frame shape, which is what shrank every screenshot to a thumbnail
 * inside a letterbox. That needs the real width and height before the image
 * loads, or the page shifts as each one arrives. Reading the header at build
 * keeps the promise the project data makes: drop a new file into
 * `public/projects/`, change its path, and nothing else needs editing.
 *
 * PNG, WebP (lossy, lossless and extended) and SVG are the formats the
 * projects use. The pages are prerendered, so this runs at build time only.
 */
export function imageMeta(src: string): ImageMeta {
  const hit = cache.get(src);
  if (hit) return hit;

  let meta = FALLBACK;
  try {
    const file = readFileSync(path.join(process.cwd(), "public", src.split("?")[0]));
    meta = parse(file) ?? FALLBACK;
  } catch {
    // Unreadable or missing: keep the fallback rather than failing the build.
  }
  cache.set(src, meta);
  return meta;
}

function parse(b: Buffer): ImageMeta | null {
  // PNG: the IHDR chunk always comes first, width and height big-endian.
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }

  if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8 ") {
      return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L") {
      return {
        width: 1 + (((b[22] & 0x3f) << 8) | b[21]),
        height: 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6)),
      };
    }
    if (chunk === "VP8X") {
      return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    }
    return null;
  }

  // SVG: the viewBox, or failing that the width and height attributes.
  const head = b.toString("utf8", 0, Math.min(b.length, 2048));
  if (head.includes("<svg")) {
    const box = head.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
    if (box) return { width: Number(box[1]), height: Number(box[2]) };
    const w = head.match(/\swidth="([\d.]+)"/);
    const h = head.match(/\sheight="([\d.]+)"/);
    if (w && h) return { width: Number(w[1]), height: Number(h[1]) };
  }

  return null;
}
