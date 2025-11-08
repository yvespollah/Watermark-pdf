# Quick Start: Deploy to Render in 5 Minutes

## 1. Push to GitHub

```bash
cd /home/schoolforall/Desktop/CSC-AL/pdf-watermark-app

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pdf-watermark-app.git
git branch -M main
git push -u origin main
```

## 2. Deploy Backend

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `pdf-watermark-api`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **"Create Web Service"**
6. **Copy your API URL** (e.g., `https://pdf-watermark-api.onrender.com`)

## 3. Update Frontend

Create `.env.production` file:
```bash
VITE_API_URL=https://YOUR-API-URL.onrender.com
```

Replace `YOUR-API-URL` with your actual Render backend URL.

```bash
git add .
git commit -m "Add production API URL"
git push
```

## 4. Deploy Frontend

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select same repository
3. Configure:
   - **Name**: `pdf-watermark-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from step 2
5. Click **"Create Static Site"**

## 5. Done! 🎉

Your app is live at: `https://pdf-watermark-frontend.onrender.com`

## Notes

- **Free tier**: Services sleep after 15 min inactivity
- **First request**: May take 30-60 seconds to wake up
- **Auto-deploy**: Push to GitHub = automatic deployment

## Troubleshooting

**CORS Error?**
Update `server.js`:
```javascript
app.use(cors({
  origin: 'https://pdf-watermark-frontend.onrender.com'
}));
```

**Build Failed?**
Check logs in Render dashboard for errors.

**Need Help?**
See full guide in `DEPLOYMENT.md`
