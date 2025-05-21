import { createHash } from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 创建验证码存储
const verificationCodes: Record<string, { code: string; expireTime: number }> =
  {};

// 创建邮件传输器 - 使用硬编码的配置
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true,
  auth: {
    user: "320712069@qq.com",
    pass: "aguujefneyfvcbca",
  },
});

/**
 * 生成验证码
 * @param email 用户邮箱
 * @returns 验证码
 */
export const generateVerificationCode = (email: string): string => {
  // 生成6位随机数字验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 存储验证码，15分钟有效期
  verificationCodes[email] = {
    code,
    expireTime: Date.now() + 15 * 60 * 1000, // 15分钟
  };

  return code;
};

/**
 * 验证邮箱验证码
 * @param email 用户邮箱
 * @param code 验证码
 * @returns 是否验证成功
 */
export const verifyCode = (email: string, code: string): boolean => {
  const storedData = verificationCodes[email];

  if (!storedData) {
    return false;
  }

  // 检查是否过期
  if (Date.now() > storedData.expireTime) {
    delete verificationCodes[email];
    return false;
  }

  // 检查验证码是否匹配
  if (storedData.code !== code) {
    return false;
  }

  // 验证成功后删除验证码
  delete verificationCodes[email];
  return true;
};

/**
 * 发送验证码邮件
 * @param email 用户邮箱
 * @param code 验证码
 * @returns 是否发送成功
 */
export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    console.log("Sending verification email to:", email);

    await transporter.sendMail({
      from: "320712069@qq.com",
      to: email,
      subject: "Keybr 邮箱验证",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Keybr 邮箱验证</h2>
          <p>您好，感谢您注册 Keybr！</p>
          <p>您的验证码是：</p>
          <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>此验证码将在15分钟后过期。</p>
          <p>如果您没有注册 Keybr，请忽略此邮件。</p>
        </div>
      `,
    });
    console.log("Verification email sent successfully");
    return true;
  } catch (error) {
    console.error("发送邮件失败:", error);
    return false;
  }
};

/**
 * 生成密码重置令牌
 * @param email 用户邮箱
 * @returns 重置令牌
 */
export const generatePasswordResetToken = (email: string): string => {
  const token = createHash("sha256")
    .update(email + Date.now().toString())
    .digest("hex");

  // 存储令牌，24小时有效期
  verificationCodes[email] = {
    code: token,
    expireTime: Date.now() + 24 * 60 * 60 * 1000, // 24小时
  };

  return token;
};

/**
 * 发送密码重置邮件
 * @param email 用户邮箱
 * @param token 重置令牌
 * @returns 是否发送成功
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<boolean> => {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(
    email
  )}`;

  try {
    console.log("Sending password reset email to:", email);
    console.log("Reset URL:", resetUrl);

    await transporter.sendMail({
      from: "320712069@qq.com",
      to: email,
      subject: "Keybr 密码重置",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Keybr 密码重置</h2>
          <p>您好，我们收到了您的密码重置请求。</p>
          <p>请点击下面的链接重置您的密码：</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">重置密码</a>
          </div>
          <p>此链接将在24小时后过期。</p>
          <p>如果您没有请求重置密码，请忽略此邮件。</p>
        </div>
      `,
    });
    console.log("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error("发送密码重置邮件失败:", error);
    return false;
  }
};
