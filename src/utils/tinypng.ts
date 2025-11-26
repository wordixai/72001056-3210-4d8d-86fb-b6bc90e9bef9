const TINYPNG_API_KEY = 'tQzHVrC16K6Mr4kyyPsZzzy4Xk2BqrF4';
const TINYPNG_API_URL = 'https://api.tinify.com/shrink';

let compressionCount = 0;

export async function compressImage(file: File): Promise<Blob> {
  try {
    // Create Basic Auth header
    const auth = btoa(`api:${TINYPNG_API_KEY}`);

    // Upload image to TinyPNG
    const uploadResponse = await fetch(TINYPNG_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      let errorMessage = 'Compression failed';
      try {
        const error = await uploadResponse.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Get compression count from response header
    const compCount = uploadResponse.headers.get('Compression-Count');
    if (compCount) {
      compressionCount = parseInt(compCount, 10);
    }

    const result = await uploadResponse.json();

    // Download compressed image
    const downloadResponse = await fetch(result.output.url);

    if (!downloadResponse.ok) {
      throw new Error('Failed to download compressed image');
    }

    const blob = await downloadResponse.blob();
    return blob;
  } catch (error) {
    console.error('TinyPNG compression error:', error);
    throw error instanceof Error ? error : new Error('Compression failed');
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
  return compressionCount;
}
