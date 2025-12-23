import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { UnauthorizedError, NotFoundError, ConflictError, handleApiError } from '@/lib/api-error';

// DELETE article (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('admin-token')?.value;
    const decoded = verifyToken(token || '');

    if (!decoded) {
      throw new UnauthorizedError();
    }

    // Check if article exists
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new NotFoundError('Article not found');
    }

    await db.article.delete({
      where: { id },
    });

    // Invalidate cache
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json(body, { status: statusCode });
  }
}

// PATCH update article (admin only) - for partial updates
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('admin-token')?.value;
    const decoded = verifyToken(token || '');

    if (!decoded) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, published } = body;

    // Check if article exists
    const existingArticle = await db.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      throw new NotFoundError('Article not found');
    }

    // If changing slug, check if new slug is unique
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await db.article.findUnique({
        where: { slug },
      });

      if (slugExists) {
        throw new ConflictError('Article with this slug already exists');
      }
    }

    const article = await db.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
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

    // Invalidate cache
    const response = NextResponse.json(article);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
