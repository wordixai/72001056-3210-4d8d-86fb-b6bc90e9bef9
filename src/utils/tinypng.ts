import tinify from 'tinify';

const TINYPNG_API_KEY = 'tQzHVrC16K6Mr4kyyPsZzzy4Xk2BqrF4';

// Initialize tinify with API key
tinify.key = TINYPNG_API_KEY;

export async function compressImage(file: File): Promise<Blob> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress using tinify SDK
    const source = tinify.fromBuffer(buffer);
    const resultBuffer = await source.toBuffer();

    // Convert Buffer to Blob
    return new Blob([resultBuffer], { type: file.type });
  } catch (error) {
    console.error('TinyPNG compression error:', error);
    throw new Error(error instanceof Error ? error.message : 'Compression failed');
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function calculateSavings(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round((1 - compressed / original) * 100);
}

export function getRemainingCompressions(): number {
  return tinify.compressionCount || 0;
}
