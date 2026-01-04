import Link from "next/link"
import Image from "next/image"
import fs from "fs"
import path from "path"
import type { Post } from "@/lib/types"
import { getChessData } from "@/lib/chess"
import CopyEmail from "@/app/components/CopyEmail"

async function getPosts(): Promise<Post[]> {
  const contentDir = path.join(process.cwd(), "content")
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"))
  const isProduction = process.env.NODE_ENV === "production"

  const posts: Post[] = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(".mdx", "")
      const { metadata } = await import(`@/content/${slug}.mdx`)
      return { slug, metadata }
    })
  )

  return posts
    .filter((post) => !isProduction || !post.metadata.draft)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    )
}

function formatChange(change: number): string {
  if (change > 0) return `+${change}`
  if (change < 0) return `${change}`
  return "±0"
}

export default async function BlogPage() {
  const [posts, chessData] = await Promise.all([getPosts(), getChessData()])

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Profile Section */}
      <section className="flex items-center gap-6 mb-12">
        <Image
          src="/profile.jpg"
          alt="Kevin On"
          width={80}
          height={80}
          className="rounded-full shrink-0 w-20 h-20 object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">Kevin On</h1>
          <p className="text-foreground-2 mt-1">
            I&apos;m a builder interested in AI consumer products, and a
            researcher curious about generative models, especially diffusion
            models.
          </p>
          <div className="flex gap-4 mt-3">
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
                className="flex items-center gap-1 hover:text-brand"
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
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <h3 className="text-lg font-semibold group-hover:text-brand">
                {post.metadata.title}
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
        ))}
      </ul>
    </main>
  )
}
