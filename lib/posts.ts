import fs from "fs"
import path from "path"
import type { Post, PostMetadata } from "@/lib/types"

export async function getPosts(): Promise<Post[]> {
  const contentDir = path.join(process.cwd(), "content")
  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".mdx"))
  const isProduction = process.env.NODE_ENV === "production"

  const posts: Post[] = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(".mdx", "")
      const { metadata }: { metadata: PostMetadata } = await import(
        `@/content/${slug}.mdx`
      )

      return { slug, metadata }
    })
  )

  return posts
    .filter((post) => !isProduction || !post.metadata.draft)
    .sort((a, b) => {
      const dateDifference =
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()

      return dateDifference || a.slug.localeCompare(b.slug)
    })
}
