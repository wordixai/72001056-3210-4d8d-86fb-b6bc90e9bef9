import { useState, useCallback } from 'react';
import { ImageFile, CompressionStats } from '../types/tinypng';
import { compressImage } from '../utils/tinypng';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Download, Trash2, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import ImageList from './ImageList';
import StatsPanel from './StatsPanel';

const ImageCompressor = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const imageFiles: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        imageFiles.push({
          id: uuidv4(),
          file,
          status: 'pending',
          originalSize: file.size,
        });
      }
    }

    if (imageFiles.length === 0) {
      toast.error('请选择有效的图片文件');
      return;
    }

    setImages((prev) => [...prev, ...imageFiles]);
    toast.success(`已添加 ${imageFiles.length} 个图片`);
  }, []);

  const handleFolderSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const compressImages = async () => {
    const pendingImages = images.filter((img) => img.status === 'pending');
    if (pendingImages.length === 0) {
      toast.error('没有待压缩的图片');
      return;
    }

    setIsCompressing(true);

    for (const image of pendingImages) {
      try {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: 'compressing', progress: 0 } : img
          )
        );

        const compressedBlob = await compressImage(image.file);

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'success',
                  compressedSize: compressedBlob.size,
                  compressedBlob,
                  progress: 100,
                }
              : img
          )
        );
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'error',
                  error: error instanceof Error ? error.message : '压缩失败',
                }
              : img
          )
        );
      }
    }

    setIsCompressing(false);
    toast.success('压缩完成！');
  };

  const downloadAll = () => {
    const successImages = images.filter((img) => img.status === 'success' && img.compressedBlob);

    if (successImages.length === 0) {
      toast.error('没有可下载的图片');
      return;
    }

    successImages.forEach((image) => {
      if (!image.compressedBlob) return;

      const url = URL.createObjectURL(image.compressedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${image.file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success(`已下载 ${successImages.length} 个文件`);
  };

  const clearAll = () => {
    setImages([]);
    toast.success('已清空列表');
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const stats: CompressionStats = {
    totalFiles: images.length,
    compressed: images.filter((img) => img.status === 'success').length,
    failed: images.filter((img) => img.status === 'error').length,
    totalOriginalSize: images.reduce((sum, img) => sum + img.originalSize, 0),
    totalCompressedSize: images.reduce(
      (sum, img) => sum + (img.compressedSize || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">图片压缩工具</h1>
          <p className="text-muted-foreground">使用 TinyPNG API 进行高质量图片压缩</p>
        </div>

        <Card className="p-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground mb-2">
              拖拽图片到此处，或点击选择文件
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              支持 PNG、JPG、JPEG、WebP 格式
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <label className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  选择文件
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </Button>
              <Button asChild variant="outline">
                <label className="cursor-pointer">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  选择文件夹
                  <input
                    type="file"
                    {...({ webkitdirectory: '', directory: '' } as any)}
                    multiple
                    onChange={handleFolderSelect}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        </Card>

        {images.length > 0 && (
          <>
            <StatsPanel stats={stats} />

            <div className="flex gap-4 justify-end">
              <Button
                onClick={compressImages}
                disabled={isCompressing || images.every((img) => img.status !== 'pending')}
                size="lg"
              >
                {isCompressing ? '压缩中...' : '开始压缩'}
              </Button>
              <Button
                onClick={downloadAll}
                disabled={stats.compressed === 0}
                variant="outline"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                下载全部
              </Button>
              <Button onClick={clearAll} variant="destructive" size="lg">
                <Trash2 className="w-4 h-4 mr-2" />
                清空列表
              </Button>
            </div>

            <ImageList images={images} onRemove={removeImage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor;
