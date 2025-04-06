# Vike Qwerty 后端服务器

这是 Vike Qwerty 项目的后端服务器部分，提供用户认证和 API 服务。

## 功能

- 用户注册
- 用户登录
- JWT 认证
- 用户信息获取

## 技术栈

- Node.js
- Express
- TypeScript
- MongoDB
- JWT

## 安装

```bash
# 安装依赖
npm install
# 或
yarn install
```

## 配置

在 `.env` 文件中配置以下环境变量：

```
MONGODB_URI=mongodb://localhost:27017/vike-qwerty
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## 运行

```bash
# 开发模式
npm run dev
# 或
yarn dev

# 生产模式
npm run build
npm run serve
# 或
yarn build
yarn serve
```

## API 端点

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息（需要认证）

## 与前端集成

前端项目需要配置代理，将 `/api` 请求转发到后端服务器。
