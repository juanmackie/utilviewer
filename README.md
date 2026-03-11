# .util File Viewer

A lightweight web application for viewing .util files (ZIP archives containing text content) directly in your browser. All processing happens client-side for privacy and security.

## ✨ Features

- **Client-Side Processing**: Files are processed entirely in your browser - nothing is uploaded to servers
- **Drag & Drop Support**: Easily upload .util files by dragging them onto the interface
- **Archive Content Navigation**: Browse and view individual files within .util archives
- **Copy Functionality**: Copy file contents to clipboard with a single click
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Vite, React, and Tailwind CSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to see your application running during development.

## 🚀 Deploy to GitHub Pages

This application is configured for easy GitHub Pages deployment:

### Option 1: Automatic Deployment (Recommended)

```bash
# This builds and deploys to the gh-pages branch
npm run deploy
```

### Option 2: Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Push the `dist/` folder to the `gh-pages` branch:
   ```bash
   npx gh-pages -d dist
   ```

3. Your app will be available at `https://yourusername.github.io/utilviewer`

### GitHub Actions (Optional)

For automatic deployment on every push to main, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📁 Supported File Types

This application supports `.util` files which are typically ZIP archives containing text-based content. The viewer extracts and displays the text content of these files in a readable format.

## 🛠️ Tech Stack

- **Build Tool**: Vite 6
- **Framework**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **File Processing**: JSZip

## 🔒 Privacy & Security

- All file processing occurs in your browser
- No files are uploaded to any server
- Content remains on your device at all times

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and deploy to GitHub Pages |
