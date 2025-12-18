const CHESS_USERNAME = "kevin_on"
const CHESS_API_BASE = "https://api.chess.com/pub/player"

type ChessRating = {
  last: { rating: number; date: number }
  best: { rating: number; date: number }
  record: { win: number; loss: number; draw: number }
}

type ChessStats = {
  chess_rapid?: ChessRating
  chess_blitz?: ChessRating
}

type ChessGame = {
  end_time: number
  time_class: string
  white: { username: string; rating: number }
  black: { username: string; rating: number }
}

export type ChessData = {
  rapid: { current: number; change: number } | null
  blitz: { current: number; change: number } | null
}

async function fetchStats(): Promise<ChessStats> {
  const res = await fetch(`${CHESS_API_BASE}/${CHESS_USERNAME}/stats`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error("Failed to fetch chess stats")
  return res.json()
}

async function fetchGamesForMonth(
  year: number,
  month: number
): Promise<ChessGame[]> {
  const monthStr = month.toString().padStart(2, "0")
  const res = await fetch(
    `${CHESS_API_BASE}/${CHESS_USERNAME}/games/${year}/${monthStr}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.games || []
}

function findRatingAtDate(
  games: ChessGame[],
  timeClass: string,
  targetDate: number
): number | null {
  const filtered = games
    .filter((g) => g.time_class === timeClass && g.end_time <= targetDate)
    .sort((a, b) => b.end_time - a.end_time)

  if (filtered.length === 0) return null

  const game = filtered[0]
  if (game.white.username.toLowerCase() === CHESS_USERNAME) {
    return game.white.rating
  }
  return game.black.rating
}

export async function getChessData(): Promise<ChessData> {
  try {
    const stats = await fetchStats()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgoTs = Math.floor(thirtyDaysAgo.getTime() / 1000)

    // Fetch games from current month and previous month
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const [currentGames, prevGames] = await Promise.all([
      fetchGamesForMonth(currentYear, currentMonth),
      fetchGamesForMonth(prevYear, prevMonth),
    ])
    const allGames = [...prevGames, ...currentGames]

    let rapid: ChessData["rapid"] = null
    let blitz: ChessData["blitz"] = null

    if (stats.chess_rapid?.last) {
      const current = stats.chess_rapid.last.rating
      const oldRating = findRatingAtDate(allGames, "rapid", thirtyDaysAgoTs)
      rapid = {
        current,
        change: oldRating ? current - oldRating : 0,
      }
    }

    if (stats.chess_blitz?.last) {
      const current = stats.chess_blitz.last.rating
      const oldRating = findRatingAtDate(allGames, "blitz", thirtyDaysAgoTs)
      blitz = {
        current,
        change: oldRating ? current - oldRating : 0,
      }
    }

    return { rapid, blitz }
  } catch (error) {
    console.error("Failed to fetch chess data:", error)
    return { rapid: null, blitz: null }
  }
}
