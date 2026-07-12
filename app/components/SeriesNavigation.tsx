import Link from "next/link"
import { formatSeriesOrder } from "@/lib/series"
import type { Post } from "@/lib/types"

type SeriesNavigationProps = {
  currentSlug: string
  posts: Post[]
  seriesTitle: string
}

export default function SeriesNavigation({
  currentSlug,
  posts,
  seriesTitle,
}: SeriesNavigationProps) {
  return (
    <nav
      aria-label={`${seriesTitle} series`}
      className="mb-8 border-y border-divider py-4"
    >
      <p className="mb-3 text-sm font-semibold text-foreground">
        In this series
      </p>
      <ol className="space-y-2">
        {posts.map((post) => {
          const order = post.metadata.series?.order

          if (!order) return null

          const isCurrent = post.slug === currentSlug

          return (
            <li
              key={post.slug}
              className="flex items-baseline gap-2 font-display text-sm leading-snug"
            >
              <span
                aria-hidden="true"
                className="w-6 shrink-0 text-foreground-3"
              >
                {formatSeriesOrder(order)}.
              </span>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="font-medium text-brand dark:text-brand-2"
                >
                  <span className="sr-only">Part {order}: </span>
                  {post.metadata.title}
                </span>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="rounded-sm text-foreground-2 transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:hover:text-brand-2 dark:focus-visible:text-brand-2"
                >
                  <span className="sr-only">Part {order}: </span>
                  {post.metadata.title}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
