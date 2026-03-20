USE globalshop;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(100),
    rating TINYINT NOT NULL DEFAULT 5,
    title VARCHAR(200),
    content TEXT,
    reply TEXT,
    status TINYINT DEFAULT 1,
    created_at DATETIME,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME,
    UNIQUE KEY uk_user_product (user_id, product_id)
);
