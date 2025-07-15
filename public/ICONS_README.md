# PWA Icons Setup

## 🎯 Missing Icons for PWA Installation

Your PWA needs these PNG icon files to be installable on mobile devices:

### Required Files:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels) 
- `apple-touch-icon.png` (180x180 pixels)

### 🚀 Quick Setup (2 minutes):

1. **Go to**: https://convertio.co/svg-png/
2. **Upload**: `icon.svg` from this folder
3. **Convert** to PNG at these sizes:
   - 192x192 → save as `icon-192x192.png`
   - 512x512 → save as `icon-512x512.png`
   - 180x180 → save as `apple-touch-icon.png`
4. **Place** all PNG files in this `public/` folder
5. **Deploy** to Vercel
6. **Test** PWA installation on your phone!

### Alternative: Use PNG Icon Generator

Visit: https://realfavicongenerator.net/
- Upload your SVG
- Download the generated icons
- Place them in the public/ folder

### 🔧 Command Line Option:

```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Generate icons
sharp -i public/icon.svg -o public/icon-192x192.png --width 192 --height 192
sharp -i public/icon.svg -o public/icon-512x512.png --width 512 --height 512
sharp -i public/icon.svg -o public/apple-touch-icon.png --width 180 --height 180
```

### ✅ Verification:

Run this to check your setup:
```bash
npm run generate-icons
```

Once you have the PNG files, your PWA will show the install prompt on mobile devices! 🎉 