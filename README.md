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

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

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
