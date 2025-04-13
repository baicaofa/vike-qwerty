import User from "../models/User";
import {
  generatePasswordResetToken,
  generateVerificationCode,
  sendPasswordResetEmail,
  sendVerificationEmail,
  verifyCode,
} from "../services/emailService";
import {
  verifyAndGetRegistrationData,
  storeVerificationData,
} from "../utils/verification";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, code } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400).json({ message: "用户名或邮箱已被注册" });
      return;
    }

    // 验证验证码
    const isValid = verifyCode(email, code);
    if (!isValid) {
      res.status(400).json({ message: "验证码无效或已过期" });
      return;
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
      isEmailVerified: true,
    });

    // 返回注册成功信息和 token
    res.status(201).json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      isEmailVerified: true,
      token: generateToken(user._id.toString()),
      message: "注册成功",
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "邮箱或密码错误" });
      return;
    }

    // 检查账户是否被锁定
    if (user.lockUntil && user.lockUntil > new Date()) {
      const lockTime = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );
      res.status(401).json({
        message: `账户已被锁定，请${lockTime}分钟后再试`,
        locked: true,
        lockTime,
      });
      return;
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // 增加登录失败次数
      await user.incrementLoginAttempts();

      // 如果账户被锁定，返回锁定信息
      if (user.lockUntil && user.lockUntil > new Date()) {
        const lockTime = Math.ceil(
          (user.lockUntil.getTime() - Date.now()) / 60000
        );
        res.status(401).json({
          message: `密码错误，账户已被锁定，请${lockTime}分钟后再试`,
          locked: true,
          lockTime,
        });
        return;
      }

      res.status(401).json({
        message: "邮箱或密码错误",
        attemptsLeft: 5 - user.loginAttempts,
      });
      return;
    }

    // 登录成功，重置登录尝试次数
    await user.resetLoginAttempts();

    // 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

// 发送验证码
export const sendVerificationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // 生成验证码并发送
    const verificationCode = generateVerificationCode(email);
    const sent = await sendVerificationEmail(email, verificationCode);

    if (sent) {
      res.status(200).json({ message: "验证码已发送，请查收邮件" });
    } else {
      res.status(500).json({ message: "验证码发送失败，请稍后再试" });
    }
  } catch (error) {
    console.error("发送验证码错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 验证邮箱
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, code } = req.body;

    // 验证验证码
    const isValid = verifyCode(email, code);
    if (!isValid) {
      res.status(400).json({ message: "验证码无效或已过期" });
      return;
    }

    res.status(200).json({ message: "验证码验证成功" });
  } catch (error) {
    console.error("验证邮箱错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 请求密码重置
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      res.status(200).json({ message: "如果邮箱存在，重置链接将发送到该邮箱" });
      return;
    }

    // 生成重置令牌
    const token = generatePasswordResetToken(email);

    // 更新用户的重置令牌和过期时间
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时
    await user.save();

    // 发送重置邮件
    const sent = await sendPasswordResetEmail(email, token);

    if (sent) {
      res.status(200).json({ message: "如果邮箱存在，重置链接将发送到该邮箱" });
    } else {
      res.status(500).json({ message: "邮件发送失败，请稍后再试" });
    }
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

// 重置密码
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: "密码重置链接无效或已过期" });
      return;
    }

    // 更新密码
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "密码重置成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
};

// 第二步：验证邮箱并完成注册
export const completeRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, code } = req.body;

    // 1. 验证验证码并获取注册数据
    const registrationData = await verifyAndGetRegistrationData(email, code);
    if (!registrationData) {
      res.status(400).json({ message: "验证码无效或已过期" });
      return;
    }

    const { username, password } = registrationData;

    // 2. 再次检查用户是否已存在（防止在发送验证码后有人注册了相同用户名或邮箱）
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400).json({ message: "用户名或邮箱已被注册" });
      return;
    }

    // 3. 创建已验证的用户
    const user = await User.create({
      username,
      email,
      password,
      isEmailVerified: true,
    });

    // 4. 返回注册成功信息和 token
    res.status(201).json({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      isEmailVerified: true,
      token: generateToken(user._id.toString()),
      message: "注册成功",
    });
  } catch (error) {
    console.error("完成注册错误:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};
