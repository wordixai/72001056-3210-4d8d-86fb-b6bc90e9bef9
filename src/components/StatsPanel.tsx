import { CompressionStats } from '../types/tinypng';
import { Card } from './ui/card';
import { formatFileSize, calculateSavings } from '../utils/tinypng';
import { FileImage, CheckCircle2, XCircle, TrendingDown } from 'lucide-react';

interface StatsPanelProps {
  stats: CompressionStats;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const savings = calculateSavings(stats.totalOriginalSize, stats.totalCompressedSize);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileImage className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">总文件数</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalFiles}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">压缩成功</p>
            <p className="text-2xl font-bold text-foreground">{stats.compressed}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">压缩失败</p>
            <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">节省空间</p>
            <p className="text-2xl font-bold text-success">
              {stats.totalCompressedSize > 0 ? `${savings}%` : '-'}
            </p>
            {stats.totalCompressedSize > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(stats.totalOriginalSize - stats.totalCompressedSize)}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsPanel;
