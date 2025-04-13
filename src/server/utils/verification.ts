import { VerificationData } from "../models/verification";

interface RegistrationData {
  username: string;
  email: string;
  password: string;
  timestamp: number;
}

// 存储验证数据
export const storeVerificationData = async (
  email: string,
  code: string,
  data: RegistrationData
): Promise<void> => {
  try {
    // 删除该邮箱的旧验证数据
    await VerificationData.deleteMany({ email });

    // 存储新的验证数据
    await VerificationData.create({
      email,
      code,
      data: JSON.stringify(data),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15分钟有效期
    });
  } catch (error) {
    console.error("存储验证数据失败:", error);
    throw error;
  }
};

// 验证并获取注册数据
export const verifyAndGetRegistrationData = async (
  email: string,
  code: string
): Promise<RegistrationData | null> => {
  try {
    const verification = await VerificationData.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return null;
    }

    // 删除已使用的验证数据
    await VerificationData.deleteOne({ _id: verification._id });

    return JSON.parse(verification.data);
  } catch (error) {
    console.error("验证数据获取失败:", error);
    throw error;
  }
};
