import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * @fileOverview API route to dynamically discover and sort animation frames.
 */

export async function GET() {
  const framesDirectory = path.join(process.cwd(), 'public/images/frames');
  
  try {
    if (!fs.existsSync(framesDirectory)) {
      return NextResponse.json({ frames: [] });
    }

    const files = fs.readdirSync(framesDirectory);
    
    // Filter for valid image formats and ignore hidden files
    const imageFiles = files.filter(file => 
      !file.startsWith('.') && /\.(png|jpe?g|webp|avif|svg)$/i.test(file)
    );

    // Natural sort: Ensures "2.webp" comes before "10.webp"
    imageFiles.sort((a, b) => 
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );

    const framePaths = imageFiles.map(file => `/images/frames/${file}`);

    return NextResponse.json({ frames: framePaths });
  } catch (error) {
    return NextResponse.json({ frames: [] });
  }
}
