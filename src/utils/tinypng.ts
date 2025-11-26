const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let compressionCount = 0;

export async function compressImage(file: File): Promise<Blob> {
  try {
    // Send image to backend API
    const response = await fetch(`${API_BASE_URL}/api/compress`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      let errorMessage = 'Compression failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Get compression count from response header
    const compCount = response.headers.get('Compression-Count');
    if (compCount) {
      compressionCount = parseInt(compCount, 10);
    }

    const blob = await response.blob();
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
