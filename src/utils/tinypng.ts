const TINYPNG_API_KEY = 'tQzHVrC16K6Mr4kyyPsZzzy4Xk2BqrF4';
const TINYPNG_API_URL = 'https://api.tinify.com/shrink';

export async function compressImage(file: File): Promise<Blob> {
  try {
    // Upload image to TinyPNG
    const uploadResponse = await fetch(TINYPNG_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('api:' + TINYPNG_API_KEY),
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || 'Compression failed');
    }

    const result = await uploadResponse.json();

    // Download compressed image
    const downloadResponse = await fetch(result.output.url);

    if (!downloadResponse.ok) {
      throw new Error('Failed to download compressed image');
    }

    return await downloadResponse.blob();
  } catch (error) {
    console.error('TinyPNG compression error:', error);
    throw error;
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
