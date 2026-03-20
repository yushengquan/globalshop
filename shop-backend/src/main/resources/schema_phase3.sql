USE globalshop;

CREATE TABLE IF NOT EXISTS refunds (
    id BIGINT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    reason VARCHAR(200),
    description TEXT,
    amount DECIMAL(10,2),
    status TINYINT DEFAULT 0,
    admin_note TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGINT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    cover_image VARCHAR(500),
    tags VARCHAR(500),
    status TINYINT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);

INSERT IGNORE INTO blog_posts VALUES
(1, '5 Tips for Choosing the Perfect Pet Bed', 'pet-bed-tips',
 'Help your furry friend sleep better with our expert guide.',
 '<p>Choosing the right pet bed is essential for your pet health and comfort...</p>',
 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
 'pets,tips,lifestyle', 1, 0, NOW(), NOW()),
(2, 'Top 10 Home Decor Trends 2024', 'home-decor-trends-2024',
 'Transform your living space with these stunning decor ideas.',
 '<p>Home decor trends are constantly evolving, and 2024 brings exciting new styles...</p>',
 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
 'home,decor,trends', 1, 0, NOW(), NOW()),
(3, 'How to Keep Your Pets Happy Indoors', 'keep-pets-happy-indoors',
 'Indoor enrichment activities to keep your pets stimulated and happy.',
 '<p>Keeping pets entertained indoors is crucial for their mental health...</p>',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
 'pets,indoor,health', 1, 0, NOW(), NOW());
