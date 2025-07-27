import CustomDictionary from "../models/CustomDictionary";
import CustomWord from "../models/CustomWord";
import { dictionaryUploadService } from "../services/DictionaryUploadService";
import { wordEnrichmentService } from "../services/WordEnrichmentService";
import { wordQueryService } from "../services/WordQueryService";
import { generateUUID } from "../utils/uuid";
import type { Request, Response } from "express";

/**
 * 获取词库中的单词列表
 * GET /api/custom-dictionaries/:dictId/words
 * 支持分页，自动合并官方数据
 */
export const getWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dictId } = req.params;
    const { page = 1, pageSize = 20 } = req.query;

    // 验证词库是否存在且属于当前用户
    const dictionary = await CustomDictionary.findOne({
      id: dictId,
      userId: req.user._id,
    });

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    // 使用新的查询服务获取合并后的数据
    const result = await wordQueryService.getDictionaryWords(
      dictId,
      Number(page),
      Number(pageSize)
    );

    res.json(result);
  } catch (error) {
    console.error("获取单词列表出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "获取单词列表失败",
    });
  }
};

/**
 * 添加单词到词库
 * POST /api/custom-dictionaries/:dictId/words
 * 支持智能词汇补充
 */
export const addWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dictId } = req.params;
    const { words } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({
        success: false,
        error: "无效的单词数据",
      });
      return;
    }

    // 验证词库是否存在且属于当前用户
    const dictionary = await CustomDictionary.findOne({
      id: dictId,
      userId: req.user._id,
    });

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    // 检查是否为简单字符串数组（新格式）
    const isSimpleWordArray = words.every((word) => typeof word === "string");

    let uploadResult;
    if (isSimpleWordArray) {
      // 使用新的智能补充服务
      uploadResult = await dictionaryUploadService.processWordUpload(
        words,
        dictId
      );
    } else {
      // 兼容旧版本格式
      uploadResult = await dictionaryUploadService.processLegacyWordUpload(
        words,
        dictId
      );
    }

    // 获取当前最大索引值
    const maxIndexWord = await CustomWord.findOne({ dictId })
      .sort({ index: -1 })
      .limit(1);

    let startIndex = maxIndexWord ? maxIndexWord.index + 1 : 0;

    // 更新索引
    const wordsToInsert = uploadResult.words.map((word, i) => ({
      ...word,
      index: startIndex + i,
    }));

    console.log(
      `[CustomWordController] 准备插入 ${wordsToInsert.length} 个单词`
    );
    console.log(
      `[CustomWordController] 前3个单词的数据:`,
      wordsToInsert.slice(0, 3).map((w) => ({
        name: w.name,
        sourceType: w.sourceType,
        officialWordId: w.officialWordId,
        isEmpty: w.isEmpty,
      }))
    );

    // 批量插入单词
    const insertedWords = await CustomWord.insertMany(wordsToInsert);

    console.log(
      `[CustomWordController] 成功插入 ${insertedWords.length} 个单词`
    );
    console.log(
      `[CustomWordController] 插入后前3个单词的数据:`,
      insertedWords.slice(0, 3).map((w) => ({
        name: w.name,
        sourceType: w.sourceType,
        officialWordId: w.officialWordId,
        isEmpty: w.isEmpty,
      }))
    );

    // 更新词库单词数量
    await CustomDictionary.findOneAndUpdate(
      { id: dictId },
      { $inc: { length: insertedWords.length } }
    );

    res.status(201).json({
      success: true,
      words: insertedWords,
      result: {
        total: uploadResult.total,
        enriched: uploadResult.enriched,
        empty: uploadResult.empty,
        enrichmentRate: uploadResult.enrichmentRate,
      },
    });
  } catch (error) {
    console.error("添加单词出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "添加单词失败",
    });
  }
};

/**
 * 更新单词信息
 * PUT /api/custom-dictionaries/:dictId/words/:wordId
 * 支持新的数据结构
 */
