import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import dbStatsRoutes from "./routes/db-stats";
import feedbackRoutes from "./routes/feedback";
import syncRoutes from "./routes/sync";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/db-stats", dbStatsRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
