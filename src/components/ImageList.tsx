import { ImageFile } from '../types/tinypng';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { X, Download, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { formatFileSize, calculateSavings } from '../utils/tinypng';

interface ImageListProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
}

const ImageList = ({ images, onRemove }: ImageListProps) => {
  const downloadImage = (image: ImageFile) => {
    if (!image.compressedBlob) return;

    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">图片列表</h2>
      <div className="grid gap-4">
        {images.map((image) => {
          const savings = image.compressedSize
            ? calculateSavings(image.originalSize, image.compressedSize)
            : 0;

          return (
            <Card key={image.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(image.file)}
                    alt={image.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {image.file.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{formatFileSize(image.originalSize)}</span>
                    {image.compressedSize && (
                      <>
                        <span>→</span>
                        <span className="text-success">
                          {formatFileSize(image.compressedSize)}
                        </span>
                        <span className="text-success font-medium">
                          节省 {savings}%
                        </span>
                      </>
                    )}
                  </div>

                  {image.status === 'compressing' && (
                    <div className="mt-2">
                      <Progress value={image.progress || 0} className="h-2" />
                    </div>
                  )}

                  {image.error && (
                    <p className="mt-2 text-sm text-destructive">{image.error}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {image.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    </div>
                  )}
                  {image.status === 'compressing' && (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  )}
                  {image.status === 'success' && (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-success" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {image.status === 'error' && (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ImageList;
