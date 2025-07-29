import CustomDictionary from "../models/CustomDictionary";
import CustomWord from "../models/CustomWord";
import { generateUUID } from "../utils/uuid";
import type { Request, Response } from "express";

/**
 * 获取词库列表
 * GET /api/custom-dictionaries
 * 支持分页、搜索和排序
 */
export const getDictionaries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      pageSize = 20,
      search,
      sortBy = "updatedAt",
      order = "desc",
    } = req.query;

    // 构建查询条件
    const query: any = { userId: req.user._id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 计算总数
    const total = await CustomDictionary.countDocuments(query);

    // 构建排序条件
    const sortOptions: any = {};
    sortOptions[sortBy as string] = order === "asc" ? 1 : -1;

    // 查询数据
    const dictionaries = await CustomDictionary.find(query)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));

    res.json({
      dictionaries,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (error) {
    console.error("获取词库列表出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "获取词库列表失败",
    });
  }
};

/**
 * 获取单个词库
 * GET /api/custom-dictionaries/:id
 */
export const getDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const dictionary = await CustomDictionary.findOne({
      id,
      userId: req.user._id,
    });

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    res.json(dictionary);
  } catch (error) {
    console.error("获取词库详情出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "获取词库详情失败",
    });
  }
};

/**
 * 创建词库
 * POST /api/custom-dictionaries
 */
export const createDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dictionaryData = req.body;

    // 验证词库名称
    if (!dictionaryData.name || !dictionaryData.name.trim()) {
      res.status(400).json({
        success: false,
        error: "词库名称不能为空",
      });
      return;
    }

    // 检查同一用户下是否已存在相同名称的词库
    const existingDictionary = await CustomDictionary.findOne({
      userId: req.user._id,
      name: dictionaryData.name.trim(),
    });

    if (existingDictionary) {
      res.status(409).json({
        success: false,
        error: "词库名称已存在，请使用其他名称",
      });
      return;
    }

    // 添加必要字段
    dictionaryData.id = generateUUID();
    dictionaryData.userId = req.user._id;
    dictionaryData.name = dictionaryData.name.trim(); // 去除首尾空格
    dictionaryData.createdAt = Date.now();
    dictionaryData.updatedAt = Date.now();

    const dictionary = await CustomDictionary.create(dictionaryData);

    res.status(201).json(dictionary);
  } catch (error) {
    console.error("创建词库出错:", error);

    // 处理 MongoDB 唯一索引冲突错误
    if (error instanceof Error && error.message.includes("duplicate key")) {
      res.status(409).json({
        success: false,
        error: "词库名称已存在，请使用其他名称",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "创建词库失败",
    });
  }
};

/**
 * 更新词库
 * PUT /api/custom-dictionaries/:id
 */
export const updateDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 防止修改关键字段
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;

    // 如果要更新名称，需要验证唯一性
    if (updateData.name) {
      updateData.name = updateData.name.trim();

      if (!updateData.name) {
        res.status(400).json({
          success: false,
          error: "词库名称不能为空",
        });
        return;
      }

      // 检查同一用户下是否已存在相同名称的其他词库
      const existingDictionary = await CustomDictionary.findOne({
        userId: req.user._id,
        name: updateData.name,
        id: { $ne: id }, // 排除当前词库
      });

      if (existingDictionary) {
        res.status(409).json({
          success: false,
          error: "词库名称已存在，请使用其他名称",
        });
        return;
      }
    }

    // 更新时间
    updateData.updatedAt = Date.now();

    const dictionary = await CustomDictionary.findOneAndUpdate(
      { id, userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    res.json(dictionary);
  } catch (error) {
    console.error("更新词库出错:", error);

    // 处理 MongoDB 唯一索引冲突错误
    if (error instanceof Error && error.message.includes("duplicate key")) {
      res.status(409).json({
        success: false,
        error: "词库名称已存在，请使用其他名称",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "更新词库失败",
    });
  }
};

/**
 * 删除词库
 * DELETE /api/custom-dictionaries/:id
 */
export const deleteDictionary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // 首先验证词库是否存在且属于当前用户
    const dictionary = await CustomDictionary.findOne({
      id,
      userId: req.user._id,
    });

    if (!dictionary) {
      res.status(404).json({
        success: false,
        error: "词库不存在或无权访问",
      });
      return;
    }

    // 级联删除：先查询关联的单词数量
    const wordCount = await CustomWord.countDocuments({ dictId: id });

    // 删除所有关联的单词记录
    const deleteWordsResult = await CustomWord.deleteMany({ dictId: id });

    // 然后删除词库记录
    const deleteDictResult = await CustomDictionary.findOneAndDelete({
      id,
      userId: req.user._id,
    });

    if (!deleteDictResult) {
      res.status(500).json({
        success: false,
        error: "删除词库失败",
      });
      return;
    }

    // 成功删除
    res.json({
      success: true,
      deletedWordsCount: deleteWordsResult.deletedCount,
      message: `成功删除词典"${deleteDictResult.name}"及其${deleteWordsResult.deletedCount}个单词`,
    });
  } catch (error) {
    console.error("删除词库出错:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "删除词库失败",
    });
  }
};
