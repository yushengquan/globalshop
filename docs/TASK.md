# GlobalShop 开发任务

## 项目路径
D:\globalshop\

## 任务目标
构建外贸独立站 GlobalShop MVP，包含三个子项目：
1. shop-backend: Spring Boot 3 后端 API
2. shop-frontend: Next.js 14 买家端
3. shop-admin: React 18 + Ant Design 5 管理后台

## 详细需求
见 D:\globalshop\docs\PRD.md

## 优先级
Phase 1 MVP，先做后端骨架 + 买家端首页/商品/购物车/结账 + 管理后台商品/订单管理

## 技术要求
- 后端: Spring Boot 3, MySQL 8, Redis, JWT, MinIO, Maven
- 买家端: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- 管理后台: React 18, TypeScript, Ant Design 5, Vite
- 统一响应: { code, msg, data }
- 支付: Stripe Mock (先用测试模式)
- Docker Compose 统一启动
