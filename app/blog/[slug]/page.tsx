import Link from "next/link"
import { notFound } from "next/navigation"
import Comments from "@/app/components/Comments"
import PostNavigation from "@/app/components/PostNavigation"
import SeriesNavigation from "@/app/components/SeriesNavigation"
import TableOfContents from "@/app/components/TableOfContents"
import ThemeToggle from "@/app/components/ThemeToggle"
import { getPosts } from "@/lib/posts"
import { getDisplayTitle, getSeriesContext } from "@/lib/series"

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
  const currentPost = posts[currentPostIndex]
  const metadata = currentPost.metadata
  const seriesContext = getSeriesContext(posts, currentPost)
  const previousPost = seriesContext
    ? seriesContext.previousPost
    : posts[currentPostIndex + 1]
  const nextPost = seriesContext
    ? seriesContext.nextPost
    : currentPostIndex > 0
      ? posts[currentPostIndex - 1]
      : undefined

  return (
    <main className="mx-auto grid w-full max-w-[90rem] grid-cols-1 px-4 py-12 min-[90rem]:grid-cols-[14rem_minmax(0,46rem)_14rem] min-[90rem]:justify-center min-[90rem]:gap-x-[6.5rem]">
      <div className="w-full max-w-[46rem] justify-self-center min-[90rem]:col-start-2">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-sm text-foreground-subtle transition-colors hover:text-accent-hover focus-visible:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ← Back to blog
          </Link>
          <ThemeToggle />
        </div>
        <article className="mt-6">
          <header className="mb-8">
            {seriesContext && (
              <p className="mb-1 text-sm font-normal text-foreground-subtle">
                {seriesContext.definition.title} series
              </p>
            )}
            <h1 className="text-3xl font-bold">
              {getDisplayTitle(currentPost)}
            </h1>
            <p className="mt-2 text-sm text-foreground-subtle">
              {metadata.date}
            </p>
          </header>
          {seriesContext && (
            <SeriesNavigation
              currentSlug={currentPost.slug}
              posts={seriesContext.posts}
              seriesTitle={seriesContext.definition.title}
            />
          )}
          <div
            data-post-content
            className="prose max-w-none"
          >
            <Post />
          </div>
          <PostNavigation
            previousPost={previousPost}
            nextPost={nextPost}
            scope={seriesContext ? "series" : "posts"}
          />
        </article>
        <Comments key={slug} />
      </div>
      <aside className="hidden min-w-0 min-[90rem]:col-start-3 min-[90rem]:row-start-1 min-[90rem]:block">
        <TableOfContents key={slug} />
      </aside>
    </main>
  )
}
