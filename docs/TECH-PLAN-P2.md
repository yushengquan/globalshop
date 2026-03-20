# GlobalShop Phase 2 技术规划文档

**项目**: GlobalShop 外贸独立站  
**阶段**: Phase 2  
**Tech Lead**: AI Tech Lead  
**日期**: 2026-03-21  
**状态**: 待执行

---

## 一、数据库表结构

### 1. reviews 表（商品评价）

```sql
CREATE TABLE reviews (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL COMMENT '关联商品ID',
    user_id     BIGINT UNSIGNED NOT NULL COMMENT '评价用户ID',
    order_id    BIGINT UNSIGNED NOT NULL COMMENT '关联订单ID（防刷评）',
    rating      TINYINT NOT NULL DEFAULT 5 COMMENT '评分 1-5',
    title       VARCHAR(200) DEFAULT '' COMMENT '评价标题',
    content     TEXT COMMENT '评价正文',
    images      JSON COMMENT '评价图片URL数组',
    reply       TEXT COMMENT '商家回复',
    replied_at  DATETIME COMMENT '商家回复时间',
    status      TINYINT NOT NULL DEFAULT 0 COMMENT '0=待审核 1=已通过 2=已拒绝',
    is_verified TINYINT NOT NULL DEFAULT 0 COMMENT '是否购买认证',
    helpful_count INT UNSIGNED DEFAULT 0 COMMENT '有帮助票数',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES users(id),
    CONSTRAINT fk_review_order   FOREIGN KEY (order_id)   REFERENCES orders(id),
    CONSTRAINT uq_user_order UNIQUE (user_id, order_id, product_id) COMMENT '同一订单同一商品只能评价一次'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';
```

### 2. wishlists 表（收藏夹）

```sql
CREATE TABLE wishlists (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    product_id BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    CONSTRAINT fk_wishlist_user    FOREIGN KEY (user_id)    REFERENCES users(id),
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT uq_user_product UNIQUE (user_id, product_id) COMMENT '同一用户同一商品只能收藏一次'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏夹表';
```

---

## 二、新增 API 接口列表

### 评价模块

| 方法   | 路径                              | 描述               | 权限       |
|--------|-----------------------------------|--------------------|------------|
| POST   | /api/reviews                      | 提交商品评价       | 登录用户   |
| GET    | /api/products/{id}/reviews        | 获取商品评价列表   | 公开       |
| GET    | /api/reviews/{id}                 | 获取单条评价详情   | 公开       |
| PUT    | /api/admin/reviews/{id}/approve   | 审核通过评价       | 管理员     |
| PUT    | /api/admin/reviews/{id}/reject    | 审核拒绝评价       | 管理员     |
| POST   | /api/admin/reviews/{id}/reply     | 商家回复评价       | 管理员     |
| GET    | /api/admin/reviews                | 管理员评价列表     | 管理员     |

### 收藏夹模块

| 方法   | 路径                   | 描述             | 权限     |
|--------|------------------------|------------------|----------|
| POST   | /api/wishlist          | 添加收藏         | 登录用户 |
| DELETE | /api/wishlist/{id}     | 取消收藏（按ID） | 登录用户 |
| DELETE | /api/wishlist/product/{productId} | 取消收藏（按商品） | 登录用户 |
| GET    | /api/wishlist          | 获取收藏列表     | 登录用户 |

### 优惠码模块

| 方法   | 路径                    | 描述           | 权限     |
|--------|-------------------------|----------------|----------|
| POST   | /api/coupons/validate   | 验证优惠码     | 登录用户 |

**Request Body**:
```json
{
  "code": "SAVE10",
  "orderAmount": 99.99,
  "productIds": [1, 2, 3]
}
```

**Response**:
```json
{
  "valid": true,
  "discountType": "PERCENT",
  "discountValue": 10,
  "discountAmount": 9.99,
  "finalAmount": 90.00,
  "message": "Coupon applied successfully"
}
```

---

## 三、Agent 任务分配方案

---

### Agent A — 后端核心（Spring Boot）

**负责模块**: 评价 + 收藏夹 + 优惠码验证 + 数据库

#### 文件清单

