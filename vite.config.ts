import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { statSync, createReadStream, existsSync, rmSync, cpSync } from 'fs'
import { join, extname } from 'path'

// Simple MIME type mapping
const getMimeType = (filePath: string): string => {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-artifacts',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) {
            next();
            return;
          }

          // Decode URL to handle spaces and special characters
          let decodedUrl = decodeURIComponent(req.url);
          let filePath: string;

          // Serve Artefacts folder (not in public, needs custom middleware)
          if (decodedUrl.startsWith('/Artefacts/')) {
            filePath = join(process.cwd(), decodedUrl);
            try {
              const stats = statSync(filePath);
              if (stats.isFile()) {
                res.setHeader('Content-Type', getMimeType(filePath));
                createReadStream(filePath).pipe(res);
                return;
              }
            } catch {
              // File doesn't exist, continue
            }
          }
          
          next();
        });
      }
    },
    {
      name: 'copy-artifacts-to-dist',
      apply: 'build',
      closeBundle() {
        const srcDir = join(process.cwd(), 'Artefacts');
        const outDir = join(process.cwd(), 'dist', 'Artefacts');

        if (!existsSync(srcDir)) return;

        rmSync(outDir, { recursive: true, force: true });
        cpSync(srcDir, outDir, { recursive: true });
      },
    }
  ],
})
