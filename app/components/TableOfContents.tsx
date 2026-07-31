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
    <div className="h-fit w-full min-[90rem]:sticky min-[90rem]:top-8">
      <div className="group fixed right-4 top-1/2 z-20 w-10 -translate-y-1/2 overflow-hidden rounded-md border border-transparent transition-[width,background-color,border-color,box-shadow] duration-200 ease-out max-[89.999rem]:hover:w-fit max-[89.999rem]:hover:border-border max-[89.999rem]:hover:bg-background max-[89.999rem]:hover:shadow-sm max-[89.999rem]:focus-within:w-fit max-[89.999rem]:focus-within:border-border max-[89.999rem]:focus-within:bg-background max-[89.999rem]:focus-within:shadow-sm min-[90rem]:static min-[90rem]:w-full min-[90rem]:translate-y-0 min-[90rem]:overflow-visible min-[90rem]:rounded-none min-[90rem]:border-0 min-[90rem]:bg-transparent min-[90rem]:shadow-none">
        <nav
          aria-label="Table of contents"
          className="w-max min-w-48 max-w-80 translate-x-2 p-4 text-sm opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 min-[90rem]:w-full min-[90rem]:min-w-0 min-[90rem]:max-w-none min-[90rem]:translate-x-0 min-[90rem]:border-l min-[90rem]:border-divider min-[90rem]:p-0 min-[90rem]:pl-4 min-[90rem]:opacity-100"
        >
          <p className="mb-2 text-xs font-medium leading-5 text-foreground-subtle">
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
                    className={`relative block overflow-hidden text-ellipsis whitespace-nowrap pr-2 leading-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                      item.level === 3 ? "pl-4" : ""
                    } ${
                      isActive
                        ? "text-accent min-[90rem]:before:absolute min-[90rem]:before:-left-4 min-[90rem]:before:top-2 min-[90rem]:before:h-4 min-[90rem]:before:w-0.5 min-[90rem]:before:rounded-full min-[90rem]:before:bg-accent min-[90rem]:before:content-['']"
                        : "text-foreground-subtle hover:text-foreground-muted"
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

        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 flex w-6 flex-col items-end justify-center gap-2 px-1.5 py-4 transition-opacity duration-100 group-hover:opacity-0 group-focus-within:opacity-0 min-[90rem]:hidden"
        >
          {items.map((item) => {
            const isActive = item.id === activeId

            return (
              <span
                key={item.id}
                className={`h-0.5 shrink-0 rounded-full transition-[width,background-color] ${
                  isActive
                    ? "w-4 bg-accent"
                    : item.level === 3
                      ? "w-1.5 bg-foreground-subtle"
                      : "w-2.5 bg-foreground-subtle"
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