```
shop-backend/
├── src/main/resources/db/
│   └── schema_phase2.sql                          # reviews + wishlists 建表脚本
│
├── src/main/java/com/globalshop/
│   ├── review/
│   │   ├── entity/Review.java                     # Review 实体（MyBatis-Plus）
│   │   ├── mapper/ReviewMapper.java               # Mapper 接口
│   │   ├── mapper/xml/ReviewMapper.xml            # 复杂查询 SQL
│   │   ├── dto/ReviewCreateDTO.java               # 提交评价请求体
│   │   ├── dto/ReviewResponseDTO.java             # 评价返回体
│   │   ├── service/ReviewService.java             # 接口
│   │   ├── service/impl/ReviewServiceImpl.java    # 实现：校验已购买/防重复/审核流
│   │   └── controller/ReviewController.java       # POST /api/reviews, GET /api/products/{id}/reviews
│   │
│   ├── wishlist/
│   │   ├── entity/Wishlist.java
│   │   ├── mapper/WishlistMapper.java
│   │   ├── dto/WishlistResponseDTO.java
│   │   ├── service/WishlistService.java
│   │   ├── service/impl/WishlistServiceImpl.java
│   │   └── controller/WishlistController.java     # POST/DELETE/GET /api/wishlist
│   │
│   ├── coupon/
│   │   ├── dto/CouponValidateRequestDTO.java
│   │   ├── dto/CouponValidateResponseDTO.java
│   │   └── controller/CouponController.java       # POST /api/coupons/validate
│   │
│   └── admin/review/
│       └── controller/AdminReviewController.java  # 管理员审核/回复接口
```

**关键实现要点**:
- `ReviewServiceImpl`: 提交前校验 `order_id` 属于当前用户且状态为已完成，防止刷评
- `WishlistServiceImpl`: 使用 `INSERT IGNORE` 或捕获唯一键冲突，幂等处理
- `CouponController`: 复用 Phase 1 的 `coupons` 表，新增 `validate` 端点，不修改已有逻辑
- 所有接口统一使用 `Result<T>` 包装返回

---

### Agent B — 后端邮件服务（Spring Boot）

**负责模块**: 订单邮件通知

#### 文件清单

```
shop-backend/
└── src/main/java/com/globalshop/
    └── email/
        ├── service/OrderEmailService.java              # 接口定义
        ├── service/impl/OrderEmailServiceImpl.java     # JavaMailSender 实现
        └── template/
            ├── order-confirmation.html                 # 订单确认邮件模板（Thymeleaf）
            └── shipping-notification.html              # 发货通知邮件模板（Thymeleaf）
```

**接口定义**:
```java
public interface OrderEmailService {
    void sendOrderConfirmation(Long orderId);   // 支付成功后触发
    void sendShippingNotification(Long orderId, String trackingNumber, String carrier);
}
```

**邮件模板变量**:
- `order-confirmation.html`: `#{customerName}`, `#{orderId}`, `#{orderItems}`, `#{totalAmount}`, `#{shippingAddress}`
- `shipping-notification.html`: `#{customerName}`, `#{orderId}`, `#{trackingNumber}`, `#{carrier}`, `#{trackingUrl}`

**触发时机**:
- 订单确认: 在 `PaymentService.handleStripeCallback()` 支付成功后异步调用
- 发货通知: 在管理后台填写运单号时触发（`ShippingController.updateTracking()`）

---

### Agent C — 买家端前端（Next.js 14）

**负责模块**: 评价区块 + 收藏夹页面 + 心愿单按钮 + 相关商品推荐

#### 文件清单

```
shop-frontend/
└── src/
    ├── components/
    │   ├── ProductReviews.tsx        # 商品详情页评价区块
    │   │                             #   - 评分分布条形图
    │   │                             #   - 评价列表（分页）
    │   │                             #   - 提交评价表单（登录态）
    │   │                             #   - 星级组件
    │   ├── WishlistButton.tsx        # 心愿单按钮（心形图标切换）
    │   │                             #   - 登录态：调用 POST/DELETE /api/wishlist
    │   │                             #   - 未登录：引导登录弹窗
    │   │                             #   - 乐观更新 UI
    │   └── RelatedProducts.tsx       # 相关商品推荐组件
    │                                 #   - 同分类商品横向滚动卡片
    │                                 #   - 调用 GET /api/products?categoryId=&exclude=
    │                                 #   - 最多展示 6 个
    │
    └── app/
        └── wishlist/
            └── page.tsx              # 收藏夹页面
                                      #   - SSR 需登录（redirect if !session）
                                      #   - 收藏列表展示（网格布局）
                                      #   - 一键加入购物车
                                      #   - 移除收藏
```

