import Feedback from "../models/Feedback";
import type { Request, Response } from "express";

// 提交新的反馈
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { type, title, description, contactInfo } = req.body;

    // 验证必填字段
    if (!type || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "请提供反馈类型、标题和描述",
      });
    }

    // 创建反馈记录
    const feedback = new Feedback({
      type,
      title,
      description,
      contactInfo,
      // 如果用户已登录，关联用户ID
      ...(req.user && { userId: req.user._id }),
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      data: feedback,
      message: "感谢您的反馈！",
    });
  } catch (error: any) {
    console.error("提交反馈失败:", error);
    res.status(500).json({
      success: false,
      message: "提交反馈时出错",
      error: error.message,
    });
  }
};

// 获取所有反馈（仅管理员可访问）
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    // 分页参数
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 筛选参数
    const filter: any = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    // 查询反馈
    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username email");

    // 获取总数
    const total = await Feedback.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: feedbacks,
    });
  } catch (error: any) {
    console.error("获取反馈列表失败:", error);
    res.status(500).json({
      success: false,
      message: "获取反馈列表时出错",
      error: error.message,
    });
  }
};

// 更新反馈状态（仅管理员可访问）
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "未找到该反馈",
      });
    }

    if (status) feedback.status = status;
    if (priority) feedback.priority = priority;

    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
      message: "反馈状态已更新",
    });
  } catch (error: any) {
    console.error("更新反馈状态失败:", error);
    res.status(500).json({
      success: false,
      message: "更新反馈状态时出错",
      error: error.message,
    });
  }
};

// 获取公共反馈列表（所有用户可访问）
export const getPublicFeedback = async (req: Request, res: Response) => {
  try {
    // 分页参数
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 筛选参数
    const filter: any = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    // 排序参数
    let sortOption: any = { createdAt: -1 }; // 默认按创建时间倒序

    if (req.query.sort === "upvotes") {
      sortOption = { upvotes: -1, createdAt: -1 }; // 按点赞数排序
    }

    // 查询反馈，不返回敏感信息
    const feedbacks = await Feedback.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("userId", "username") // 只返回用户名，不包含邮箱等敏感信息
      .select("-contactInfo"); // 不返回联系方式

    // 获取总数
    const total = await Feedback.countDocuments(filter);

    // 处理反馈数据，返回给前端
    const processedData = feedbacks.map((feedback) => {
      const feedbackObj = feedback.toObject();

      // 如果用户已登录，检查是否投过票
      let userVote = null;
      if (req.user) {
        const voter = feedback.voters.find(
          (voter) =>
            voter.userId && voter.userId.toString() === req.user._id.toString()
        );
        if (voter) {
          userVote = voter.vote;
        }
      }

      // 返回处理后的数据，不包含voters列表
      return {
        ...feedbackObj,
        userVote,
        voters: undefined,
      };
    });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: processedData,
    });
  } catch (error: any) {
    console.error("获取公共反馈列表失败:", error);
    res.status(500).json({
      success: false,
      message: "获取反馈列表时出错",
      error: error.message,
    });
  }
};

// 投票功能（需要登录）
export const voteFeedback = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "请先登录后再投票",
      });
    }

    const { id } = req.params;
    const { vote } = req.body;

    // 验证投票类型
    if (vote !== "up" && vote !== "down" && vote !== "remove") {
      return res.status(400).json({
        success: false,
        message: "投票类型无效，必须是 'up'、'down' 或 'remove'",
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "未找到该反馈",
      });
    }

    // 检查用户是否已经投票
    const voterIndex = feedback.voters.findIndex(
      (voter) => voter.userId.toString() === req.user._id.toString()
    );

    const hasVoted = voterIndex !== -1;
    const previousVote = hasVoted ? feedback.voters[voterIndex].vote : null;

    // 处理投票逻辑
    if (vote === "remove") {
      // 移除投票
      if (hasVoted) {
        // 减少相应的计数
        if (previousVote === "up") {
          feedback.upvotes = Math.max(0, feedback.upvotes - 1);
        } else {
          feedback.downvotes = Math.max(0, feedback.downvotes - 1);
        }

        // 从voters数组中移除
        feedback.voters.splice(voterIndex, 1);
      }
    } else {
      if (hasVoted) {
        // 已经投过票，检查是否需要改变投票
        if (previousVote !== vote) {
          // 更新投票类型
          feedback.voters[voterIndex].vote = vote;

          // 更新计数
          if (previousVote === "up") {
            feedback.upvotes = Math.max(0, feedback.upvotes - 1);
            feedback.downvotes += 1;
          } else {
            feedback.downvotes = Math.max(0, feedback.downvotes - 1);
            feedback.upvotes += 1;
          }
        }
        // 如果投票类型相同，不做任何操作
      } else {
        // 新增投票
        feedback.voters.push({
          userId: req.user._id,
          vote,
        });

        // 更新计数
        if (vote === "up") {
          feedback.upvotes += 1;
        } else {
          feedback.downvotes += 1;
        }
      }
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      data: {
        _id: feedback._id,
        upvotes: feedback.upvotes,
        downvotes: feedback.downvotes,
        userVote: vote === "remove" ? null : vote,
      },
      message: vote === "remove" ? "投票已取消" : "投票成功",
    });
  } catch (error: any) {
    console.error("投票失败:", error);
    res.status(500).json({
      success: false,
      message: "投票时出错",
      error: error.message,
    });
  }
};
