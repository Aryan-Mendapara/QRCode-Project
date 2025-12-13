# Quick Fix: Render PostgreSQL Connection

## The Problem
Your app is trying to connect to `127.0.0.1:5432` (localhost) because `DATABASE_URL` is not set in Render.

## The Solution (5 Minutes)

### Step 1: Create PostgreSQL Database (if not already created)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `qrcode-db` (or any name)
   - **Database**: `qrcode` (or any name)
   - **User**: `qrcode_user` (or any name)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: Latest
   - **Plan**: Free (or paid if needed)
4. Click **"Create Database"**
5. Wait 2-3 minutes for database to be provisioned

### Step 2: Link Database to Your Web Service
1. Go to your **Web Service** (the one showing the error)
2. Click on **"Settings"** tab
3. Scroll down to **"Environment"** section
4. Find **"Link Database"** button (or "Add Database" link)
5. Click it and select your PostgreSQL database from dropdown
6. Click **"Link"** or **"Save"**

### Step 3: Verify DATABASE_URL is Set
1. Still in Settings → Environment
2. Look for `DATABASE_URL` in the environment variables list
3. It should be there automatically after linking
4. It should look like: `postgresql://user:password@host:port/database`

### Step 4: Redeploy
1. Go to **"Events"** or **"Manual Deploy"** tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete
4. Check logs - you should see: `✅ PostgreSQL connected`

## Alternative: Manual DATABASE_URL Setup

If "Link Database" doesn't work:

1. Go to your **PostgreSQL Database** → **"Info"** tab
2. Copy the **"Internal Database URL"** or **"External Database URL"**
3. Go to your **Web Service** → **Settings** → **Environment**
4. Click **"Add Environment Variable"**
5. Key: `DATABASE_URL`
6. Value: Paste the connection string you copied
7. Click **"Save Changes"**
8. Redeploy your service

## Verify It's Working

After deployment, check the logs. You should see:
```
📌 Using DATABASE_URL connection string
✅ PostgreSQL connected
✅ QR Codes table is ready.
🚀 Server running on port 10000
```

If you still see `ECONNREFUSED 127.0.0.1:5432`, it means `DATABASE_URL` is still not set. Double-check the environment variables.

## Common Issues

### "Link Database" button not visible
- Make sure you're in the **Web Service** settings, not the database settings
- The database must be fully provisioned (green status)

### DATABASE_URL not appearing after linking
- Try unlinking and linking again
- Or manually add it using the Alternative method above

### Still getting connection errors
- Verify the database is running (green status in Render dashboard)
- Check that DATABASE_URL is correctly formatted
- Make sure you're using the correct database (Internal vs External URL)

