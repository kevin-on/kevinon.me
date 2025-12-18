import Link from "next/link"
import Image from "next/image"
import fs from "fs"
import path from "path"
import type { Post } from "@/lib/types"
import { getChessData } from "@/lib/chess"

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
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">Kevin On</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            I&apos;m a builder interested in AI consumer products, and a
            researcher curious about generative models, especially diffusion
            models.
          </p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://github.com/kevin-on"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              GitHub
            </a>
            <a
              href="mailto:kwanghyun.on@gmail.com"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Email
            </a>
          </div>
          {(chessData.rapid || chessData.blitz) && (
            <div className="flex gap-4 mt-3 text-sm text-gray-500">
              <a
                href="https://www.chess.com/member/kevin_on"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ♟️ Chess.com:
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
              <h3 className="text-lg font-semibold group-hover:underline">
                {post.metadata.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{post.metadata.date}</p>
              <p className="text-gray-600 mt-2">{post.metadata.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
