import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import customDictionaryRoutes from "./routes/customDictionary";
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
// 增加请求体大小限制为50MB
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// 路由
app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/db-stats", dbStatsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/custom-dictionaries", customDictionaryRoutes);
app.use("/api/custom-dictionaries", customDictionaryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
