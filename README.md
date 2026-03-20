# GlobalShop — 外贸独立站

> 一套面向全球市场的跨境电商独立站解决方案，支持多语言、多货币、国际物流与主流支付网关。

---

## 🚀 快速启动（3步）

```bash
# 1. 复制环境变量并填写配置
cp .env.example .env
# 编辑 .env，修改所有 change_me_* 的值

# 2. 启动所有服务
docker compose up -d --build

# 3. 访问
# 前台商城:    http://localhost
# 管理后台:    http://localhost/admin
# API 文档:    http://localhost/api/docs
# MinIO 控制台: http://localhost:9001
```

---

## 📁 目录结构

```
globalshop/
├── docker-compose.yml       # 服务编排
├── .env.example             # 环境变量模板
├── .env                     # 实际配置（不提交 git）
├── schema.sql               # 数据库初始化 SQL
├── init-db.sh               # 数据库初始化脚本
├── README.md
│
├── nginx/
│   ├── nginx.conf           # 反向代理配置
│   └── ssl/                 # SSL 证书（生产环境）
│
├── shop-backend/            # 后端 API 服务
│   ├── Dockerfile
│   └── src/
│
├── shop-frontend/           # 前台商城（React/Vue）
│   ├── Dockerfile
│   └── src/
│
├── shop-admin/              # 管理后台（Vue + Vite）
│   ├── Dockerfile
│   └── src/
│
└── logs/
    ├── backend/
    └── nginx/
```

---

## ⚙️ 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | *(必填)* |
| `MYSQL_DATABASE` | 数据库名 | `globalshop` |
| `MYSQL_USER` | 业务账号 | `shopuser` |
| `MYSQL_PASSWORD` | 业务账号密码 | *(必填)* |
| `REDIS_PASSWORD` | Redis 密码 | *(必填)* |
| `MINIO_ROOT_USER` | MinIO 管理员账号 | `minioadmin` |
| `MINIO_ROOT_PASSWORD` | MinIO 管理员密码 | *(必填)* |
| `JWT_SECRET` | JWT 签名密钥（≥32字符随机串） | *(必填)* |
| `CORS_ORIGIN` | 允许的跨域来源 | `https://yourdomain.com` |
| `VITE_API_BASE_URL` | 前端 API 前缀 | `/api` |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | *(支付必填)* |
| `SMTP_HOST` | 邮件服务器 | *(邮件必填)* |

完整列表见 `.env.example`。

---

## 🛠️ 开发指南

### 本地开发（不用 Docker）

```bash
# 只启动基础服务（数据库/缓存/存储）
docker compose up -d mysql redis minio

# 后端
cd shop-backend && npm install && npm run dev

# 前台
cd shop-frontend && npm install && npm run dev

# 后台
cd shop-admin && npm install && npm run dev
```

### 查看日志

```bash
# 所有服务
docker compose logs -f

# 单个服务
docker compose logs -f backend
docker compose logs -f nginx
```

### 重新构建单个服务

```bash
docker compose up -d --build backend
```

### 数据库迁移

```bash
# 手动执行 SQL
docker exec -i globalshop-mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" globalshop < migration.sql
```

### MinIO 初始化 bucket

```bash
# 进入 MinIO 容器
docker exec -it globalshop-minio mc alias set local http://localhost:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD
docker exec -it globalshop-minio mc mb local/globalshop-assets
docker exec -it globalshop-minio mc policy set public local/globalshop-assets
```

---

## 🏭 生产部署清单

```
部署前必须完成：

[ ] 1. 修改 .env 中所有 change_me_* 密码为高强度随机值
[ ] 2. JWT_SECRET 使用 openssl rand -base64 32 生成
[ ] 3. 申请 SSL 证书，放入 nginx/ssl/（fullchain.pem + privkey.pem）
[ ] 4. 取消 nginx.conf 中 HTTPS/TLS 配置的注释
[ ] 5. 启用 HTTP→HTTPS 强制跳转
[ ] 6. 配置 Stripe/PayPal 生产环境密钥
[ ] 7. 配置 SMTP 邮件服务
[ ] 8. 设置服务器防火墙（仅开放 80/443，内网服务不对外暴露）
[ ] 9. 配置定时备份（MySQL + MinIO 数据）
[ ] 10. 接入监控告警（Sentry DSN、Uptime 监控）
[ ] 11. 确认 CORS_ORIGIN 为生产域名
[ ] 12. docker compose up -d --build 完整构建
[ ] 13. 验证所有服务 healthcheck 通过
[ ] 14. 压测 /api 接口，确认性能达标
```

### 推荐服务器规格

| 规模 | CPU | 内存 | 磁盘 |
|------|-----|------|------|
| 测试/小型 | 2核 | 4GB | 50GB SSD |
| 中型 | 4核 | 8GB | 100GB SSD |
| 生产 | 8核+ | 16GB+ | 200GB+ SSD |

### 常用运维命令

```bash
# 停止所有服务
docker compose down

# 停止并清空数据卷（危险！）
docker compose down -v

# 更新镜像并重启
docker compose pull && docker compose up -d

# 查看资源占用
docker stats
```

---

## 📞 技术支持

- 项目文档：`/docs`
- 问题反馈：GitHub Issues
