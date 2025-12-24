import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

// Type for route params
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Fetches the event identified by the route `slug` for GET /api/events/[slug].
 *
 * @param params - Route parameters object containing `slug`, the slug string used to locate the event.
 * @returns A NextResponse with one of the following JSON shapes:
 *  - 200: `{ success: true, data: <event> }` when the event is found.
 *  - 400: `{ error: 'Invalid slug parameter' }` when `slug` is missing or empty.
 *  - 404: `{ error: 'Event not found' }` when no matching event exists.
 *  - 500: `{ error: 'Internal server error', message: <error message> }` on unexpected failures.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await params (required in Next.js 15+)
    const { slug } = await params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (consider using a proper logger in production)
    console.error('Error fetching event by slug:', error);

    // Return generic error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}