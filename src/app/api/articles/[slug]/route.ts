import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NotFoundError, handleApiError } from '@/lib/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await db.article.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    const response = NextResponse.json(article);

    // Add cache headers for static content
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=30');

    return response;
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
