CREATE DATABASE IF NOT EXISTS globalshop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE globalshop;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME,
    updated_at DATETIME,
    deleted TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY,
    category_id BIGINT,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500),
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    stock INT DEFAULT 0,
    main_image VARCHAR(500),
    images TEXT,
    tags VARCHAR(500),
    featured TINYINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    sold_count INT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE,
    user_id BIGINT,
    status VARCHAR(30) DEFAULT 'PENDING',
    subtotal DECIMAL(10,2),
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    shipping_name VARCHAR(200),
    shipping_email VARCHAR(200),
    shipping_phone VARCHAR(50),
    shipping_address VARCHAR(500),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_country VARCHAR(100),
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(50),
    coupon_code VARCHAR(50),
    payment_method VARCHAR(50),
    payment_id VARCHAR(200),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(500),
    product_image VARCHAR(500),
    sku_info VARCHAR(200),
    price DECIMAL(10,2),
    quantity INT,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20),
    value DECIMAL(10,2),
    min_amount DECIMAL(10,2) DEFAULT 0,
    usage_limit INT,
    used_count INT DEFAULT 0,
    enabled TINYINT DEFAULT 1,
    expires_at DATETIME,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS shipping_methods (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(200),
    price DECIMAL(10,2),
    min_days INT,
    max_days INT,
    enabled TINYINT DEFAULT 1
);
