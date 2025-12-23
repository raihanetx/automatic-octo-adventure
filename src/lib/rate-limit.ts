// Simple in-memory rate limiter for Vercel
// For production with multiple instances, consider using Redis (e.g., Upstash)

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function rateLimit({
  identifier,
  limit = 5,
  windowMs = 60000, // 1 minute default
}: {
  identifier: string
  limit?: number
  windowMs?: number
}) {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(identifier)
  }

  // Get or create entry
  const currentEntry = rateLimitStore.get(identifier) || {
    count: 0,
    resetTime: now + windowMs,
  }

  // Check limit
  if (currentEntry.count >= limit) {
    const resetIn = Math.ceil((currentEntry.resetTime - now) / 1000)
    throw new Error(`Rate limit exceeded. Try again in ${resetIn} seconds.`)
  }

  // Increment count
  currentEntry.count++
  rateLimitStore.set(identifier, currentEntry)

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  return {
    success: true,
    remaining: limit - currentEntry.count,
    reset: currentEntry.resetTime,
  }
}

// Get client IP from request
export function getClientIp(request: Request): string {
  // Try various headers for IP
  const headers = request.headers
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
