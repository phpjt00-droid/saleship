---
description: How to deploy the Saleship community to Cloudflare Pages
---

# Cloudflare Pages Deployment Workflow

This workflow guides you through the process of building and deploying the Saleship project to Cloudflare Pages.

### Prerequisites
- Node.js installed
- Cloudflare account and Wrangler CLI authenticated (`npx wrangler login`)

### Deployment Steps

1. **Install Dependencies** (if not done)
```bash
npm install
```

2. **Build the Project**
// turbo
```bash
npm run build
```
> [!NOTE]
> This generates a static export in the `./out` directory.

3. **Deploy to Cloudflare Pages**
// turbo
```bash
npx wrangler pages deploy ./out --project-name=saleship
```

### Automatic CI/CD (Optional)
If you connect your GitHub repository to Cloudflare Pages:
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/`
- **Environment variables**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in the Cloudflare Dashboard.
