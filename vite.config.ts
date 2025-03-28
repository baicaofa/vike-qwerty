import react from "@vitejs/plugin-react";
import { promises as fs } from "fs";
import { getLastCommit } from "git-last-commit";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { dirname, resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import Icons from "unplugin-icons/vite";
import { fileURLToPath } from "url";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import type { PluginOption } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const latestCommitHash = await new Promise<string>((resolve) => {
    return getLastCommit((err, commit) =>
      err ? "unknown" : resolve(commit.shortHash)
    );
  });

  return {
    plugins: [
      react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
      vike(),
      visualizer() as PluginOption,
      Icons({
        compiler: "jsx",
        jsx: "react",
        customCollections: {
          "my-icons": {
            xiaohongshu: () =>
              fs.readFile("./src/assets/xiaohongshu.svg", "utf-8"),
          },
        },
      }),
    ],
    server: {
      proxy: {
        "/api/pronunciation": {
          target: "https://dict.youdao.com",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/pronunciation/, "/dictvoice"),
          configure: (proxy, options) => {
            proxy.on("error", (err, req, res) => {
              console.error("Proxy error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxying request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Received response:", proxyRes.statusCode);
            });
          },
        },
      },
    },
    build: {
      
      outDir: "build",
 
      sourcemap: true, // 启用 sourcemap
      minify: false,   // 禁用压缩
    },
    esbuild: {
      drop: mode === "development" ? [] : ["console", "debugger"],
    },
    define: {
      REACT_APP_DEPLOY_ENV: JSON.stringify(process.env.REACT_APP_DEPLOY_ENV),
      LATEST_COMMIT_HASH: JSON.stringify(
        latestCommitHash +
          (process.env.NODE_ENV === "production" ? "" : " (dev)")
      ),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    ssr: {
      noExternal: ["@/utils"], // 强制将 utils 作为内部模块
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
