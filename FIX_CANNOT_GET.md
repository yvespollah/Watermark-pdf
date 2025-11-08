# Fix "Cannot GET /" Error ✅

## Problem
When accessing your Render URL, you see: **"Cannot GET /"**

## Solution
I've already fixed this! Now you need to redeploy.

## What Was Fixed

1. ✅ Added root route (`/`) that returns API status
2. ✅ Added health check endpoint (`/api/health`)
3. ✅ Added static file serving for combined deployment
4. ✅ Updated frontend to use relative URLs in production

## Redeploy Steps

### Option 1: Push to GitHub (Recommended)

```bash
cd /home/schoolforall/Desktop/CSC-AL/pdf-watermark-app
git add .
git commit -m "Fix: Add root route and health check"
git push
```

Render will automatically detect the push and redeploy!

### Option 2: Manual Redeploy in Render

1. Go to your Render dashboard
2. Click on your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

## After Redeployment

Visit your Render URL. You should now see:

```json
{
  "status": "ok",
  "message": "PDF Watermark API is running",
  "endpoints": {
    "watermark": "POST /api/watermark"
  }
}
```

## For Single Service Deployment

If you want both frontend and backend in one service:

### Update Build Command in Render:
```
npm install && npm run build
```

### Keep Start Command:
```
node server.js
```

This will:
- Build the frontend into `/dist` folder
- Serve frontend at root URL
- Serve API at `/api/watermark`

## Test Endpoints

After deployment:

**Root (Frontend or API Status):**
```
https://your-app.onrender.com/
```

**Health Check:**
```
https://your-app.onrender.com/api/health
```

**Watermark API:**
```
POST https://your-app.onrender.com/api/watermark
```

## Still Having Issues?

### Check Render Logs:
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors

### Common Issues:

**Build Failed:**
- Check if all dependencies are in package.json
- Verify build command is correct

**Service Won't Start:**
- Check start command: `node server.js`
- Verify PORT environment variable is used

**Frontend Works But API Doesn't:**
- Check CORS settings
- Verify API routes are correct

## Need Help?

Check the deployment guides:
- `RENDER_SINGLE_SERVICE.md` - Single service deployment
- `DEPLOYMENT.md` - Full deployment guide
- `RENDER_QUICKSTART.md` - Quick start guide
