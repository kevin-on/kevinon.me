import Link from "next/link"
import fs from "fs"
import path from "path"
import type { Post } from "@/lib/types"

async function getPosts(): Promise<Post[]> {
  const contentDir = path.join(process.cwd(), "content")
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"))

  const posts: Post[] = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(".mdx", "")
      const { metadata } = await import(`@/content/${slug}.mdx`)
      return { slug, metadata }
    })
  )

  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  )
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <h2 className="text-xl font-semibold group-hover:underline">
                {post.metadata.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{post.metadata.date}</p>
              <p className="text-gray-600 mt-2">{post.metadata.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
