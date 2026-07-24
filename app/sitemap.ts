import type { MetadataRoute } from "next"
import { getPosts } from "@/lib/posts"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()

  return [
    {
      url: `${SITE_URL}/blog`,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.metadata.date),
    })),
  ]
}
