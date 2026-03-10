# .util File Viewer

A lightweight web application for viewing .util files (ZIP archives containing text content) directly in your browser. All processing happens client-side for privacy and security.

## ✨ Features

- **Client-Side Processing**: Files are processed entirely in your browser - nothing is uploaded to servers
- **Drag & Drop Support**: Easily upload .util files by dragging them onto the interface
- **Archive Content Navigation**: Browse and view individual files within .util archives
- **Copy Functionality**: Copy file contents to clipboard with a single click
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with Next.js and Tailwind CSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build static version for GitHub Pages
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see your application running during development.

## 🚀 Deploy to GitHub Pages

This application is configured to be deployed to GitHub Pages:

1. Run `npm run build` to create a static build in the `out/` folder
2. Push the `out/` folder contents to the `gh-pages` branch, or enable GitHub Pages in your repo settings to serve from the `docs/` folder or root
3. Your app will be available at `https://yourusername.github.io/repository-name`

Alternatively, you can:
1. Rename the `out/` folder to `docs/` and serve from the `docs/` folder in GitHub settings
2. Or use GitHub Actions to automate the deployment process

## 📁 Supported File Types

This application supports `.util` files which are typically ZIP archives containing text-based content. The viewer extracts and displays the text content of these files in a readable format.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **File Processing**: JSZip

## 🔒 Privacy & Security

- All file processing occurs in your browser
- No files are uploaded to any server
- Content remains on your device at all times
