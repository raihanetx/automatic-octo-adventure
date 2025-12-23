# Vercel Production Deployment Checklist

## 📋 Pre-Deployment

- [ ] **Code Review**
  - [ ] No hardcoded secrets
  - [ ] Error handling in place
  - [ ] No console.log in production paths
  - [ ] TypeScript errors fixed
  - [ ] ESLint passes (`bun run lint`)

- [ ] **Environment Variables**
  - [ ] Generate secure `JWT_SECRET` (openssl rand -base64 64)
  - [ ] Verify `DATABASE_URL` includes SSL settings
  - [ ] Add both to Vercel environment variables
  - [ ] Set environment: Production, Preview, Development

- [ ] **Database**
  - [ ] Schema updated (`prisma db push`)
  - [ ] Seed script tested
  - [ ] Connection pooling configured (Neon pooler URL)
  - [ ] Backup strategy planned

## 🚀 Deployment Steps

### 1. Initial Deployment

```bash
# Commit all changes
git add .
git commit -m "Production ready"
git push origin main
```

- [ ] Import repository in Vercel
- [ ] Configure build settings (automatic via vercel.json)
- [ ] Set environment variables
- [ ] Trigger initial deployment
- [ ] Verify build succeeds

### 2. Post-Deployment Verification

- [ ] **Homepage loads** (https://your-domain.vercel.app)
- [ ] **Articles display** (check public articles)
- [ ] **Static assets load** (images, CSS, JS)
- [ ] **No console errors** (check browser dev tools)
- [ ] **API responses work** (check /api/articles)

### 3. Admin Dashboard Testing

- [ ] **Login page loads** (/admin/login)
- [ ] **Login succeeds** with correct credentials
- [ ] **Login fails** with wrong credentials
- [ ] **Dashboard loads** (/admin/dashboard)
- [ ] **Create article works**
- [ ] **Delete article works**
- [ ] **Toggle published works**
- [ ] **Logout works**

## 🔒 Security Verification

- [ ] **HTTPS enforced** (automatic on Vercel)
- [ ] **Security headers present**
  ```bash
  curl -I https://your-domain.vercel.app
  # Check for:
  # - Strict-Transport-Security
  # - X-Frame-Options
  # - X-Content-Type-Options
  # ```
- [ ] **Cookies are HTTP-Only** (check browser dev tools)
- [ ] **JWT_SECRET is random and long** (64+ chars)
- [ ] **Database credentials not exposed**
- [ ] **Rate limiting works** (try 6 login attempts)

## ⚡ Performance Verification

- [ ] **Lighthouse Score** > 90
  - Run Lighthouse audit
  - Check Performance, Accessibility, Best Practices

- [ ] **Cache Headers Present**
  ```bash
  curl -I https://your-domain.vercel.app/api/articles
  # Check for:
  # - Cache-Control
  # - CDN-Cache-Control
  ```

- [ ] **Bundle Size Optimized**
  - Check network tab
  - Initial load < 200KB
  - Lazy loading for images

- [ ] **API Response Time** < 500ms
  - Check Vercel Function logs
  - Time to first byte (TTFB)

## 🗄️ Database Verification

- [ ] **Connection works** from Vercel functions
- [ ] **Queries execute** (check logs)
- [ ] **Admin user exists**
  ```bash
  # Run seed if needed:
  bun run prisma/seed.ts
  ```

## 📱 Mobile Verification

- [ ] **Responsive design works**
  - Test on iPhone (375px)
  - Test on iPad (768px)
  - Test on Desktop (1920px)

- [ ] **Touch targets** 44px minimum
- [ ] **No horizontal scroll** on mobile
- [ ] **Font sizes readable** on mobile

## 🔔 Monitoring Setup (Post-Deployment)

### Vercel Analytics

- [ ] Install `@vercel/analytics`
- [ ] Add to layout.tsx
- [ ] Verify analytics dashboard

### Error Tracking

- [ ] Monitor Vercel Function logs
- [ ] Set up error rate alerts
- [ ] Set up response time alerts

### Uptime Monitoring (Optional)

- [ ] Set up uptime monitor (UptimeRobot, Pingdom, etc.)
- [ ] Configure alerts for downtime

## 🔄 Ongoing Maintenance

### Weekly
- [ ] Check Vercel logs for errors
- [ ] Monitor database usage (Neon dashboard)
- [ ] Review performance metrics

### Monthly
- [ ] Update dependencies (`bun update`)
- [ ] Review security advisories
- [ ] Backup database (Neon automated)

## 🆘 Rollback Plan

If deployment has issues:

```bash
# 1. Revert to last known good commit
git revert HEAD

# 2. Push to trigger redeploy
git push

# 3. Or use Vercel dashboard
# - Go to Deployments
# - Click "..." on previous deployment
# - Select "Promote to Production"
```

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Next Auth**: https://next-auth.js.org

## ✅ Production Readiness

Before marking as production-ready, ensure:

- [ ] All checklist items completed
- [ ] Tested by multiple users
- [ ] Load tested (100+ concurrent users)
- [ ] Mobile tested on iOS and Android
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Monitoring in place
- [ ] Rollback plan tested

---

## 🎯 Success Criteria

Production is successful when:

✅ All public pages load in < 2 seconds
✅ Admin dashboard is fully functional
✅ API responses are < 500ms (p95)
✅ No errors in production logs for 24 hours
✅ Lighthouse score > 90 on all pages
✅ Mobile experience is smooth
✅ Security headers present on all responses
