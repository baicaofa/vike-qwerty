import { generateUUID } from "../uuid";
import { db } from "./index";
import type { CustomArticle } from "@/pages/CustomArticle/store/type";
import { useCallback } from "react";

// 保存文章记录
export function useSaveArticle() {
  return useCallback(async (article: Omit<CustomArticle, "id" | "uuid">) => {
    try {
      const uuid = generateUUID();
      const now = Date.now();

      const id = await db.articleRecords.add({
        ...article,
        uuid,
        createdAt: now,
        lastPracticedAt: now,
        isOfficial: article.isOfficial || false, // 确保设置isOfficial字段，默认为false
      });

      return { id, uuid };
    } catch (error) {
      console.error("保存文章失败:", error);
      throw error;
    }
  }, []);
}

// 更新文章记录
export function useUpdateArticle() {
  return useCallback(async (article: CustomArticle) => {
    try {
      const now = Date.now();

      await db.articleRecords.update(article.id!, {
        ...article,
        lastPracticedAt: now,
        isOfficial: article.isOfficial || false, // 确保设置isOfficial字段，默认为false
      });

      return true;
    } catch (error) {
      console.error("更新文章失败:", error);
      throw error;
    }
  }, []);
}

// 获取文章列表
export function useGetArticles() {
  return useCallback(async () => {
    try {
      // 按最后练习时间降序排列
      const articles = await db.articleRecords
        .orderBy("lastPracticedAt")
        .reverse()
        .toArray();

      return articles;
    } catch (error) {
      console.error("获取文章列表失败:", error);
      return [];
    }
  }, []);
}

// 获取单篇文章
export function useGetArticle() {
  return useCallback(async (id: number) => {
    try {
      const article = await db.articleRecords.get(id);
      return article || null;
    } catch (error) {
      console.error("获取文章失败:", error);
      return null;
    }
  }, []);
}

// 删除文章
export function useDeleteArticle() {
  return useCallback(async (id: number) => {
    try {
      await db.articleRecords.delete(id);
      return true;
    } catch (error) {
      console.error("删除文章失败:", error);
      return false;
    }
  }, []);
}
