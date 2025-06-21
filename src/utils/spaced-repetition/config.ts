import { db } from "../db";
import type { IReviewConfig } from "../db/reviewConfig";
import { ReviewConfig } from "../db/reviewConfig";

/**
 * 默认复习配置（简化版）
 */
export const DEFAULT_REVIEW_CONFIG: Omit<
  IReviewConfig,
  "id" | "uuid" | "sync_status" | "last_modified"
> = {
  userId: "default",
  baseIntervals: [1, 3, 7, 15, 30, 60],
  dailyReviewTarget: 50,
  maxReviewsPerDay: 100,
  enableNotifications: true,
  notificationTime: "09:00",
};

/**
 * 预设配置（简化版）
 */
export const PRESET_CONFIGS = {
  // 初学者配置
  beginner: {
    ...DEFAULT_REVIEW_CONFIG,
    baseIntervals: [2, 4, 8, 16, 32, 64],
    dailyReviewTarget: 30,
    maxReviewsPerDay: 60,
  },

  // 标准配置
  standard: DEFAULT_REVIEW_CONFIG,

  // 高强度配置
  intensive: {
    ...DEFAULT_REVIEW_CONFIG,
    baseIntervals: [0.5, 2, 5, 12, 25, 50],
    dailyReviewTarget: 80,
    maxReviewsPerDay: 150,
  },

  // 轻松配置
  relaxed: {
    ...DEFAULT_REVIEW_CONFIG,
    baseIntervals: [2, 5, 10, 20, 40, 80],
    dailyReviewTarget: 25,
    maxReviewsPerDay: 50,
  },
};

/**
 * 配置缓存
 */
let configCache: IReviewConfig | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 获取复习配置
 *
 * @param userId 用户ID（可选）
 * @param forceRefresh 是否强制刷新缓存
 * @returns 复习配置
 */
export async function getReviewConfig(
  userId?: string,
  forceRefresh = false
): Promise<IReviewConfig> {
  const now = Date.now();

  // 检查缓存
  if (!forceRefresh && configCache && now - cacheTimestamp < CACHE_DURATION) {
    return configCache;
  }

  try {
    // 尝试从数据库获取用户特定配置
    let config: IReviewConfig | undefined;

    if (userId) {
      config = await db.reviewConfigs.where("userId").equals(userId).first();
    }

    // 如果没有用户特定配置，获取全局默认配置
    if (!config) {
      config = await db.reviewConfigs
        .where("userId")
        .equals("default") // 使用'default'字符串而不是null
        .first();
    }

    // 如果数据库中没有配置，创建默认配置
    if (!config) {
      config = new ReviewConfig(userId);
      await db.reviewConfigs.add(config);
    }

    // 更新缓存
    configCache = config;
    cacheTimestamp = now;

    return config;
  } catch (error) {
    console.error("Failed to get review config:", error);
    // 返回默认配置
    return new ReviewConfig(userId);
  }
}

/**
 * 更新复习配置
 *
 * @param updates 配置更新
 * @param userId 用户ID（可选）
 * @returns 更新后的配置
 */
export async function updateReviewConfig(
  updates: Partial<IReviewConfig>,
  userId?: string
): Promise<IReviewConfig> {
  try {
    // 获取当前配置
    const currentConfig = await getReviewConfig(userId);

    // 合并更新
    const updatedConfig = {
      ...currentConfig,
      ...updates,
      last_modified: Date.now(),
    };

    // 验证配置
    const validation = new ReviewConfig().validate.call(updatedConfig);
    if (!validation.isValid) {
      throw new Error(`Invalid config: ${validation.errors.join(", ")}`);
    }

    // 更新同步状态
    if (updatedConfig.sync_status === "synced") {
      updatedConfig.sync_status = "local_modified";
    }

    // 保存到数据库
    if (updatedConfig.id) {
      await db.reviewConfigs.update(updatedConfig.id, updatedConfig);
    } else {
      await db.reviewConfigs.add(updatedConfig);
    }

    // 清除缓存
    configCache = null;

    return updatedConfig;
  } catch (error) {
    console.error("Failed to update review config:", error);
    throw error;
  }
}

