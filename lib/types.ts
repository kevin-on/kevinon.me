export type PostSeries = {
  id: string
  order: number
}

export type PostMetadata = {
  title: string
  seoTitle?: string
  date: string
  description: string
  draft?: boolean
  series?: PostSeries
}

export type Post = {
  slug: string
  metadata: PostMetadata
}
