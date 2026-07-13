import katex from "katex"
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react"
import type { MDXComponents } from "mdx/types"

type CodeProps = ComponentPropsWithoutRef<"code">
type PreProps = ComponentPropsWithoutRef<"pre">
type TableProps = ComponentPropsWithoutRef<"table">

const mathCache = new Map<string, string>()
const mathAccentMacro =
  "\\htmlStyle{color:var(--color-math-accent);}{#1}"

function hasClass(className: string | undefined, name: string) {
  return className?.split(/\s+/).includes(name) ?? false
}

function getMathSource(children: ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children
      .filter(
        (child): child is string | number =>
          typeof child === "string" || typeof child === "number"
      )
      .join("")
  }

  return ""
}

function renderMath(source: string, displayMode: boolean) {
  const key = `${displayMode ? "display" : "inline"}:${source}`
  const cached = mathCache.get(key)

  if (cached) {
    return cached
  }

  let html: string

  try {
    html = katex.renderToString(source, {
      displayMode,
      macros: {
        "\\accent": mathAccentMacro,
      },
      output: "htmlAndMathml",
      strict: (errorCode) =>
        errorCode === "htmlExtension" ? "ignore" : "warn",
      throwOnError: true,
      trust: ({ command }) => command === "\\htmlStyle",
    })
  } catch {
    html = katex.renderToString(source, {
      displayMode,
      macros: {
        "\\accent": mathAccentMacro,
      },
      output: "htmlAndMathml",
      strict: "ignore",
      throwOnError: false,
      trust: ({ command }) => command === "\\htmlStyle",
    })
  }

  mathCache.set(key, html)
  return html
}

function Code({ className, children, ...props }: CodeProps) {
  const mathInline = hasClass(className, "math-inline")
  const languageMath = hasClass(className, "language-math")
  const mathDisplay =
    hasClass(className, "math-display") || (languageMath && !mathInline)

  if (!mathInline && !mathDisplay) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  const html = renderMath(getMathSource(children), mathDisplay)

  return (
    <span
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function Pre({ children, tabIndex, ...props }: PreProps) {
  if (
    isValidElement<{ className?: string }>(children) &&
    (hasClass(children.props.className, "math-display") ||
      (hasClass(children.props.className, "language-math") &&
        !hasClass(children.props.className, "math-inline")))
  ) {
    return children
  }

  return (
    <pre suppressHydrationWarning tabIndex={tabIndex ?? 0} {...props}>
      {children}
    </pre>
  )
}

function Table(props: TableProps) {
  return (
    <div
      aria-label="Scrollable table"
      className="prose-table-scroll"
      role="group"
      tabIndex={0}
    >
      <table {...props} />
    </div>
  )
}

const components: MDXComponents = {
  code: Code,
  pre: Pre,
  table: Table,
}

export function useMDXComponents(): MDXComponents {
  return components
}
