import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getChessData } from "@/lib/chess"
import { getPosts } from "@/lib/posts"
import CopyEmail from "@/app/components/CopyEmail"
import ThemeToggle from "@/app/components/ThemeToggle"
import { getDisplayTitle, getSeriesDefinition } from "@/lib/series"

export const metadata: Metadata = {
  title: {
    absolute: "Kevin On",
  },
  description:
    "Kevin On writes about robotics, reinforcement learning, AI products, and software.",
  alternates: {
    canonical: "/blog",
  },
}

function formatChange(change: number): string {
  if (change > 0) return `+${change}`
  if (change < 0) return `${change}`
  return "±0"
}

export default async function BlogPage() {
  const [posts, chessData] = await Promise.all([getPosts(), getChessData()])

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Section */}
      <section className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-6 mb-12">
        <div className="col-span-2 row-start-1 justify-self-end mb-4 sm:col-span-1 sm:col-start-3 sm:mb-0">
          <ThemeToggle />
        </div>
        <Image
          src="/profile.jpg"
          alt="Kevin On"
          width={80}
          height={80}
          className="col-start-1 row-start-2 sm:row-start-1 rounded-full shrink-0 w-20 h-20 object-cover"
        />
        <div className="col-start-2 row-start-2 sm:row-start-1 min-w-0">
          <h1 className="text-2xl font-bold">Kevin On</h1>
          <p className="mt-1 text-foreground-muted">
            Mostly interested in robotics. Also into AI products, chess, and
            soccer.
          </p>
          <div className="flex flex-wrap gap-4 mt-3">
            <a
              href="https://github.com/kevin-on"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-subtle transition-colors hover:text-accent-hover focus-visible:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              GitHub
            </a>
            <CopyEmail email="kevinon@stanford.edu" />
          </div>
          {(chessData.rapid || chessData.blitz) && (
            <div className="mt-3 flex gap-4 text-sm text-foreground-subtle">
              <a
                href="https://www.chess.com/member/kevin_on"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-1 transition-colors hover:text-accent-hover focus-visible:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Image
                  src="/chesscom-icon-filled-256.png"
                  alt="Chess.com"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                Chess.com:
                {chessData.rapid && (
                  <span>
                    Rapid {chessData.rapid.current}{" "}
                    <span
                      className={
                        chessData.rapid.change > 0
                          ? "text-positive"
                          : chessData.rapid.change < 0
                          ? "text-negative"
                          : ""
                      }
                    >
                      ({formatChange(chessData.rapid.change)})
                    </span>
                  </span>
                )}
                {chessData.rapid && chessData.blitz && " · "}
                {chessData.blitz && (
                  <span>
                    Blitz {chessData.blitz.current}{" "}
                    <span
                      className={
                        chessData.blitz.change > 0
                          ? "text-positive"
                          : chessData.blitz.change < 0
                          ? "text-negative"
                          : ""
                      }
                    >
                      ({formatChange(chessData.blitz.change)})
                    </span>
                  </span>
                )}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Posts Section */}
      <h2 className="text-xl font-bold mb-6">Posts</h2>
      <ul className="space-y-6">
        {posts.map((post) => {
          const series = post.metadata.series
            ? getSeriesDefinition(post.metadata.series.id)
            : undefined

          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {series && (
                  <p className="mb-1 text-sm font-normal text-foreground-subtle">
                    {series.title} series
                  </p>
                )}
                <h3 className="text-lg font-medium transition-colors group-hover:text-accent-hover group-focus-visible:text-accent-hover">
                  {getDisplayTitle(post)}
                  <span className="ml-4 text-sm font-normal text-foreground-subtle">
                    {new Date(post.metadata.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </h3>
                {post.metadata.description && (
                  <p className="mt-1 text-foreground-muted">
                    {post.metadata.description}
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
