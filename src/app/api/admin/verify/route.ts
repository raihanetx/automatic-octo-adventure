import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { UnauthorizedError, handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedError('Invalid token');
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: decoded.adminId,
        username: decoded.username,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return NextResponse.json({ authenticated: false, ...body }, { status: statusCode });
  }
}
