import { extractSharedZip, extractZip } from '@/actions/convertZip'
import { NextRequest, NextResponse } from 'next/server'

const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // Limit each user to 10 requests per windowMs
  store: new Map() // In-memory store to track requests
}

// Function to check if the user has exceeded the rate limit
function isRateLimited(userId: string) {
  const now = Date.now()
  const requests = rateLimit.store.get(userId) || []

  // Filter out requests that are outside the rate-limiting window
  const recentRequests = requests.filter(
    (timestamp: number) => now - timestamp < rateLimit.windowMs
  )

  // If the number of recent requests exceeds the limit, return true
  if (recentRequests.length >= rateLimit.maxRequests) {
    return true
  }

  // Store the current request timestamp
  recentRequests.push(now)
  rateLimit.store.set(userId, recentRequests)
  return false
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body || !body.userId || !body.slug || !body.shared) {
      return NextResponse.json({ message: 'Incomplete data' })
    }

    // Check rate limiting for the user
    if (isRateLimited(body.userId)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Determine which function to call based on 'shared' flag
    const files =
      body.shared === 'true'
        ? await extractSharedZip(body.userId, body.slug)
        : await extractZip(body.userId, body.slug)

    // Check if files are of Buffer type
    if (Buffer.isBuffer(files.zipContent)) {
      return new NextResponse(files.zipContent, {
        status: 200,
        headers: {
          'Content-Disposition': 'attachment; filename="download.zip"', // Adjust filename as needed
          'Content-Type': 'application/zip' // Set appropriate MIME type
        }
      })
    }

    return NextResponse.json({ message: 'Files not available for download' })
  } catch (err) {
    console.error('Error in POST request:', err)
    return NextResponse.json({ message: 'Failed to download' })
  }
}