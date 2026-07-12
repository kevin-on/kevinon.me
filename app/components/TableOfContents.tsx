"use client"

import { useEffect, useRef, useState } from "react"

type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

const MINIMUM_HEADINGS = 2
// Anchor navigation places headings 96px from the viewport top. Keep the
// activation line slightly below that position so subpixel rounding cannot
// make the scrollspy select the previous section after a TOC click.
const ACTIVE_HEADING_OFFSET = 112

function getHeadingText(heading: HTMLHeadingElement) {
  const clone = heading.cloneNode(true) as HTMLHeadingElement

  // KaTeX renders both an accessible MathML tree and a visual HTML tree.
  // Keep only the visual text so math does not appear twice in the TOC.
  clone.querySelectorAll(".katex-mathml").forEach((node) => node.remove())

  return clone.textContent?.replace(/\s+/g, " ").trim() ?? ""
}

function getHashId() {
  const hash = window.location.hash.slice(1)

  try {
    return decodeURIComponent(hash)
  } catch {
    return hash
  }
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState("")
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const content = document.querySelector<HTMLElement>("[data-post-content]")

    if (!content) return

    const headings = Array.from(
      content.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]")
    )
      .map((element) => ({
        element,
        item: {
          id: element.id,
          text: getHeadingText(element),
          level: Number(element.tagName.slice(1)) as 2 | 3,
        },
      }))
      .filter(
        ({ element, item }) =>
          item.text.length > 0 &&
          !element.matches('.sr-only, [hidden], [aria-hidden="true"]')
      )

    const nextItems = headings.map(({ item }) => item)

    if (headings.length < MINIMUM_HEADINGS) {
      const initialFrame = window.requestAnimationFrame(() => {
        setItems(nextItems)
      })

      return () => window.cancelAnimationFrame(initialFrame)
    }

    const headingElements = headings.map(({ element }) => element)
    const isAtPageBottom = () => {
      const root = document.documentElement
      const pageCanScroll = root.scrollHeight > window.innerHeight + 1

      return (
        pageCanScroll &&
        Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight - 2
      )
    }

    const updateActiveHeading = () => {
      let nextActiveId = headingElements[0].id

      if (isAtPageBottom()) {
        nextActiveId = headingElements.at(-1)?.id ?? nextActiveId
      } else {
        for (const heading of headingElements) {
          if (heading.getBoundingClientRect().top > ACTIVE_HEADING_OFFSET) {
            break
          }

          nextActiveId = heading.id
        }
      }

      setActiveId((current) =>
        current === nextActiveId ? current : nextActiveId
      )
    }

    const observer = new IntersectionObserver(updateActiveHeading, {
      rootMargin: `-${ACTIVE_HEADING_OFFSET}px 0px -65% 0px`,
    })

    headingElements.forEach((heading) => observer.observe(heading))

    let wasAtPageBottom = isAtPageBottom()
    const handleScroll = () => {
      const isAtBottom = isAtPageBottom()

      if (isAtBottom !== wasAtPageBottom) {
        wasAtPageBottom = isAtBottom
        updateActiveHeading()
      }
    }

    const handleHashChange = () => {
      const hashId = getHashId()

      if (headingElements.some((heading) => heading.id === hashId)) {
        setActiveId(hashId)
      } else {
        updateActiveHeading()
      }
    }

    const initialFrame = window.requestAnimationFrame(() => {
      setItems(nextItems)
      updateActiveHeading()
    })
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("hashchange", handleHashChange)
    window.addEventListener("resize", updateActiveHeading)

    return () => {
      window.cancelAnimationFrame(initialFrame)
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("resize", updateActiveHeading)
    }
  }, [])

  useEffect(() => {
    const list = listRef.current
    const activeLink = list?.querySelector<HTMLElement>(
      '[aria-current="location"]'
    )

    if (!list || !activeLink) return

    const listRect = list.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const padding = 8

    if (linkRect.top < listRect.top + padding) {
      list.scrollTop -= listRect.top + padding - linkRect.top
    } else if (linkRect.bottom > listRect.bottom - padding) {
      list.scrollTop += linkRect.bottom - listRect.bottom + padding
    }
  }, [activeId])

  if (items.length < MINIMUM_HEADINGS) return null

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-8 w-full border-l border-divider pl-4 text-sm"
    >
      <p className="text-sm font-semibold leading-8 text-foreground">
        On this page
      </p>
      <ol
        ref={listRef}
        className="max-h-[calc(100vh-7rem)] list-none overflow-y-auto"
      >
        {items.map((item) => {
          const isActive = item.id === activeId

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative block overflow-hidden text-ellipsis whitespace-nowrap pr-2 leading-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand ${
                  item.level === 3 ? "pl-4" : ""
                } ${
                  isActive
                    ? "text-brand before:absolute before:-left-4 before:top-2 before:h-4 before:w-0.5 before:rounded-full before:bg-brand before:content-[''] dark:text-brand-2 dark:before:bg-brand-2"
                    : "text-foreground-3 hover:text-foreground-2"
                }`}
                onClick={() => setActiveId(item.id)}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
