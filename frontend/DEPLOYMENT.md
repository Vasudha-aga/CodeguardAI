# 🚀 CodeGuard AI - Deployment Guide

## Frontend Deployment Options

---

## Option 1: Vercel (Recommended - FREE)

### Why Vercel?
- ✅ Free hosting for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for React apps
- ✅ Easy setup

### Steps:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CodeGuard AI"
   git remote add origin https://github.com/yourusername/codeguard-ai.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Vite
   - Click "Deploy"

3. **Done!**
   - Your app will be live at: `codeguard-ai.vercel.app`

---

## Option 2: Netlify (FREE)

### Steps:

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "Add new site" → "Import existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy"

3. **Custom Domain** (Optional)
   - Go to Site settings → Domain management
   - Add your custom domain

---

## Option 3: GitHub Pages

### Steps:

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/codeguard-ai",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/codeguard-ai/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## Option 4: Local Presentation

### For Demo During Presentation:

1. **Start Development Server**
   ```bash
   npm install
   npm run dev
   ```

2. **Access locally at:** `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📦 Build Output

After running `npm run build`, you'll get:

```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

This `dist` folder can be deployed anywhere!

---

## 🌐 Custom Domain Setup

### After deployment:

1. **Buy Domain** (Optional)
   - Namecheap, GoDaddy, Google Domains
   - Example: `codeguard.ai`

2. **Configure DNS**
   - For Vercel/Netlify, follow their DNS guides
   - Add CNAME record pointing to your deployment

3. **HTTPS**
   - Both Vercel and Netlify provide free SSL

---

## 📊 Environment Variables

Currently not needed, but for future backend integration:

### Create `.env` file:
```env
VITE_API_URL=https://api.codeguard.ai
VITE_API_KEY=your_api_key_here
```

### Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🔐 Security Best Practices

Before deploying:

1. **Never commit:**
   - `.env` files
   - API keys
   - Sensitive data

2. **Add to `.gitignore`:**
   ```
   .env
   .env.local
   node_modules/
   dist/
   ```

3. **Use environment variables** for any API keys

---

## 📱 Performance Optimization

### Before deployment:

1. **Optimize Images**
   - Use WebP format
   - Compress images
   - Lazy load images

2. **Code Splitting**
   - Already implemented with React Router
   - Lazy load routes if needed

3. **Build Analysis**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

---

## 🧪 Testing Before Deployment

### Checklist:

- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Charts render properly
- [ ] Forms work
- [ ] Build succeeds (`npm run build`)

---

## 📈 Analytics (Optional)

### Add Google Analytics:

1. Get tracking ID from [analytics.google.com](https://analytics.google.com)

2. Add to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

---

## 🐛 Troubleshooting

### "Routes don't work after deployment"
**Solution:** Configure server to redirect all routes to `index.html`

For Vercel, create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

For Netlify, create `_redirects` in `public/`:
```
/*    /index.html   200
```

### "Build fails"
**Solution:** 
- Check Node version (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors

### "Assets not loading"
**Solution:**
- Check `base` path in vite.config.ts
- Ensure all imports use relative paths

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Vercel:**
- 100 GB bandwidth/month
- Unlimited projects
- Custom domains
- Perfect for demo/portfolio

**Netlify:**
- 100 GB bandwidth/month
- Unlimited projects
- Custom domains

**GitHub Pages:**
- Completely free
- Unlimited bandwidth
- Public repos only

### Recommendation:
**Start with Vercel** - Best developer experience + free

---

## 🎓 For Your Project Report

### Mention in Report:

**Deployment Platform:** Vercel / Netlify / GitHub Pages  
**URL:** [Your deployed URL]  
**Build Time:** ~30 seconds  
**Deployment Method:** CI/CD via Git push  
**Hosting Type:** Static site hosting  

---

## 📝 Post-Deployment

After deploying:

1. **Test on multiple devices**
   - Desktop
   - Mobile
   - Tablet

2. **Share the link**
   - Add to resume
   - Include in project report
   - Show to examiners

3. **Monitor**
   - Check analytics
   - Look for errors
   - Get user feedback

---

## 🚀 Quick Deploy Commands

```bash
# 1. Build
npm run build

# 2. Preview locally
npm run preview

# 3. Deploy to Vercel
vercel

# Or deploy to Netlify
netlify deploy --prod

# Or deploy to GitHub Pages
npm run deploy
```

---

## 🎉 You're Live!

Once deployed, you'll have:
- ✅ Live, shareable URL
- ✅ Professional portfolio piece
- ✅ HTTPS security
- ✅ Global CDN delivery
- ✅ Automatic updates on git push

**Example URLs:**
- `https://codeguard-ai.vercel.app`
- `https://codeguard-ai.netlify.app`
- `https://yourusername.github.io/codeguard-ai`

---

## 📞 Support

If you face issues:
1. Check Vercel/Netlify documentation
2. Review build logs
3. Check browser console
4. Verify all files are committed

---

**Happy Deploying! 🚀**

Your CodeGuard AI frontend is production-ready!
