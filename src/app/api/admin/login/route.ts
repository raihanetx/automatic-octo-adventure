import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { UnauthorizedError, ValidationError, handleApiError } from '@/lib/api-error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    // Rate limiting
    try {
      rateLimit({
        identifier: `login:${getClientIp(request)}`,
        limit: 5, // 5 attempts per minute
        windowMs: 60000,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
    }

    // Find admin user
    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Generate JWT token
    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
    });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });

    // Set HTTP-only cookie with security settings
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      ...(process.env.NODE_ENV === 'production' && { domain: process.env.COOKIE_DOMAIN }),
    });

    return response;
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json(body, { status: statusCode });
  }
}
