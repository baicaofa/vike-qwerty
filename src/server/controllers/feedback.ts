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

// 投票功能（统一使用设备ID标识）
export const voteFeedback = async (req: Request, res: Response) => {
  try {
    console.log("收到投票请求:", {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      params: req.params,
      ip: req.ip,
    });

    const { id } = req.params;
    const { vote, deviceId } = req.body;

    // 验证投票类型
    if (vote !== "up" && vote !== "down" && vote !== "remove") {
      console.log("投票类型无效:", vote);
      return res.status(400).json({
        success: false,
        message: "投票类型无效，必须是 'up'、'down' 或 'remove'",
      });
    }

    // 验证设备ID
    if (!deviceId) {
      console.log("缺少设备标识");
      return res.status(400).json({
        success: false,
        message: "缺少设备标识",
      });
    }

    console.log("开始查找反馈:", id);
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      console.log("未找到反馈:", id);
      return res.status(404).json({
        success: false,
        message: "未找到该反馈",
      });
    }

    console.log("找到反馈:", {
      id: feedback._id,
      title: feedback.title,
      upvotes: feedback.upvotes,
      downvotes: feedback.downvotes,
    });

    // 查找现有投票（只通过deviceId）
    const voterIndex = feedback.voters.findIndex(
      (voter) => voter.deviceId === deviceId
    );

    const hasVoted = voterIndex !== -1;
    const previousVote = hasVoted ? feedback.voters[voterIndex].vote : null;

    console.log("投票状态:", {
      hasVoted,
      previousVote,
      newVote: vote,
      deviceId,
    });

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
          deviceId,
          vote,
          createdAt: new Date(),
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

// 管理员回复反馈（仅管理员可访问）
export const replyToFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // 验证必填字段
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "请提供回复内容",
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "未找到该反馈",
      });
    }

    // 添加回复
    feedback.replies.push({
      adminId: req.user._id,
      adminUsername: req.user.username,
      content,
      createdAt: new Date(),
    });

    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
      message: "回复已添加",
    });
  } catch (error: any) {
    console.error("添加回复失败:", error);
    res.status(500).json({
      success: false,
      message: "添加回复时出错",
      error: error.message,
    });
  }
};
