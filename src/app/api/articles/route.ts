import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { UnauthorizedError, ValidationError, ConflictError, handleApiError } from '@/lib/api-error';

// Cache configuration
const CACHE_TTL = 60 // 60 seconds for public articles
const CACHE_TTL_AUTH = 5 // 5 seconds for authenticated requests

// GET all published articles (public) or all articles (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    // If requesting unpublished articles, verify admin status
    let isAdmin = false;
    if (includeUnpublished) {
      const token = request.cookies.get('admin-token')?.value;
      const decoded = verifyToken(token || '');

      if (!decoded) {
        throw new UnauthorizedError();
      }
      isAdmin = true;
    }

    const articles = await db.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response = NextResponse.json(articles);

    // Add cache headers
    if (isAdmin) {
      response.headers.set('Cache-Control', `private, max-age=${CACHE_TTL_AUTH}`);
    } else {
      response.headers.set('Cache-Control', `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL * 2}`);
      response.headers.set('CDN-Cache-Control', `public, max-age=${CACHE_TTL * 2}`);
    }

    return response;
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json(body, { status: statusCode });
  }
}

// POST create new article (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    const decoded = verifyToken(token || '');

    if (!decoded) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, published } = body;

    if (!title || !slug || !content) {
      throw new ValidationError('Title, slug, and content are required');
    }

    // Check if slug is unique
    const existingArticle = await db.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      throw new ConflictError('Article with this slug already exists');
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published || false,
        authorId: decoded.adminId,
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

    const response = NextResponse.json(article, { status: 201 });
    // Invalidate cache for article list
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
