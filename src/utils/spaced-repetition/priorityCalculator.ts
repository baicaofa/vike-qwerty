import type { IReviewConfig } from "../db/reviewConfig";
import type { IWordReviewRecord } from "../db/wordReviewRecord";

// 移除复杂的优先级算法，只保留简化的筛选功能

/**
 * 筛选到期需要复习的单词
 * 简化逻辑：只基于时间判断
 *
 * @param wordRecords 单词复习记录列表
 * @param currentTime 当前时间戳
 * @param config 复习配置
 * @returns 需要复习的单词列表
 */
export function filterDueWords(
  wordRecords: IWordReviewRecord[],
  currentTime: number = Date.now(),
  config?: IReviewConfig
): IWordReviewRecord[] {
  return wordRecords.filter((record) => {
    // 如果已经毕业，不需要复习
    if (record.isGraduated) {
      return false;
    }

    // 只检查是否到了预定复习时间
    return currentTime >= record.nextReviewAt;
  });
}

/**
 * 筛选紧急需要复习的单词
 * 简化逻辑：基于逾期时间判断
 *
 * @param wordRecords 单词复习记录列表
 * @param currentTime 当前时间戳
 * @param config 复习配置
 * @returns 紧急需要复习的单词列表
 */
export function filterUrgentWords(
  wordRecords: IWordReviewRecord[],
  currentTime: number = Date.now(),
  config?: IReviewConfig
): IWordReviewRecord[] {
  return wordRecords.filter((record) => {
    // 如果已经毕业，不紧急
    if (record.isGraduated) {
      return false;
    }

    // 逾期超过1天算紧急
    const daysOverdue =
      (currentTime - record.nextReviewAt) / (24 * 60 * 60 * 1000);
    return daysOverdue > 1;
  });
}

// 移除了复杂的推荐算法和负载计算，简化系统只保留基础的筛选功能
