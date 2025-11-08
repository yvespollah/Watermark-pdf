# PDF Watermark Pro

A modern web application for adding persistent watermarks to PDF documents with full customization options.

## Features

- 📄 Upload PDF files via drag & drop or file browser
- 🎨 Customize watermark text, color, size, opacity, and rotation
- 📍 Position watermarks anywhere on the page
- ⚡ Instant processing and download
- 🎯 Professional, modern UI built with React and TailwindCSS
- 🔒 Persistent watermarks that cannot be easily removed

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

2. Open your browser and navigate to `http://localhost:3000`

3. Upload a PDF file and customize your watermark settings

4. Click "Add Watermark & Download" to process and download your watermarked PDF

## Watermark Options

- **Text**: Custom watermark text
- **Position**: Center, Top Left, Top Right, Bottom Left, Bottom Right
- **Opacity**: 0.1 to 1.0
- **Font Size**: 20px to 100px
- **Rotation**: -90° to 90°
- **Color**: Any hex color value

## Technology Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express
- **PDF Processing**: pdf-lib
- **File Upload**: Multer

## API Endpoint

### POST /api/watermark

Upload a PDF and add a watermark.

**Request:**
- `pdf`: PDF file (multipart/form-data)
- `watermarkText`: Text to use as watermark
- `opacity`: Opacity value (0.1-1.0)
- `fontSize`: Font size in pixels
- `rotation`: Rotation angle in degrees
- `color`: Hex color value
- `position`: Position on page (center, top-left, etc.)

**Response:**
- Watermarked PDF file download

## License

MIT
