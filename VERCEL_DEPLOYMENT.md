# AR IPTV Viewer - Vercel Deployment Guide

## Prerequisites
- Node.js 18+ (or use Vercel's default)
- pnpm package manager
- Vercel account (https://vercel.com)

## Local Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run development server
pnpm run dev
```

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel
```

### Option 2: Connect GitHub Repository

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure:
   - Framework: `Vite`
   - Root Directory: `./` (or leave default)
   - Build Command: `pnpm run build`
   - Output Directory: `artifacts/ar-iptv/dist/public`
5. Add environment variables (if needed)
6. Deploy

## Environment Variables

Create a `.env.production` file or set them in Vercel dashboard:

```
VITE_API_URL=https://your-api-domain.com
VITE_API_BASE_PATH=/api
```

## Project Structure

```
- artifacts/
  - ar-iptv/          # React/Vite frontend
    - dist/public/    # Build output
  - api-server/       # Express.js backend (optional)
- lib/
  - api-client-react/ # API client library
  - api-spec/         # OpenAPI spec
```

## Build Output

- **Frontend**: `artifacts/ar-iptv/dist/public/`
- This directory is automatically served by Vercel

## Troubleshooting

### Build fails with "command not found"
- Ensure you're using `pnpm` not `npm`
- Check Node.js version: `node --version` (should be 18+)

### Environment variables not loading
- Prefix variables with `VITE_` to expose them to the browser
- Set them in Vercel Dashboard → Settings → Environment Variables

### Port issues
- Vercel automatically assigns a port; local testing uses port from `.env` file

## Notes

- This deployment uses the frontend only
- For API deployment, deploy `api-server` separately or use Vercel Functions
- CORS must be configured if API and frontend are on different domains