**组件集成点**:
- `ProductReviews.tsx` → 嵌入 `app/products/[id]/page.tsx` 商品详情页底部
- `WishlistButton.tsx` → 嵌入商品详情页和商品列表卡片
- `RelatedProducts.tsx` → 嵌入商品详情页，位于 `ProductReviews` 上方

**数据获取方式**:
- `ProductReviews`: 客户端 SWR，支持分页和新评价提交后刷新
- `wishlist/page.tsx`: 服务端 fetch（需 JWT cookie），SEO 不敏感
- `RelatedProducts`: 服务端 fetch，SSG 可缓存

---

### Agent D — 管理后台（React + Ant Design 5）

**负责模块**: 评价管理 + 物流批量填单

#### 文件清单

```
shop-admin/
└── src/
    └── pages/
        ├── Reviews/
        │   └── index.tsx             # 评价管理页面
        │                             #   - Table: 商品名/用户/评分/内容/状态/时间
        │                             #   - 筛选: 状态(待审核/已通过/已拒绝)/评分/时间范围
        │                             #   - 操作: 通过/拒绝/回复（Modal弹窗）
        │                             #   - 批量审核通过
        │                             #   - 评价内容展开/图片预览
        │
        └── Shipping/
            └── index.tsx             # 物流批量填单页面
                                      #   - Table: 订单号/买家/商品/金额/状态
                                      #   - 筛选: 状态=已支付待发货
                                      #   - 单行填单: 物流商下拉 + 运单号输入
                                      #   - 批量填单: 选中多行 → 统一填物流商 + 批量运单号
                                      #   - CSV 导入: 上传 tracking.csv（订单号,运单号,物流商）
                                      #   - 确认发货 → 触发邮件通知
```

**Reviews/index.tsx 状态机**:
```
PENDING(0) → APPROVED(1)
PENDING(0) → REJECTED(2)
```

**Shipping/index.tsx CSV格式**:
```csv
order_id,tracking_number,carrier
10001,YT2024032100001,YunExpress
10002,4PX2024032100002,4PX
```

---

## 四、数据库 DDL 文件

**文件路径**: `shop-backend/src/main/resources/db/schema_phase2.sql`

完整内容包含:
1. `reviews` 表 DDL（见第一节）
2. `wishlists` 表 DDL（见第一节）
3. 初始化数据（可选测试数据）

---

## 五、接口联调约定

### 统一响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": { /* 业务数据 */ }
}
```

### 评价提交 Request
```json
{
  "productId": 1,
  "orderId": 10001,
  "rating": 5,
  "title": "Great product!",
  "content": "My dog loves it, very durable.",
  "images": ["https://cdn.globalshop.com/reviews/img1.jpg"]
}
```

### 收藏夹 Request
```json
{ "productId": 1 }
```

---

## 六、开发优先级与依赖关系

```
[Agent A] schema_phase2.sql          ←── 所有模块前置依赖
[Agent A] Review 后端                ←── Agent C ProductReviews.tsx 依赖
[Agent A] Wishlist 后端              ←── Agent C WishlistButton + wishlist/page 依赖
[Agent A] Coupon validate 后端       ←── Phase 1 购物车已有优惠码入口
[Agent B] OrderEmailService          ←── Agent D Shipping 填单触发发货邮件
[Agent C] RelatedProducts.tsx        ←── 无后端新接口依赖，可独立开发
[Agent D] Reviews/index.tsx          ←── Agent A AdminReviewController 完成后联调
[Agent D] Shipping/index.tsx         ←── Agent B OrderEmailService 完成后联调
```

**建议执行顺序**:
1. Agent A 先执行 `schema_phase2.sql` + Review/Wishlist 后端
2. Agent B 并行开发 OrderEmailService
3. Agent C 可并行开发所有前端组件（Mock API 先行）
4. Agent D 待 A/B 完成后联调

---

## 七、测试要点

| 模块 | 关键测试场景 |
|------|--------------|
| 评价 | 未购买用户不能提交评价；同订单同商品不能重复评价；待审核评价不对外展示 |
| 收藏 | 重复收藏幂等处理（不报错）；取消收藏后再收藏正常 |
| 优惠码 | 过期码返回明确错误；满减门槛未达到时返回提示；已用完次数返回提示 |
| 邮件 | 确认邮件含正确订单信息；发货邮件含可点击17track链接；SMTP失败不影响主流程 |
| 物流批量 | CSV格式错误时逐行报错；批量发货后订单状态变更为SHIPPED |

---

[P2_TECHLEAD_DONE]