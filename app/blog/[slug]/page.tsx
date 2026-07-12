import Link from "next/link"
import { notFound } from "next/navigation"
import Comments from "@/app/components/Comments"
import PostNavigation from "@/app/components/PostNavigation"
import TableOfContents from "@/app/components/TableOfContents"
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
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 px-4 py-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,46rem)_15rem] xl:gap-x-16">
      <div className="w-full max-w-[46rem] justify-self-center xl:col-start-2">
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
          <div
            data-post-content
            className="prose max-w-none prose-neutral dark:prose-invert"
          >
            <Post />
          </div>
          <PostNavigation
            previousPost={previousPost}
            nextPost={nextPost}
          />
        </article>
        <Comments key={slug} />
      </div>
      <aside className="hidden min-w-0 xl:col-start-3 xl:row-start-1 xl:block">
        <TableOfContents key={slug} />
      </aside>
    </main>
  )
}
