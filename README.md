# MotionText SaaS Tool

A professional-grade web-based video editor for motion typography.

## Tech Stack
- **Frontend**: React (UI), Remotion (Video Engine)
- **Styling**: Tailwind CSS
- **Deployment**: Next.js or Vite (Frontend), Node.js (Backend)

## Deployment Instructions (Production)

### 1. Frontend
Deploy the React application as a Static Site (Vercel, Netlify, or AWS S3 + CloudFront).

### 2. Backend (The Render Engine)
Remotion rendering is CPU intensive. For a scalable SaaS:
- **AWS Lambda**: Use `@remotion/lambda` to spin up thousands of parallel renders.
- **Node.js + FFmpeg**: If self-hosting, ensure FFmpeg is installed in your Docker container. Use the `@remotion/renderer` package to execute the `renderVideo` command.

### 3. Scaling for SaaS
- **S3 Storage**: Store rendered files in an S3 bucket with a TTL (Time To Live).
- **Webhooks**: Use webhooks to notify the frontend when a render is complete.
- **Caching**: Cache compositions and assets to speed up previewing.

## Future Presets Implementation
The modular structure in `remotion/animations/` allows adding the remaining 8 presets (Liquid, Shatter, etc.) as independent React components using `canvas` or `svg` filters for high performance.