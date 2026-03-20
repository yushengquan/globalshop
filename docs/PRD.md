# GlobalShop 外贸独立站 PRD v1.0

**项目代号**: GlobalShop
**日期**: 2026-03-21
**定位**: 面向欧美买家的外贸电商独立站，Dropshipping 模式，主营宠物用品+家居装饰

## 技术栈
- 买家端: Next.js 14 (SSR/SSG, SEO友好)
- 管理后台: React 18 + Ant Design 5
- 后端: Spring Boot 3 + MySQL 8 + Redis
- 支付: Stripe + PayPal (Mock模式先行)
- 文件存储: MinIO
- 邮件: JavaMailSender (SMTP)
- 部署: Docker Compose

## Phase 1 MVP 功能清单

### 买家端 (shop-frontend)
- 首页: Banner + 热销商品 + 分类导航
- 商品列表页: 分类筛选/排序/分页
- 商品详情页: 多图/SKU选择/加入购物车
- 购物车: 增删改查/价格汇总/优惠码
- 结账流程: 地址填写/运费计算/Stripe支付
- 用户中心: 注册登录/订单历史/地址管理
- 搜索: 关键词搜索
- 合规页面: About/Contact/Shipping Policy/Return Policy/Privacy Policy

### 管理后台 (shop-admin)
- Dashboard: GMV/订单数/待处理/库存预警
- 商品管理: CRUD/SKU变体/图片上传/批量操作
- 订单管理: 列表/详情/状态流转/导出
- 库存管理: 库存预警/变更记录
- 物流管理: 填运单号/绑定物流商
- 基础设置: 店铺信息/货币/运费规则

### 后端 API (shop-backend)
- 认证模块: JWT登录/注册/刷新Token
- 商品模块: CRUD/SKU/分类/搜索
- 订单模块: 创建/支付回调/状态流转
- 购物车模块: Redis缓存
- 用户模块: 地址管理/订单历史
- 支付模块: Stripe集成(Mock先行)
- 邮件模块: 订单确认/发货通知
- 文件模块: MinIO图片上传

## 首批商品 15 SKU

### 宠物品类 (10)
1. 自动喂食器(APP控制) $49.99
2. 电动逗猫棒 $19.99
3. 宠物出行双肩包 $39.99
4. 狗狗雨衣(多色) $24.99
5. 硅胶洗澡刷 $14.99
6. 猫咪麻绳窝 $34.99
7. LED发光项圈 $19.99
8. 便携饮水器 $22.99
9. 宠物生日套装 $12.99
10. 洁牙磨牙玩具 $15.99

### 家居品类 (5)
1. 月亮星空投影灯 $29.99
2. 磁吸悬浮花盆 $44.99
3. 北欧桌面收纳架 $27.99
4. LED化妆镜灯 $35.99
5. 香薰蜡烛礼盒 $32.99

## 数据库核心表
- users / addresses / categories / products
- product_skus / product_images
- carts / orders / order_items
- payments / coupons / shipping_methods

## 核心 API
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/products
- GET  /api/products/{id}
- POST /api/cart/add
- GET  /api/cart
- POST /api/orders/create
- POST /api/payments/stripe/checkout
- GET  /api/orders/{id}
- GET  /api/users/me/orders

## 外贸特性
- 全英文界面
- USD 默认货币
- GDPR Cookie 提示
- 固定运费 / 满额免邮
- 17track 物流追踪
- Stripe Radar 防欺诈
