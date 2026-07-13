import Link from "next/link"
import type { Post } from "@/lib/types"

type PostNavigationProps = {
  previousPost?: Post
  nextPost?: Post
  scope?: "posts" | "series"
}

export default function PostNavigation({
  previousPost,
  nextPost,
  scope = "posts",
}: PostNavigationProps) {
  const previousLabel =
    scope === "series" ? "PREVIOUS IN SERIES" : "PREVIOUS POST"
  const nextLabel = scope === "series" ? "NEXT IN SERIES" : "NEXT POST"

  return (
    <footer className="mt-16 border-t border-divider pt-6">
      <nav aria-label="Post navigation">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {previousPost && (
            <Link
              href={`/blog/${previousPost.slug}`}
              rel="prev"
              className="group block min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:col-start-1"
            >
              <span className="block text-xs font-medium tracking-[0.08em] text-foreground-muted">
                {previousLabel}
              </span>
              <span className="mt-1.5 block break-words text-base leading-snug text-foreground transition-colors group-hover:text-accent-hover group-focus-visible:text-accent-hover">
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-hover:-translate-x-0.5 motion-reduce:transform-none"
                >
                  ←
                </span>{" "}
                {previousPost.metadata.title}
              </span>
            </Link>
          )}

          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              rel="next"
              className="group block min-w-0 rounded-sm text-right focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:col-start-2"
            >
              <span className="block text-xs font-medium tracking-[0.08em] text-foreground-muted">
                {nextLabel}
              </span>
              <span className="mt-1.5 block break-words text-base leading-snug text-foreground transition-colors group-hover:text-accent-hover group-focus-visible:text-accent-hover">
                {nextPost.metadata.title}{" "}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                >
                  →
                </span>
              </span>
            </Link>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-sm px-2 py-2 text-xs font-medium tracking-[0.08em] text-foreground-muted transition-colors hover:text-accent-hover focus-visible:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M8 6h13M8 12h13M8 18h13" />
              <path d="M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            ALL POSTS
          </Link>
        </div>
      </nav>
    </footer>
  )
}