/**
 * 应用预设配置
 *
 * @param presetName 预设配置名称
 * @param userId 用户ID（可选）
 * @returns 应用后的配置
 */
export async function applyPresetConfig(
  presetName: keyof typeof PRESET_CONFIGS,
  userId?: string
): Promise<IReviewConfig> {
  const presetConfig = PRESET_CONFIGS[presetName];
  if (!presetConfig) {
    throw new Error(`Unknown preset config: ${presetName}`);
  }

  return updateReviewConfig(presetConfig, userId);
}

/**
 * 重置为默认配置
 *
 * @param userId 用户ID（可选）
 * @returns 重置后的配置
 */
export async function resetToDefaultConfig(
  userId?: string
): Promise<IReviewConfig> {
  return updateReviewConfig(DEFAULT_REVIEW_CONFIG, userId);
}

/**
 * 获取简化的配置建议
 * 基于用户的学习表现提供简单的配置建议
 *
 * @param userStats 用户统计数据
 * @returns 配置建议
 */
export function getConfigRecommendations(userStats: {
  totalReviews: number;
  averageAccuracy: number;
  dailyReviewCount: number;
}): {
  recommendedPreset: keyof typeof PRESET_CONFIGS;
  suggestions: string[];
  adjustments: Partial<IReviewConfig>;
} {
  const suggestions: string[] = [];
  let recommendedPreset: keyof typeof PRESET_CONFIGS = "standard";
  const adjustments: Partial<IReviewConfig> = {};

  // 基于准确率推荐
  if (userStats.averageAccuracy < 0.6) {
    recommendedPreset = "beginner";
    suggestions.push("建议使用初学者配置，降低复习强度");
  } else if (userStats.averageAccuracy > 0.9) {
    recommendedPreset = "intensive";
    suggestions.push("您的表现很好，可以尝试高强度配置");
  }

  // 基于复习量推荐
  if (userStats.dailyReviewCount < 20) {
    recommendedPreset = "relaxed";
    suggestions.push("当前复习量较少，建议使用轻松配置");
  } else if (userStats.dailyReviewCount > 80) {
    recommendedPreset = "intensive";
    suggestions.push("复习量较大，可以尝试高强度配置");
  }

  return {
    recommendedPreset,
    suggestions,
    adjustments,
  };
}

/**
 * 导出配置
 *
 * @param userId 用户ID（可选）
 * @returns 配置的JSON字符串
 */
export async function exportConfig(userId?: string): Promise<string> {
  const config = await getReviewConfig(userId);

  // 移除不需要导出的字段
  const exportData = {
    ...config,
    id: undefined,
    uuid: undefined,
    sync_status: undefined,
    last_modified: undefined,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * 导入配置
 *
 * @param configJson 配置的JSON字符串
 * @param userId 用户ID（可选）
 * @returns 导入后的配置
 */
export async function importConfig(
  configJson: string,
  userId?: string
): Promise<IReviewConfig> {
  try {
    const importedConfig = JSON.parse(configJson);

    // 验证导入的配置
    const tempConfig = new ReviewConfig(userId);
    Object.assign(tempConfig, importedConfig);

    const validation = tempConfig.validate();
    if (!validation.isValid) {
      throw new Error(
        `Invalid imported config: ${validation.errors.join(", ")}`
      );
    }

    return updateReviewConfig(importedConfig, userId);
  } catch (error) {
    console.error("Failed to import config:", error);
    throw new Error("Invalid configuration format");
  }
}

/**
 * 清除配置缓存
 */
export function clearConfigCache(): void {
  configCache = null;
  cacheTimestamp = 0;
}
