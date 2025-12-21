import fs from "fs"
import path from "path"
import Link from "next/link"
import type { PostMetadata } from "@/lib/types"

type Params = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content")
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"))
  const isProduction = process.env.NODE_ENV === "production"

  const params = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(".mdx", "")
      const { metadata }: { metadata: PostMetadata } = await import(
        `@/content/${slug}.mdx`
      )
      return { slug, draft: metadata.draft }
    })
  )

  return params
    .filter((p) => !isProduction || !p.draft)
    .map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const { metadata }: { metadata: PostMetadata } = await import(
    `@/content/${slug}.mdx`
  )

  return {
    title: metadata.title,
    description: metadata.description,
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const {
    default: Post,
    metadata,
  }: { default: React.ComponentType; metadata: PostMetadata } = await import(
    `@/content/${slug}.mdx`
  )

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-sm text-foreground-3 hover:text-brand">
        ← Back to blog
      </Link>
      <article className="mt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <p className="text-sm text-foreground-3 mt-2">{metadata.date}</p>
        </header>
        <div className="prose prose-neutral dark:prose-invert">
          <Post />
        </div>
      </article>
    </main>
  )
}
