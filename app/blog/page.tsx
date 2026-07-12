import Link from "next/link"
import Image from "next/image"
import { getChessData } from "@/lib/chess"
import { getPosts } from "@/lib/posts"
import CopyEmail from "@/app/components/CopyEmail"
import ThemeToggle from "@/app/components/ThemeToggle"
import { getDisplayTitle, getSeriesDefinition } from "@/lib/series"

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
          <p className="text-foreground-2 mt-1">
            Mostly interested in robotics. Also into AI products, chess, and
            soccer.
          </p>
          <div className="flex flex-wrap gap-4 mt-3">
            <a
              href="https://github.com/kevin-on"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-3 hover:text-brand"
            >
              GitHub
            </a>
            <CopyEmail email="kwanghyun.on@gmail.com" />
          </div>
          {(chessData.rapid || chessData.blitz) && (
            <div className="flex gap-4 mt-3 text-sm text-foreground-3">
              <a
                href="https://www.chess.com/member/kevin_on"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center gap-1 hover:text-brand"
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
                          ? "text-green-600"
                          : chessData.rapid.change < 0
                          ? "text-red-500"
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
                          ? "text-green-600"
                          : chessData.blitz.change < 0
                          ? "text-red-500"
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
              <Link href={`/blog/${post.slug}`} className="block group">
                {series && (
                  <p className="mb-1 text-sm font-normal text-foreground-3">
                    {series.title} series
                  </p>
                )}
                <h3 className="text-lg font-medium group-hover:text-brand">
                  {getDisplayTitle(post)}
                  <span className="font-normal text-sm text-foreground-3 ml-4">
                    {new Date(post.metadata.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </h3>
                {post.metadata.description && (
                  <p className="text-foreground-2 mt-1">
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
