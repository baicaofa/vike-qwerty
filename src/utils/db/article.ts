import { generateUUID } from "../uuid";
import { RecordDB } from "./index";
import type { CustomArticle } from "@/pages/CustomArticle/store/type";
import type Dexie from "dexie";
import { useCallback } from "react";

// 为RecordDB添加自定义文章表的类型声明
declare module "./index" {
  interface RecordDB {
    articleRecords: Dexie.Table<CustomArticle, number>;
  }
}

// 初始化数据库表
export function initArticleTable(db: RecordDB): void {
  db.version(7).stores({
    // 保持其他表不变
    wordRecords:
      "++id, &uuid, &[dict+word], dict, word, lastPracticedAt, sync_status, last_modified",
    chapterRecords:
      "++id, &uuid, dict, chapter, timeStamp, sync_status, last_modified",
    reviewRecords: "++id, &uuid, dict, timeStamp, sync_status, last_modified",
    familiarWords:
      "++id, &uuid, dict, word, sync_status, last_modified,[dict+word]",
    // 添加文章记录表
    articleRecords: "++id, &uuid, title, createdAt, lastPracticedAt",
  });
}

// 保存文章记录
export function useSaveArticle() {
  return useCallback(async (article: Omit<CustomArticle, "id" | "uuid">) => {
    try {
      const db = new RecordDB();

      // 确保表已创建
      if (!db.articleRecords) {
        initArticleTable(db);
      }

      const uuid = generateUUID();
      const now = Date.now();

      const id = await db.articleRecords.add({
        ...article,
        uuid,
        createdAt: now,
        lastPracticedAt: now,
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
      const db = new RecordDB();

      // 确保表已创建
      if (!db.articleRecords) {
        initArticleTable(db);
      }

      const now = Date.now();

      await db.articleRecords.update(article.id!, {
        ...article,
        lastPracticedAt: now,
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
      const db = new RecordDB();

      // 确保表已创建
      if (!db.articleRecords) {
        initArticleTable(db);
        return [];
      }

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
      const db = new RecordDB();

      // 确保表已创建
      if (!db.articleRecords) {
        initArticleTable(db);
        return null;
      }

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
      const db = new RecordDB();

      // 确保表已创建
      if (!db.articleRecords) {
        initArticleTable(db);
        return false;
      }

      await db.articleRecords.delete(id);
      return true;
    } catch (error) {
      console.error("删除文章失败:", error);
      return false;
    }
  }, []);
}
