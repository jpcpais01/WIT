#!/usr/bin/env node

// PWA Icon Generator Script
// This script converts the SVG icon to PNG files for PWA installation

const fs = require('fs');
const path = require('path');

console.log('🎨 PWA Icon Generator');
console.log('====================');

// Check if SVG file exists
const svgPath = path.join(__dirname, '../public/icon.svg');
if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG icon not found at:', svgPath);
  process.exit(1);
}

console.log('📁 SVG icon found at:', svgPath);

// Required icon sizes for PWA
const iconSizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }
];

console.log('\n🔧 To generate PWA icons, you have several options:');
console.log('\n1. Online SVG to PNG converter:');
console.log('   - Go to https://convertio.co/svg-png/');
console.log('   - Upload your icon.svg file');
console.log('   - Convert to PNG at these sizes:');
iconSizes.forEach(icon => {
  console.log(`     • ${icon.size}x${icon.size} → save as ${icon.name}`);
});

console.log('\n2. Using command line (requires ImageMagick):');
console.log('   npm install -g sharp-cli');
iconSizes.forEach(icon => {
  console.log(`   sharp -i public/icon.svg -o public/${icon.name} --width ${icon.size} --height ${icon.size}`);
});

console.log('\n3. Using online tools:');
console.log('   - https://realfavicongenerator.net/');
console.log('   - https://www.favicon-generator.org/');

console.log('\n📋 Required files for PWA:');
iconSizes.forEach(icon => {
  const filePath = path.join(__dirname, '../public', icon.name);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} public/${icon.name}`);
});

console.log('\n💡 After generating icons:');
console.log('   1. Place all PNG files in the public/ directory');
console.log('   2. Run: npm run build');
console.log('   3. Deploy to Vercel');
console.log('   4. Test PWA installation on mobile!');

console.log('\n🚀 Your PWA will be installable once icons are generated!'); 