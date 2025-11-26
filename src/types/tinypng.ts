export interface ImageFile {
  id: string;
  file: File;
  status: 'pending' | 'compressing' | 'success' | 'error';
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  error?: string;
  progress?: number;
}

export interface CompressionStats {
  totalFiles: number;
  compressed: number;
  failed: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
}
