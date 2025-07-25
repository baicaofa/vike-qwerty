import { writeFileSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";
import type { Plugin } from "vite";

interface RouteConfig {
  path: string;
  priority?: number;
  changefreq?: string;
  lastmod?: string;
}

interface SitemapOptions {
  baseUrl: string;
  routes?: (string | RouteConfig)[];
  changefreq?: string;
  priority?: number;
  autoDetect?: boolean;
  excludePatterns?: string[];
  addLastmod?: boolean;
}

export default function sitemapPlugin(options: SitemapOptions): Plugin {
  const {
    baseUrl = "https://www.keybr.com.cn",
    routes = [],
    changefreq = "daily",
    priority = 0.8,
    autoDetect = true,
    excludePatterns = [
      "/api/",
      "/_",
      "/assets/",
      "/favicon",
      "/manifest",
      "/Admin/",
      "/login",
      "/register",
      "/profile",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ],
    addLastmod = true,
  } = options;

  // 将日期格式化为W3C格式 (YYYY-MM-DD)
  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // 自动检测build目录中的HTML文件
  function detectRoutesFromBuild(buildDir: string): RouteConfig[] {
    const detectedRoutes: RouteConfig[] = [];

    try {
      function scanDirectory(dir: string, basePath = ""): void {
        const items = readdirSync(dir);

        for (const item of items) {
          const fullPath = join(dir, item);
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            // 递归扫描子目录
            scanDirectory(fullPath, join(basePath, item));
          } else if (item === "index.html") {
            // 找到index.html文件，生成对应的路由
            const route =
              basePath === "" ? "/" : `/${basePath.replace(/\\/g, "/")}/`;

            // 检查是否应该排除这个路由
            const shouldExclude = excludePatterns.some((pattern) =>
              route.includes(pattern)
            );

            if (!shouldExclude) {
              // 添加路由，包括文件的最后修改时间
              detectedRoutes.push({
                path: route,
                lastmod: addLastmod ? formatDate(stat.mtime) : undefined,
              });
            }
          }
        }
      }

      if (readdirSync(buildDir).length > 0) {
        scanDirectory(buildDir);
      }
    } catch (error) {
      console.warn("Failed to auto-detect routes from build directory:", error);
    }

    return detectedRoutes;
  }

  // 规范化路由配置
  function normalizeRoute(route: string | RouteConfig): RouteConfig {
    if (typeof route === "string") {
      return {
        path: route,
        priority,
        changefreq,
      };
    }
    return {
      priority,
      changefreq,
      ...route,
    };
  }

  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    closeBundle: () => {
      // 使用 build/client 目录来扫描生成的静态文件
      const buildClientDir = resolve(process.cwd(), "build/client");

      // 收集所有路由
      let allRoutes: RouteConfig[] = [];

      // 添加手动配置的路由
      allRoutes = routes.map(normalizeRoute);

      // 如果启用自动检测，添加检测到的路由
      if (autoDetect) {
        const detectedRoutes = detectRoutesFromBuild(buildClientDir);

        // 过滤掉已经手动配置的路由
        const manualPaths = allRoutes.map((r) => r.path);
        const newRoutes = detectedRoutes
          .filter((route) => !manualPaths.includes(route.path))
          .map((route) => ({
            ...normalizeRoute(route.path),
            lastmod: route.lastmod,
          }));

        allRoutes = [...allRoutes, ...newRoutes];
      }

      // 去重并排序
      const uniqueRoutes = allRoutes
        .filter(
          (route, index, self) =>
            index === self.findIndex((r) => r.path === route.path)
        )
        .sort((a, b) => {
          // 首页排在最前面
          if (a.path === "/") return -1;
          if (b.path === "/") return 1;
          // 按优先级排序
          return (b.priority || 0.8) - (a.priority || 0.8);
        });

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
       xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
       http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${uniqueRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>${
      route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ""
    }
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      // 将sitemap文件写入到 build/client 目录
      const sitemapPath = resolve(buildClientDir, "sitemap.xml");
      writeFileSync(sitemapPath, sitemap);

      console.log(
        `✅ Sitemap generated at ${sitemapPath} with ${uniqueRoutes.length} routes:`
      );
      uniqueRoutes.forEach((route) => {
        console.log(
          `   ${route.path} (priority: ${route.priority}${
            route.lastmod ? `, lastmod: ${route.lastmod}` : ""
          })`
        );
      });
    },
  };
}
