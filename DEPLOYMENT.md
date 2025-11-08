# Deploying PDF Watermark App to Render

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- Git installed locally

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
cd /home/schoolforall/Desktop/CSC-AL/pdf-watermark-app
git init
git add .
git commit -m "Initial commit - PDF Watermark App"
```

2. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "pdf-watermark-app")
   - Don't initialize with README (you already have files)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pdf-watermark-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend API on Render

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select "pdf-watermark-app" repository

3. **Configure the Backend Service**:
   - **Name**: `pdf-watermark-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (or paid for better performance)

4. **Environment Variables**:
   - Add: `NODE_ENV` = `production`
   - PORT will be automatically set by Render

5. **Click "Create Web Service"**

6. **Note your API URL**: 
   - Will be something like: `https://pdf-watermark-api.onrender.com`

## Step 3: Update Frontend for Production

1. **Update the API URL in your frontend**:

Edit `src/App.jsx` and replace:
```javascript
const response = await fetch('http://localhost:3002/api/watermark', {
```

With:
```javascript
const response = await fetch('https://YOUR-API-URL.onrender.com/api/watermark', {
```

Replace `YOUR-API-URL` with your actual Render backend URL.

2. **Commit and push changes**:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

## Step 4: Deploy Frontend on Render

1. **Create New Static Site**:
   - Click "New +" → "Static Site"
   - Select same repository

2. **Configure the Frontend**:
   - **Name**: `pdf-watermark-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Click "Create Static Site"**

4. **Your frontend URL**:
   - Will be something like: `https://pdf-watermark-frontend.onrender.com`

## Step 5: Update CORS Settings

Update `server.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: ['https://pdf-watermark-frontend.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy.

## Alternative: Single Service Deployment

If you want to serve both frontend and backend from one service:

1. Update `server.js` to serve static files:
```javascript
// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// All other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

2. Update build command to include frontend:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`

## Important Notes

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for one service 24/7)

### File Storage:
- Render's filesystem is ephemeral
- Uploaded files are deleted on restart
- Current implementation cleans up files after processing (good!)
- For persistent storage, consider using AWS S3 or Cloudinary

### Environment Variables:
- Never commit sensitive data
- Use Render's environment variables for secrets
- API keys, database URLs, etc.

## Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### API Not Responding:
- Check service logs in Render
- Verify CORS settings
- Ensure PORT environment variable is used

### Frontend Can't Connect:
- Verify API URL in frontend code
- Check browser console for CORS errors
- Ensure API service is running

## Testing Production Deployment

1. Visit your frontend URL
2. Upload a PDF file
3. Add watermark text
4. Optionally upload a logo
5. Click "Add Watermark & Download"
6. Verify the watermarked PDF downloads correctly

## Monitoring

- Check Render dashboard for:
  - Service health
  - Logs
  - Metrics
  - Deployment history

## Updating Your App

Simply push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

Render will automatically detect changes and redeploy!

## Cost Optimization

**Free Tier** (Current setup):
- Backend: Free web service
- Frontend: Free static site
- Total: $0/month

**Paid Tier** (Better performance):
- Backend: $7/month (Starter)
- Frontend: Free
- Total: $7/month
- Benefits: No spin-down, faster response times

## Support

- Render Docs: https://render.com/docs
- Community: https://community.render.com
