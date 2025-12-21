export type PostMetadata = {
  title: string
  date: string
  description: string
  draft?: boolean
}

export type Post = {
  slug: string
  metadata: PostMetadata
}
