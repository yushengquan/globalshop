# GlobalShop 技术架构与任务分配方案

**制定人**: Tech Lead Agent  
**日期**: 2026-03-21  
**版本**: v1.0

---

## 一、架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        外部服务层                             │
│   Stripe / PayPal(Mock)  │  17track  │  SMTP(邮件)  │ MinIO │
└───────────────┬─────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────┐
│                       Nginx 反向代理                          │
│  shop.com → Next.js:3000  │  admin.shop.com → React:3001    │
│              /api/* → Spring Boot:8080                      │
└──────┬────────────────────────────┬───────────────┬─────────┘
       │                            │               │
┌──────▼──────┐   ┌─────────────────▼──┐  ┌────────▼────────┐
│  Next.js 14  │   │  React 18 + AntD5  │  │ Spring Boot 3   │
│  买家端前端   │   │     管理后台        │  │   REST API      │
│  Port: 3000  │   │   Port: 3001       │  │   Port: 8080    │
└─────────────┘   └────────────────────┘  └────────┬────────┘
                                                    │
                               ┌────────────────────┼────────────────┐
                               │                    │                │
                        ┌──────▼─────┐   ┌──────────▼─────┐  ┌──────▼──────┐
                        │  MySQL 8   │   │   Redis 7       │  │   MinIO     │
                        │  Port:3306 │   │   Port:6379     │  │  Port:9000  │
                        └────────────┘   └────────────────┘  └─────────────┘
```

### 技术选型说明

| 层次 | 技术 | 说明 |
|------|------|------|
| 买家端 | Next.js 14 App Router + TypeScript | SSR/SSG保障SEO，利于Google收录 |
| 管理后台 | React 18 + Ant Design 5 + Vite | 快速开发CRUD界面 |
| 后端 | Spring Boot 3.2 + Java 17 | 稳定的REST API层 |
| ORM | MyBatis-Plus | 灵活SQL + 代码生成 |
| 缓存 | Redis 7 | 购物车、Session、热点数据 |
| 数据库 | MySQL 8.0 | 主数据存储 |
| 文件 | MinIO | 商品图片存储 |
| 容器 | Docker Compose | 本地开发+一键部署 |
| 网关 | Nginx | 反向代理+SSL终止 |

### 目录结构

```
D:\globalshop\
├── shop-backend\          # Spring Boot 3 后端
├── shop-frontend\         # Next.js 14 买家端
├── shop-admin\            # React 18 管理后台
├── docker-compose.yml     # 全栈编排
├── nginx\                 # Nginx配置
│   └── nginx.conf
└── docs\
    ├── PRD.md
    └── TECH-PLAN.md
```

---

## 二、数据库 Schema（核心建表 SQL）

```sql
-- ============================================================
-- GlobalShop Database Schema v1.0
-- Engine: MySQL 8.0 | Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS globalshop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE globalshop;

-- 用户表
CREATE TABLE users (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
    first_name   VARCHAR(100),
    last_name    VARCHAR(100),
    phone        VARCHAR(30),
    avatar_url   VARCHAR(500),
    role         TINYINT NOT NULL DEFAULT 0 COMMENT '0=buyer,1=admin',
    status       TINYINT NOT NULL DEFAULT 1 COMMENT '1=active,0=disabled',
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 收货地址表
CREATE TABLE addresses (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,
    full_name    VARCHAR(200) NOT NULL,
    phone        VARCHAR(30),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100),
    postal_code  VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'US',
    is_default   TINYINT NOT NULL DEFAULT 0,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 商品分类表
CREATE TABLE categories (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id    INT UNSIGNED DEFAULT NULL,
    name         VARCHAR(100) NOT NULL,
    slug         VARCHAR(120) NOT NULL UNIQUE,
    description  TEXT,
    image_url    VARCHAR(500),
    sort_order   INT DEFAULT 0,
    is_active    TINYINT NOT NULL DEFAULT 1,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 商品主表
CREATE TABLE products (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id  INT UNSIGNED NOT NULL,
    name         VARCHAR(255) NOT NULL,
    slug         VARCHAR(280) NOT NULL UNIQUE,
    description  TEXT,
    detail_html  LONGTEXT,
    base_price   DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2) COMMENT '划线价',
    weight_gram  INT DEFAULT 0,
    is_active    TINYINT NOT NULL DEFAULT 1,
    is_featured  TINYINT NOT NULL DEFAULT 0,
    total_stock  INT NOT NULL DEFAULT 0,
    sales_count  INT NOT NULL DEFAULT 0,
    meta_title   VARCHAR(255),
    meta_desc    VARCHAR(500),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- 商品SKU表
CREATE TABLE product_skus (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id   BIGINT UNSIGNED NOT NULL,
    sku_code     VARCHAR(100) NOT NULL UNIQUE,
    specs        JSON NOT NULL COMMENT '{"color":"Red","size":"M"}',
    price        DECIMAL(10,2) NOT NULL,
    stock        INT NOT NULL DEFAULT 0,
    image_url    VARCHAR(500),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- 商品图片表
CREATE TABLE product_images (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id   BIGINT UNSIGNED NOT NULL,
    url          VARCHAR(500) NOT NULL,
    alt_text     VARCHAR(255),
    sort_order   INT DEFAULT 0,
    is_primary   TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- 购物车表（辅助持久化，主存Redis）
CREATE TABLE carts (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED,
    session_id   VARCHAR(128) COMMENT '游客购物车',
    sku_id       BIGINT UNSIGNED NOT NULL,
    quantity     INT NOT NULL DEFAULT 1,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sku_id) REFERENCES product_skus(id)
) ENGINE=InnoDB;

-- 运费规则表
CREATE TABLE shipping_methods (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    carrier      VARCHAR(100),
    price        DECIMAL(10,2) NOT NULL,
    free_threshold DECIMAL(10,2) COMMENT '满额免邮金额，NULL表示不免',
    estimated_days VARCHAR(30) COMMENT '如 5-10 business days',
    country_codes JSON COMMENT '适用国家，NULL=全部',
    is_active    TINYINT NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- 优惠券表
CREATE TABLE coupons (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code         VARCHAR(50) NOT NULL UNIQUE,
    type         TINYINT NOT NULL COMMENT '1=固定金额,2=百分比',
    value        DECIMAL(10,2) NOT NULL,
    min_order    DECIMAL(10,2) DEFAULT 0,
    max_uses     INT,
    used_count   INT NOT NULL DEFAULT 0,
    starts_at    DATETIME,
    expires_at   DATETIME,
    is_active    TINYINT NOT NULL DEFAULT 1,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 订单主表
CREATE TABLE orders (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_no        VARCHAR(64) NOT NULL UNIQUE COMMENT 'GS+yyyyMMdd+8位随机',
    user_id         BIGINT UNSIGNED NOT NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'pending'
                    COMMENT 'pending/paid/processing/shipped/delivered/cancelled/refunded',
    subtotal        DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_fee    DECIMAL(10,2) NOT NULL DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'USD',
    coupon_id       INT UNSIGNED,
    shipping_method_id INT UNSIGNED,
    -- 收货地址快照
    snap_full_name  VARCHAR(200),
    snap_address    TEXT,
    snap_country    CHAR(2),
    snap_postal     VARCHAR(20),
    -- 物流
    tracking_no     VARCHAR(100),
    carrier         VARCHAR(100),
    tracking_url    VARCHAR(500),
    -- 时间节点
    paid_at         DATETIME,
    shipped_at      DATETIME,
    delivered_at    DATETIME,
    note            TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 订单明细表
CREATE TABLE order_items (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id     BIGINT UNSIGNED NOT NULL,
    product_id   BIGINT UNSIGNED NOT NULL,
    sku_id       BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(255) NOT NULL COMMENT '快照',
    sku_specs    JSON COMMENT '快照',
    image_url    VARCHAR(500),
    price        DECIMAL(10,2) NOT NULL COMMENT '下单时单价快照',
    quantity     INT NOT NULL,
    subtotal     DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- 支付记录表
CREATE TABLE payments (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id         BIGINT UNSIGNED NOT NULL,
    payment_method   VARCHAR(30) NOT NULL COMMENT 'stripe/paypal',
    gateway_order_id VARCHAR(255) COMMENT 'Stripe PaymentIntent ID',
    amount           DECIMAL(10,2) NOT NULL,
    currency         CHAR(3) NOT NULL DEFAULT 'USD',
    status           VARCHAR(30) NOT NULL COMMENT 'pending/paid/failed/refunded',
    paid_at          DATETIME,
    raw_response     JSON COMMENT 'Gateway原始响应',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- 库存变更日志
CREATE TABLE stock_logs (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku_id       BIGINT UNSIGNED NOT NULL,
    change_qty   INT NOT NULL COMMENT '正=入库,负=出库',
    reason       VARCHAR(100) COMMENT 'order/adjustment/return',
    ref_id       BIGINT COMMENT '关联order_id等',
    operator_id  BIGINT UNSIGNED,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 索引补充
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured, is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_no ON orders(order_no);
CREATE INDEX idx_payments_order ON payments(order_id);
```

---

## 三、API 契约（核心接口列表）

> Base URL: `http://localhost:8080/api`  
> 认证: `Authorization: Bearer <JWT>`  
> 响应格式: `{"code":200,"msg":"ok","data":{}}`

### 3.1 认证模块 `/api/auth`

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | `/auth/register` | 否 | 注册，body: {email,password,firstName,lastName} |
| POST | `/auth/login` | 否 | 登录，返回 {accessToken, refreshToken} |
| POST | `/auth/refresh` | 否 | 刷新Token，body: {refreshToken} |
| POST | `/auth/logout` | 是 | 登出，Redis 黑名单 |

### 3.2 商品模块 `/api/products`

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| GET | `/products` | 否 | 列表，支持 ?category=&keyword=&sort=&page=&size= |
| GET | `/products/featured` | 否 | 首页热销/推荐 |
| GET | `/products/{id}` | 否 | 详情（含SKU+图片） |
| GET | `/products/slug/{slug}` | 否 | 按slug查询（SEO友好） |
| GET | `/categories` | 否 | 分类树 |
| POST | `/admin/products` | Admin | 创建商品 |
| PUT | `/admin/products/{id}` | Admin | 更新商品 |
| DELETE | `/admin/products/{id}` | Admin | 删除商品 |
| POST | `/admin/products/{id}/images` | Admin | 上传商品图片 |
| PUT | `/admin/products/skus/{skuId}` | Admin | 更新SKU库存/价格 |

### 3.3 购物车模块 `/api/cart`

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| GET | `/cart` | 否(session) | 获取购物车 |
| POST | `/cart/add` | 否(session) | 加入购物车，body: {skuId, quantity} |
| PUT | `/cart/items/{skuId}` | 否(session) | 修改数量 |
| DELETE | `/cart/items/{skuId}` | 否(session) | 删除商品 |
|