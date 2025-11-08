import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

// Watermark endpoint
app.post('/api/watermark', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf[0];
    const logoFile = req.files.logo ? req.files.logo[0] : null;

    const { watermarkText, opacity, fontSize, rotation, color, position, logoOpacity } = req.body;

    // Read the uploaded PDF
    const pdfBytes = await fs.readFile(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Embed logo if provided
    let logoImage = null;
    let logoDims = null;
    let logoOpacityValue = 1.0;
    if (logoFile) {
      const logoBytes = await fs.readFile(logoFile.path);
      // PNG preserves transparency automatically
      if (logoFile.mimetype === 'image/png') {
        logoImage = await pdfDoc.embedPng(logoBytes);
      } else if (logoFile.mimetype === 'image/jpeg' || logoFile.mimetype === 'image/jpg') {
        logoImage = await pdfDoc.embedJpg(logoBytes);
      }
      if (logoImage) {
        logoDims = logoImage.scale(0.15); // Scale logo to 15% of original size
        logoOpacityValue = parseFloat(logoOpacity) || 1.0;
      }
    }
    
    // Parse parameters
    const opacityValue = parseFloat(opacity) || 0.3;
    const fontSizeValue = parseInt(fontSize) || 50;
    const rotationValue = parseInt(rotation) || -45;
    const positionValue = position || 'center';
    
    // Parse color (hex to RGB)
    const colorValue = color || '#808080';
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 0.5, g: 0.5, b: 0.5 };
    };
    
    const rgbColor = hexToRgb(colorValue);
    
    // Get pages and add watermark to each
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Add logo to footer if provided
      if (logoImage && logoDims) {
        const logoX = 20; // 20 points from left edge
        const logoY = 20; // 20 points from bottom edge
        page.drawImage(logoImage, {
          x: logoX,
          y: logoY,
          width: logoDims.width,
          height: logoDims.height,
          opacity: logoOpacityValue, // Apply logo opacity
        });
      }
      
      // Define margins (in points) - 15% of page dimensions for safety
      const marginX = width * 0.15;
      const marginY = height * 0.15;
      
      // Calculate usable area (page minus margins)
      const usableWidth = width - (2 * marginX);
      const usableHeight = height - (2 * marginY);
      
      // Calculate diagonal of the usable area
      const usableDiagonal = Math.sqrt(usableWidth * usableWidth + usableHeight * usableHeight);
      
      // Get the font first
      const font = await pdfDoc.embedFont('Helvetica');
      const text = watermarkText || 'WATERMARK';
      
      // Calculate font size iteratively to fit 70% of usable diagonal
      let fontSize = 10;
      let textWidth = 0;
      const targetWidth = usableDiagonal * 0.7;
      
      // Increase font size until we reach target width
      while (textWidth < targetWidth && fontSize < 500) {
        fontSize += 1;
        textWidth = font.widthOfTextAtSize(text, fontSize);
      }
      
      // Reduce by 10% for safety margin
      fontSize = fontSize * 0.9;
      
      // Get final text dimensions
      const finalTextWidth = font.widthOfTextAtSize(text, fontSize);
      const finalTextHeight = font.heightAtSize(fontSize);
      
      const rotation = 45; // Diagonal from bottom-right to top-left
      const rotationRad = (rotation * Math.PI) / 180;
      
      // For rotated text, calculate the center point
      // The text anchor point is at bottom-left, so we need to adjust for rotation
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Calculate offset to center the rotated text
      // When rotated, we need to account for both width and height in the offset
      const offsetX = (finalTextWidth / 2) * Math.cos(rotationRad) + (finalTextHeight / 2) * Math.sin(rotationRad);
      const offsetY = (finalTextWidth / 2) * Math.sin(rotationRad) - (finalTextHeight / 2) * Math.cos(rotationRad);
      
      const x = centerX - offsetX;
      const y = centerY - offsetY;
      
      // Draw watermark text multiple times for persistence
      // Layer 1: Behind content (harder to remove)
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: opacityValue,
        rotate: degrees(rotation),
      });
      
      // Layer 2: Slightly offset for extra persistence
      page.drawText(text, {
        x: x + 0.5,
        y: y + 0.5,
        size: fontSize,
        font: font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: opacityValue * 0.8,
        rotate: degrees(rotation),
      });
      
      // Layer 3: Another slight offset
      page.drawText(text, {
        x: x - 0.5,
        y: y - 0.5,
        size: fontSize,
        font: font,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: opacityValue * 0.8,
        rotate: degrees(rotation),
      });
    }
    
    // Save the watermarked PDF with flattening options
    const watermarkedPdfBytes = await pdfDoc.save({
      useObjectStreams: false,  // Disable object streams for better compatibility
      addDefaultPage: false,     // Don't add extra pages
    });
    const outputPath = path.join(__dirname, 'uploads', 'watermarked-' + pdfFile.filename);
    await fs.writeFile(outputPath, watermarkedPdfBytes);
    
    // Send the file with 'w' appended to filename
    const originalName = pdfFile.originalname;
    const nameParts = originalName.split('.');
    const extension = nameParts.pop();
    const baseName = nameParts.join('.');
    const newFileName = `${baseName}w.${extension}`;
    
    res.download(outputPath, newFileName, async (err) => {
      // Clean up files after download
      try {
        await fs.unlink(pdfFile.path);
        if (logoFile) {
          await fs.unlink(logoFile.path);
        }
        await fs.unlink(outputPath);
      } catch (cleanupErr) {
        console.error('Error cleaning up files:', cleanupErr);
      }
    });
    
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
