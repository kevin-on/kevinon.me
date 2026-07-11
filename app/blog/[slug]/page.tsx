import Link from "next/link"
import { notFound } from "next/navigation"
import PostNavigation from "@/app/components/PostNavigation"
import ThemeToggle from "@/app/components/ThemeToggle"
import { getPosts } from "@/lib/posts"

type Params = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPosts()

  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const posts = await getPosts()
  const post = posts.find((candidate) => candidate.slug === slug)

  if (!post) notFound()

  return {
    title: post.metadata.title,
    description: post.metadata.description,
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const posts = await getPosts()
  const currentPostIndex = posts.findIndex((post) => post.slug === slug)

  if (currentPostIndex === -1) notFound()

  const { default: Post }: { default: React.ComponentType } = await import(
    `@/content/${slug}.mdx`
  )
  const metadata = posts[currentPostIndex].metadata
  const previousPost = posts[currentPostIndex + 1]
  const nextPost =
    currentPostIndex > 0 ? posts[currentPostIndex - 1] : undefined

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/blog"
          className="text-sm text-foreground-3 hover:text-brand"
        >
          ← Back to blog
        </Link>
        <ThemeToggle />
      </div>
      <article className="mt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <p className="text-sm text-foreground-3 mt-2">{metadata.date}</p>
        </header>
        <div className="prose max-w-none prose-neutral dark:prose-invert">
          <Post />
        </div>
        <PostNavigation previousPost={previousPost} nextPost={nextPost} />
      </article>
    </main>
  )
}
