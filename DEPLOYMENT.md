# Render Deployment Guide

## Issue: Root directory "server" does not exist

### Solution 1: Update Render Dashboard Settings

1. Go to Render Dashboard → Your Service → Settings
2. Find "Root Directory" field
3. Set it to one of the following based on your GitHub repo structure:
   - If `server/` is at repo root: `server`
   - If `server/` is inside `QRCode/` folder: `QRCode/server`
4. Save and redeploy

### Solution 2: Verify GitHub Repository Structure

Your GitHub repo should have this structure:
```
QRCode---Project/
  ├── server/
  │   ├── index.js
  │   ├── package.json
  │   └── ...
  ├── client/
  └── render.yaml
```

If your structure is different, update the `rootDir` in `render.yaml` accordingly.

### Current render.yaml Configuration

The `render.yaml` file is set to use `rootDir: server`. If your GitHub repo has a different structure, update this value.

### Environment Variables Required

Make sure these are set in Render Dashboard:
- `PG_USER`
- `PG_HOST`
- `PG_DATABASE`
- `PG_PASSWORD`
- `PG_PORT`
- `PORT` (auto-set by Render)

