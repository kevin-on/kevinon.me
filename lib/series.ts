import type { Post } from "@/lib/types"

export const SERIES = {
  "reinforcement-learning": {
    title: "Reinforcement Learning",
  },
} as const

export type SeriesId = keyof typeof SERIES

export type SeriesContext = {
  definition: (typeof SERIES)[SeriesId]
  posts: Post[]
  previousPost?: Post
  nextPost?: Post
}

export function getSeriesDefinition(id: string) {
  const definition = SERIES[id as SeriesId]

  if (!definition) {
    throw new Error(`Unknown post series: ${id}`)
  }

  return definition
}

export function formatSeriesOrder(order: number) {
  return String(order).padStart(2, "0")
}

export function getDisplayTitle(post: Post) {
  const series = post.metadata.series

  if (!series) return post.metadata.title

  return `${formatSeriesOrder(series.order)}. ${post.metadata.title}`
}

export function getSeriesPosts(posts: Post[], seriesId: string) {
  getSeriesDefinition(seriesId)

  const seriesPosts = posts
    .filter((post) => post.metadata.series?.id === seriesId)
    .sort((a, b) => {
      const orderDifference =
        (a.metadata.series?.order ?? 0) - (b.metadata.series?.order ?? 0)

      return orderDifference || a.slug.localeCompare(b.slug)
    })

  const seenOrders = new Set<number>()

  for (const post of seriesPosts) {
    const order = post.metadata.series?.order

    if (!order || !Number.isInteger(order) || order < 1) {
      throw new Error(`Invalid series order for post: ${post.slug}`)
    }

    if (seenOrders.has(order)) {
      throw new Error(`Duplicate series order ${order} in series: ${seriesId}`)
    }

    seenOrders.add(order)
  }

  return seriesPosts
}

export function getSeriesContext(
  posts: Post[],
  currentPost: Post
): SeriesContext | undefined {
  const series = currentPost.metadata.series

  if (!series) return undefined

  const seriesPosts = getSeriesPosts(posts, series.id)
  const currentIndex = seriesPosts.findIndex(
    (post) => post.slug === currentPost.slug
  )

  if (currentIndex === -1) {
    throw new Error(`Post is missing from its series: ${currentPost.slug}`)
  }

  return {
    definition: getSeriesDefinition(series.id),
    posts: seriesPosts,
    previousPost:
      currentIndex > 0 ? seriesPosts[currentIndex - 1] : undefined,
    nextPost:
      currentIndex < seriesPosts.length - 1
        ? seriesPosts[currentIndex + 1]
        : undefined,
  }
}
