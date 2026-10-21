import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";
import { handler as apiProxyHandler } from './netlify/functions/api-proxy'

// Serves the Netlify api-proxy function under plain `vite`, so TBA loading works without `netlify dev`.
function netlifyApiProxyDev(): Plugin {
  return {
    name: 'netlify-api-proxy-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const [key, value] of Object.entries(env)) {
        process.env[key] ??= value;
      }

      server.middlewares.use('/.netlify/functions/api-proxy', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost');
        const result = await apiProxyHandler(
          {
            httpMethod: req.method ?? 'GET',
            headers: req.headers as Record<string, string>,
            queryStringParameters: Object.fromEntries(url.searchParams),
          } as never,
          {} as never,
        );
        const response = result ?? { statusCode: 500, headers: {}, body: '{}' };
        res.statusCode = response.statusCode;
        for (const [name, value] of Object.entries(response.headers ?? {})) {
          res.setHeader(name, String(value));
        }
        res.end(response.body ?? '');
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    netlifyApiProxyDev(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      devOptions: {
        enabled: false, // Disabled in dev to prevent false update prompts - only active in production
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB (increase from default 2 MB)
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "script",
            handler: "NetworkFirst",
            options: {
              cacheName: "js-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "style",
            handler: "NetworkFirst",
            options: {
              cacheName: "css-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "NetworkFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
              },
            },
          },
        ],
      },
      injectRegister: 'auto',
    }),
  ],
  server: {
    host: true, // same as "--host" flag
    allowedHosts: [
      '.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.io',
    ],
  },
  resolve: {
    alias: {
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/game": path.resolve(__dirname, "./src/game-template"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
