# ArticleHub - Production Ready

A modern, production-ready article website built with Next.js 15, TypeScript, Neon PostgreSQL, and optimized for Vercel deployment.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Neon PostgreSQL with Prisma ORM
- **Authentication**: JWT-based secure admin authentication
- **Production Optimized**: Caching, rate limiting, security headers
- **Vercel Ready**: Optimized for serverless deployment
- **Responsive Design**: Mobile-first with shadcn/ui components
- **Markdown Support**: Write articles in Markdown format

## 📋 Prerequisites

- Node.js 18+ or Bun
- Neon PostgreSQL database
- Vercel account (for deployment)

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-secure-random-secret-key"
```

**Generate JWT_SECRET securely:**
```bash
openssl rand -base64 64
```

## 🏗️ Development Setup

```bash
# Install dependencies
bun install

# Setup database
bun run db:push

# Seed initial data (optional)
bun run prisma/seed.ts

# Start development server
bun run dev
```

Visit http://localhost:3000

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change these credentials in production!**

## 🚀 Vercel Deployment

### 1. Prepare for Deployment

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for production"
git push
```

2. **Configure Vercel**:

   a. Go to [vercel.com](https://vercel.com) and import your repository
   b. Configure Environment Variables:
      - `DATABASE_URL`: Your Neon connection string
      - `JWT_SECRET`: Your generated secret (generate with `openssl rand -base64 64`)
   c. Click Deploy

### 2. Vercel-Specific Optimizations

This project includes several Vercel-specific optimizations:

- **Middleware**: Security headers, CORS, cache control
- **API Caching**: Cache headers for static content
- **Rate Limiting**: Prevents abuse of login endpoint
- **Singleton Prisma**: Connection pooling for serverless
- **Optimized Builds**: Prisma generate before build

### 3. Post-Deployment Steps

1. **Seed Production Database**:
   - Access Vercel project logs
   - Run: `bun run prisma/seed.ts`
   - **Or** create admin via Vercel CLI/SSH

2. **Test Critical Flows**:
   - ✅ Homepage loads
   - ✅ Articles display
   - ✅ Admin login works
   - ✅ Article creation works
   - ✅ Article deletion works

## 🔒 Security Features

- **JWT Authentication**: Secure, stateless authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Rate Limiting**: 5 login attempts per minute
- **Security Headers**: HSTS, CSP, XSS Protection
- **Password Hashing**: bcrypt with 12 rounds
- **Environment Variables**: Secrets stored securely

## 📊 Performance Optimizations

### Caching Strategy
- Public articles: 60s cache (browser), 120s (CDN)
- Authenticated requests: 5s cache
- Static assets: 1 year cache, immutable
- Stale content: 30s revalidation

### Serverless Optimizations
- Prisma singleton pattern
- Connection pooling ready (Neon provides pooler)
- Edge runtime compatible routes
- Minimal cold starts

### Build Optimizations
- Tree shaking enabled
- Dynamic imports where needed
- Image optimization ready
- Font optimization

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin endpoints
│   │   │   └── articles/      # Article endpoints
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── articles/          # Article pages
│   │   └── page.tsx           # Homepage
│   ├── components/ui/          # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # Authentication
│   │   ├── db.ts             # Database
│   │   ├── api-error.ts      # Error handling
│   │   └── rate-limit.ts     # Rate limiting
│   └── middleware.ts          # Security middleware
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts               # Seed script
├── public/                     # Static assets
└── vercel.json                # Vercel configuration
```

## 🛠️ Maintenance

### Database Migrations

```bash
# Create migration
bun prisma migrate dev --name migration_name

# Apply to production
bun prisma migrate deploy
```

### Reset Database (⚠️ Development Only)

```bash
bun prisma migrate reset
bun run prisma/seed.ts
```

## 🐛 Troubleshooting

### Vercel Deployment Issues

**Build Fails:**
```bash
# Check environment variables are set in Vercel dashboard
# Verify DATABASE_URL is correct
```

**Database Connection Issues:**
```bash
# Neon provides pooled connection for serverless
# Ensure ?sslmode=require&channel_binding=require is in URL
```

**Authentication Issues:**
```bash
# Verify JWT_SECRET matches between local and Vercel
# Check cookie domain settings
```

### Performance Issues

**Slow API Responses:**
- Check Vercel Edge logs
- Enable Prisma query logging temporarily
- Consider adding Redis for production rate limiting

## 📈 Monitoring (Recommended)

### Add Vercel Analytics

1. Install `@vercel/analytics`
2. Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Log Management

- Vercel provides built-in logging
- Check dashboard for errors
- Set up alerts for critical failures

## 📄 License

This project is production-ready and optimized for Vercel deployment.

## 🤝 Contributing

For production deployment:
1. Test thoroughly in development
2. Update environment variables
3. Deploy to Vercel Preview first
4. Test on Preview environment
5. Deploy to Production
6. Verify all critical paths

## 🆘 Support

For issues related to:
- **Database**: Neon documentation
- **Hosting**: Vercel documentation
- **Framework**: Next.js documentation
