import axios from "axios";

export interface FeedbackFormData {
  type: string;
  title: string;
  description: string;
  contactInfo?: string;
}

// 投票数据接口
export interface VoteData {
  vote: "up" | "down" | "remove";
  deviceId?: string; // 匿名用户的设备指纹
}

// 提交反馈
export const submitFeedback = async (feedbackData: FeedbackFormData) => {
  try {
    const response = await axios.post("/api/feedback", feedbackData);
    return response.data;
  } catch (error: any) {
    // 处理错误
    const message =
      error.response?.data?.message || "提交反馈时出错，请稍后再试";
    throw new Error(message);
  }
};

// 仅管理员可用：获取所有反馈
export const getAllFeedback = async (
  page = 1,
  limit = 10,
  filters: Record<string, string> = {}
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("111未授权，请先登录");
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await axios.get(`/api/feedback?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    // 处理错误
    const message =
      error.response?.data?.message || "获取反馈列表时出错，请稍后再试";
    throw new Error(message);
  }
};

// 仅管理员可用：更新反馈状态
export const updateFeedbackStatus = async (
  id: string,
  data: { status?: string; priority?: string }
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("1111未授权，请先登录");
    }

    const response = await axios.patch(`/api/feedback/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    // 处理错误
    const message =
      error.response?.data?.message || "更新反馈状态时出错，请稍后再试";
    throw new Error(message);
  }
};

// 所有用户可用：获取公共反馈列表
export const getPublicFeedback = async (
  page = 1,
  limit = 10,
  filters: Record<string, string> = {},
  sort = "newest"
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
      ...(sort === "upvotes" && { sort: "upvotes" }),
    });

    // 获取认证token（如果用户已登录）
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // 添加调试信息
    console.log(`Requesting: /api/feedback/public?${params.toString()}`);
    console.log("Headers:", headers);

    const response = await axios.get(`/api/feedback/public?${params}`, {
      headers,
    });

    return response.data;
  } catch (error: any) {
    // 添加调试信息
    console.error("Error fetching public feedback:", error);

    // 处理错误
    const message =
      error.response?.data?.message || "获取反馈列表时出错，请稍后再试";
    throw new Error(message);
  }
};

// 为反馈投票（统一使用设备ID）
export const voteFeedback = async (id: string, voteData: VoteData) => {
  try {
    console.log("发送投票请求:", {
      url: `/api/feedback/${id}/vote`,
      data: voteData,
    });

    // 创建一个干净的axios实例，不使用任何默认头部
    const cleanAxios = axios.create();
    delete cleanAxios.defaults.headers.common["Authorization"]; // 确保没有认证头部

    const response = await cleanAxios.post(
      `/api/feedback/${id}/vote`,
      voteData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("投票响应成功:", response.data);
    return response.data;
  } catch (error: any) {
    // 详细记录错误
    console.error("投票请求失败:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error,
    });

    // 处理错误
    const message = error.response?.data?.message || "投票时出错，请稍后再试";
    throw new Error(message);
  }
};
