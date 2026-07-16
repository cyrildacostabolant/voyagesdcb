import sharp from 'sharp';
import fs from 'fs';

const svgBuffer = fs.readFileSync('./public/icon.svg');

async function generate() {
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/maskable-icon-512x512.png');
    
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon-180x180.png');
    
  console.log('Icons generated successfully');
}

generate().catch(console.error);
