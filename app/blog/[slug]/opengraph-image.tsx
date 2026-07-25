import { readFile } from "fs/promises"
import path from "path"
import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { getPosts } from "@/lib/posts"

export const runtime = "nodejs"
export const alt = "Kevin On blog post"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const buffer = await readFile(
    path.join(process.cwd(), "public", "fonts", filename)
  )

  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer
}

const neueMontrealMedium = loadFont("PPNeueMontreal-Medium.otf")
const ibmPlexSansRegular = loadFont("IBMPlexSans-Regular.ttf")

function getTitleFontSize(title: string): number {
  const length = Array.from(title).length

  if (length <= 42) return 112
  if (length <= 64) return 92
  if (length <= 84) return 78
  return 68
}

function clampDescription(description: string): string {
  const maxLength = 135

  if (description.length <= maxLength) return description

  return `${description.slice(0, maxLength - 1).trimEnd()}…`
}

type ImageProps = {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { slug } = await params
  const posts = await getPosts()
  const post = posts.find((candidate) => candidate.slug === slug)

  if (!post) notFound()

  const title = post.metadata.title
  const description = clampDescription(post.metadata.description)
  const titleFontSize = getTitleFontSize(title)
  const [displayFont, bodyFont] = await Promise.all([
    neueMontrealMedium,
    ibmPlexSansRegular,
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "58px 64px 64px",
          background: "#fefbf5",
          color: "#27241f",
        }}
      >
        <div
          style={{
            color: "#205ea6",
            fontFamily: "IBM Plex Sans",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          kevinon.me
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              maxWidth: 1072,
              fontFamily: "Neue Montreal",
              fontSize: titleFontSize,
              fontWeight: 500,
              letterSpacing: "-0.052em",
              lineHeight: 0.94,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                maxWidth: 900,
                marginTop: 25,
                color: "rgba(39, 36, 31, 0.65)",
                fontFamily: "IBM Plex Sans",
                fontSize: 27,
                lineHeight: 1.38,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Neue Montreal",
          data: displayFont,
          weight: 500,
          style: "normal",
        },
        {
          name: "IBM Plex Sans",
          data: bodyFont,
          weight: 400,
          style: "normal",
        },
      ],
    }
  )
}
