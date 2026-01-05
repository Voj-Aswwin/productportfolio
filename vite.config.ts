import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { statSync, createReadStream } from 'fs'
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
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'vite.config.ts:27',message:'Middleware request received',data:{url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
          // #endregion
          
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
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'vite.config.ts:40',message:'Attempting to serve Artefacts file',data:{filePath,decodedUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
            // #endregion
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
          
          // Note: Vibe Coded Images are in public/ folder, so Vite serves them automatically
          // No custom middleware needed for files in public/
          
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'vite.config.ts:62',message:'Calling next() - passing to next middleware',data:{url:req.url,decodedUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H2'})}).catch(()=>{});
          // #endregion
          next();
        });
      }
    }
  ],
})
