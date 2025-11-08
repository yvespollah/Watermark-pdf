# Deploy as Single Service on Render (Recommended)

This approach deploys both frontend and backend as one service, which is simpler and uses only one free tier slot.

## Step 1: Update package.json

The build script should build the frontend:

```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon server.js",
  "client": "vite",
  "build": "vite build",
  "start": "node server.js"
}
```

✅ Already configured!

## Step 2: Push to GitHub

```bash
cd /home/schoolforall/Desktop/CSC-AL/pdf-watermark-app
git add .
git commit -m "Add health check and static file serving"
git push
```

## Step 3: Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

   **Basic Settings:**
   - **Name**: `pdf-watermark-app`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`

   **Build & Deploy:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`

   **Instance Type:**
   - Select **Free** (or paid for better performance)

5. Click **"Create Web Service"**

## Step 4: Wait for Deployment

- Render will install dependencies and build your app
- This takes 2-5 minutes
- Watch the logs for any errors

## Step 5: Test Your App

Your app will be live at: `https://pdf-watermark-app.onrender.com`

**Test the API:**
- Visit: `https://your-app.onrender.com/`
- Should see: `{"status":"ok","message":"PDF Watermark API is running"...}`

**Test the Frontend:**
- Visit: `https://your-app.onrender.com`
- Should see your PDF watermark interface

## How It Works

The server now:
1. Serves the API at `/api/watermark`
2. Serves static frontend files from `/dist` folder
3. Has a health check at `/` and `/api/health`
4. Automatically detects if running in API-only or combined mode

## Troubleshooting

### "Cannot GET /"
✅ **Fixed!** The server now has a root route.

### Build Fails
Check Render logs for errors. Common issues:
- Missing dependencies in package.json
- Build command errors

### Frontend Shows But API Doesn't Work
- Check that CORS is configured correctly
- Verify the API URL in your frontend code
- For single service, use relative URLs: `/api/watermark`

### Update Frontend API URL

Since both are on same domain, update `src/App.jsx`:

```javascript
// Change from:
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// To:
const apiUrl = import.meta.env.VITE_API_URL || '';
```

This uses relative URLs in production (same domain) and localhost in development.

## Advantages of Single Service

✅ **Simpler**: One deployment instead of two
✅ **No CORS issues**: Frontend and backend on same domain  
✅ **Free tier**: Uses only 1 free service slot
✅ **Faster**: No cross-domain requests

## Environment Variables (Optional)

If you need any:
- Go to your service in Render dashboard
- Click "Environment"
- Add variables like `NODE_ENV=production`

## Auto-Deploy

Every push to GitHub automatically redeploys!

```bash
git add .
git commit -m "Update feature"
git push
```

Render detects the push and redeploys automatically.

## Monitoring

Check Render dashboard for:
- **Logs**: Real-time server logs
- **Metrics**: CPU, memory usage
- **Events**: Deployment history

## Custom Domain (Optional)

1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as instructed

## Done! 🎉

Your PDF watermark app is now live and accessible worldwide!
