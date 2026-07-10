"use client"

import { useEffect, useId, useRef, useState } from "react"

type ThemeChoice = "system" | "light" | "dark"
type EffectiveTheme = Exclude<ThemeChoice, "system">

const THEME_STORAGE_KEY = "theme-preference"
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)"

function isThemeChoice(
  value: string | null | undefined
): value is ThemeChoice {
  return value === "system" || value === "light" || value === "dark"
}

function getInitialThemeChoice(): ThemeChoice {
  if (typeof document === "undefined") return "system"

  const rootChoice = document.documentElement.dataset.themeChoice
  return isThemeChoice(rootChoice) ? rootChoice : "system"
}

function getEffectiveTheme(choice: ThemeChoice): EffectiveTheme {
  if (choice !== "system") return choice
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light"
}

function applyTheme(choice: ThemeChoice, persist = true) {
  const root = document.documentElement
  root.dataset.theme = getEffectiveTheme(choice)
  root.dataset.themeChoice = choice

  if (!persist) return

  try {
    if (choice === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, choice)
    }
  } catch {
    // Theme selection still works when storage is unavailable.
  }
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
      />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"
      />
    </svg>
  )
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 21h8M12 17v4" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  )
}

const THEME_OPTIONS = [
  { value: "system" as const, label: "System", Icon: MonitorIcon },
  { value: "light" as const, label: "Light", Icon: SunIcon },
  { value: "dark" as const, label: "Dark", Icon: MoonIcon },
]

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(getInitialThemeChoice)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverId = useId()

  useEffect(() => {
    const systemTheme = window.matchMedia(SYSTEM_THEME_QUERY)
    const handleSystemThemeChange = () => {
      if (document.documentElement.dataset.themeChoice === "system") {
        applyTheme("system", false)
      }
    }

    systemTheme.addEventListener("change", handleSystemThemeChange)
    return () => {
      systemTheme.removeEventListener("change", handleSystemThemeChange)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const selectTheme = (nextChoice: ThemeChoice) => {
    setChoice(nextChoice)
    applyTheme(nextChoice)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-controls={popoverId}
        aria-expanded={isOpen}
        aria-label="Theme settings"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-divider bg-background-elv text-foreground-2 transition-colors hover:bg-background-soft hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="theme-icon-sun">
          <SunIcon className="h-4 w-4" />
        </span>
        <span className="theme-icon-moon">
          <MoonIcon className="h-4 w-4" />
        </span>
      </button>

      {isOpen && (
        <div
          id={popoverId}
          className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-divider bg-background-elv p-1.5 text-foreground shadow-lg"
        >
          <p className="px-2 py-1 text-xs font-medium text-foreground-3">
            Theme
          </p>
          <div role="group" aria-label="Theme">
            {THEME_OPTIONS.map(({ value, label, Icon }) => {
              const selected = choice === value

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground-2 transition-colors hover:bg-background-soft hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                  onClick={() => selectTheme(value)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  <CheckIcon
                    className={`ml-auto h-4 w-4 text-brand ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
