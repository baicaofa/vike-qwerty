import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
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
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JwtPayload;
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "用户不存在" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "令牌无效" });
      return;
    }
  } catch (error) {
    next(error);
  }
};
