import User from "../models/User";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

declare module "express" {
  interface Request {
    user?: any;
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ message: "未授权，请先登录" });
      return;
    }

    try {
      // 验证 token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JwtPayload;

      // 获取用户信息
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "用户不存在" });
        return;
      }

      // 将用户信息添加到请求对象中
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "无效的认证令牌" });
      return;
    }
  } catch (error) {
    next(error);
  }
};
