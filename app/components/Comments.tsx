"use client"

import Giscus from "@giscus/react"
import { useEffect, useState } from "react"

type GiscusTheme = "light" | "dark"

function getCurrentTheme(): GiscusTheme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

export default function Comments() {
  const [theme, setTheme] = useState<GiscusTheme | null>(null)
  const [giscusTheme, setGiscusTheme] = useState<string | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setTheme(getCurrentTheme())

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!theme) return

    const controller = new AbortController()
    const themeUrl = `${window.location.origin}/giscus/${theme}.css`

    if (window.location.protocol === "https:") {
      setGiscusTheme(themeUrl)
      return () => controller.abort()
    }

    const loadLocalTheme = async () => {
      try {
        const response = await fetch(themeUrl, { signal: controller.signal })
        if (!response.ok) throw new Error(`Failed to load ${themeUrl}`)

        const css = await response.text()
        setGiscusTheme(`data:text/css;base64,${window.btoa(css)}`)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setGiscusTheme(theme === "dark" ? "noborder_dark" : "noborder_light")
      }
    }

    void loadLocalTheme()
    return () => controller.abort()
  }, [theme])

  return (
    <section
      aria-labelledby="comments-heading"
      className="mt-12 border-t border-divider pt-10"
    >
      <h2 id="comments-heading" className="text-xl font-bold">
        Comments
      </h2>
      <div className="mt-5 min-h-24">
        {giscusTheme && (
          <Giscus
            id="comments"
            repo="kevin-on/kevinon.me"
            repoId="R_kgDOQq5TZg"
            category="Comments"
            categoryId="DIC_kwDOQq5TZs4DBBTB"
            mapping="pathname"
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={giscusTheme}
            lang="en"
          />
        )}
      </div>
    </section>
  )
}
