import type { MDXComponents } from "mdx/types"

const components: MDXComponents = {
  pre: (props) => <pre suppressHydrationWarning {...props} />,
}

export function useMDXComponents(): MDXComponents {
  return components
}
