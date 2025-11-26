# 图片压缩工具

使用 TinyPNG API 进行高质量图片压缩的 Web 应用。

## 功能特点

- 🖼️ 支持拖拽上传图片
- 📁 支持选择文件夹批量上传
- 🔄 实时显示压缩进度
- 📊 详细的统计数据展示
- 💾 单个或批量下载压缩后的图片
- ✨ 支持 PNG、JPG、JPEG、WebP 格式

## 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Express.js
- **压缩**: TinyPNG API (tinify SDK)

## 安装

```bash
pnpm install
```

## 运行

### 同时启动前端和后端

```bash
pnpm run dev:all
```

### 分别启动

```bash
# 终端 1 - 前端 (端口 5173)
pnpm run dev

# 终端 2 - 后端 (端口 3001)
pnpm run server
```

## 环境变量

创建 `.env` 文件（可参考 `.env.example`）：

```
VITE_API_URL=http://localhost:3001
```

## 使用说明

1. 打开浏览器访问 http://localhost:5173
2. 拖拽图片到上传区域，或点击按钮选择文件/文件夹
3. 点击"开始压缩"按钮批量压缩
4. 压缩完成后可单独下载或批量下载所有图片

## API 配额

TinyPNG 免费账户每月提供 500 次压缩额度。应用会显示当前已使用的压缩次数。

## License

MIT
