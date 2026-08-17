import Link from "next/link";
import { Tag } from "@/components/site/primitives";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-md">
        <Tag className="mb-6 block text-cobalt">[404]</Tag>
        <p className="display text-[22vw] leading-[0.8] text-ink md:text-[9rem]">404</p>
        <h1 className="display mt-6 text-2xl md:text-3xl">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
        >
          ← Back to index
        </Link>
      </div>
    </div>
  );
}