export const updateWord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { dictId, wordId } = req.params;
    const updateData = req.body;

    // 防止修改关键字段
    delete updateData.id;
    delete updateData.dictId;
    delete updateData.index;

    // 验证词库是否存在且属于当前用户
    const dictionary = await CustomDictionary.findOne({
      id: dictId,
      userId: req.user._id,
    });

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    // 获取当前单词
    const currentWord = await CustomWord.findOne({ id: wordId, dictId });
    if (!currentWord) {
      res.status(404).json({
        success: false,
        error: "单词不存在",
      });
      return;
    }

    // 处理新数据结构的更新
    const finalUpdateData: any = {
      ...updateData,
      updatedAt: Date.now(),
    };

    // 如果提供了userData，标记为用户修改
    if (updateData.userData) {
      finalUpdateData.isUserModified = true;
      finalUpdateData.isEmpty = false;

      // 如果原来是官方数据，转换为用户自定义
      if (currentWord.sourceType === "official") {
        finalUpdateData.sourceType = "user_custom";
      }
    }

    // 更新单词
    const word = await CustomWord.findOneAndUpdate(
      { id: wordId, dictId },
      finalUpdateData,
      { new: true }
    );

    res.json({
      success: true,
      word,
    });
  } catch (error) {
    console.error("更新单词出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "更新单词失败",
    });
  }
};

/**
 * 删除单词
 * DELETE /api/custom-dictionaries/:dictId/words/:wordId
 */
export const deleteWord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { dictId, wordId } = req.params;

    // 验证词库是否存在且属于当前用户
    const dictionary = await CustomDictionary.findOne({
      id: dictId,
      userId: req.user._id,
    });

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    // 删除单词
    const result = await CustomWord.findOneAndDelete({
      id: wordId,
      dictId,
    });

    if (!result) {
      res.status(404).json({
        success: false,
        error: "单词不存在",
      });
      return;
    }

    // 更新词库单词数量
    await CustomDictionary.findOneAndUpdate(
      { id: dictId },
      { $inc: { length: -1 } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("删除单词出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "删除单词失败",
    });
  }
};

/**
 * 预览词汇补充结果
 * POST /api/custom-dictionaries/preview-enrichment
 */
export const previewEnrichment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { words } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({
        success: false,
        error: "无效的单词数据",
      });
      return;
    }

    // 使用词汇补充服务获取预览结果
    const enrichmentResults = await wordEnrichmentService.batchEnrichWords(
      words
    );
    const stats = wordEnrichmentService.getEnrichmentStats(enrichmentResults);

    res.json({
      success: true,
      result: stats,
    });
  } catch (error) {
    console.error("预览词汇补充出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "预览失败",
    });
  }
};

/**
 * 调试词汇补充功能
 * POST /api/custom-dictionaries/debug-enrichment
 */
export const debugEnrichment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { words } = req.body;

    if (!Array.isArray(words) || words.length === 0) {
      res.status(400).json({
        success: false,
        error: "无效的单词数据",
      });
      return;
    }

    console.log(
      `[DebugEnrichment] 开始调试词汇补充，单词数量: ${words.length}`
    );
    console.log(`[DebugEnrichment] 单词列表:`, words);

    // 使用词汇补充服务获取详细结果
    const enrichmentResults = await wordEnrichmentService.batchEnrichWords(
      words
    );
    const stats = wordEnrichmentService.getEnrichmentStats(enrichmentResults);

    // 使用上传服务生成完整的单词数据
    const uploadResult = await dictionaryUploadService.processWordUpload(
      words,
      "debug-dict-id"
    );

    res.json({
      success: true,
      debug: {
        enrichmentResults,
        stats,
        uploadResult: {
          total: uploadResult.total,
          enriched: uploadResult.enriched,
          empty: uploadResult.empty,
          enrichmentRate: uploadResult.enrichmentRate,
        },
        sampleWords: uploadResult.words.slice(0, 3),
      },
    });
  } catch (error) {
    console.error("调试词汇补充出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "调试失败",
    });
  }
};
