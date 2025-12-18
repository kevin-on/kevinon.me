export type PostMetadata = {
  title: string
  date: string
  description: string
}

export type Post = {
  slug: string
  metadata: PostMetadata
}
