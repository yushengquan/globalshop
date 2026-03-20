USE globalshop;

-- Categories
INSERT IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
(1000000000000001, 'Pet Supplies', 'pet-supplies', 'Everything your pets need', 1),
(1000000000000002, 'Home Decor', 'home-decor', 'Beautiful home decoration', 2),
(1000000000000003, 'Outdoor & Camping', 'outdoor-camping', 'Adventure gear for outdoors', 3),
(1000000000000004, 'Electronics', 'electronics', 'Smart gadgets and accessories', 4);

-- Admin user (password: admin123)
INSERT IGNORE INTO users (id, email, password, first_name, last_name, role, status, created_at, updated_at, deleted) VALUES
(1000000000000001, 'admin@globalshop.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Admin', 'User', 'ADMIN', 'ACTIVE', NOW(), NOW(), 0);

-- Sample products
INSERT IGNORE INTO products (id, category_id, name, slug, short_description, price, compare_price, stock, main_image, featured, status, sold_count, created_at, updated_at, deleted) VALUES
(1000000000000001, 1000000000000001, 'Smart Automatic Pet Feeder', 'smart-auto-pet-feeder', 'WiFi-enabled automatic pet feeder with app control, 6L capacity', 49.99, 79.99, 100, 'https://picsum.photos/seed/pet1/600/600', 1, 'ACTIVE', 156, NOW(), NOW(), 0),
(1000000000000002, 1000000000000001, 'Electric Interactive Cat Toy', 'electric-cat-toy', 'Automatic rotating feather wand to keep cats entertained', 19.99, 29.99, 200, 'https://picsum.photos/seed/pet2/600/600', 1, 'ACTIVE', 89, NOW(), NOW(), 0),
(1000000000000003, 1000000000000001, 'Pet Travel Backpack Carrier', 'pet-travel-backpack', 'Transparent window backpack for cats and small dogs', 39.99, 59.99, 80, 'https://picsum.photos/seed/pet3/600/600', 1, 'ACTIVE', 234, NOW(), NOW(), 0),
(1000000000000004, 1000000000000001, 'Dog Raincoat Waterproof Jacket', 'dog-raincoat', 'Lightweight waterproof jacket for dogs, multiple sizes', 24.99, 34.99, 150, 'https://picsum.photos/seed/pet4/600/600', 0, 'ACTIVE', 67, NOW(), NOW(), 0),
(1000000000000005, 1000000000000001, 'Silicone Pet Bath Brush', 'silicone-pet-brush', 'Soft silicone massage brush for bathing pets', 14.99, 19.99, 300, 'https://picsum.photos/seed/pet5/600/600', 0, 'ACTIVE', 445, NOW(), NOW(), 0),
(1000000000000006, 1000000000000001, 'LED Glowing Pet Collar', 'led-pet-collar', 'Rechargeable LED safety collar for night walks', 19.99, 29.99, 120, 'https://picsum.photos/seed/pet6/600/600', 0, 'ACTIVE', 178, NOW(), NOW(), 0),
(1000000000000007, 1000000000000001, 'Portable Pet Water Bottle', 'portable-pet-water', 'Leak-proof portable water dispenser for walks', 22.99, 32.99, 90, 'https://picsum.photos/seed/pet7/600/600', 0, 'ACTIVE', 312, NOW(), NOW(), 0),
(1000000000000008, 1000000000000002, 'Moon Star Projector Night Light', 'moon-star-projector', 'Rotating galaxy projector with 8 lighting modes', 29.99, 49.99, 200, 'https://picsum.photos/seed/home1/600/600', 1, 'ACTIVE', 567, NOW(), NOW(), 0),
(1000000000000009, 1000000000000002, 'Magnetic Levitating Plant Pot', 'magnetic-levitating-pot', 'Self-rotating magnetic levitation flower pot', 44.99, 69.99, 50, 'https://picsum.photos/seed/home2/600/600', 1, 'ACTIVE', 89, NOW(), NOW(), 0),
(1000000000000010, 1000000000000002, 'Nordic Desk Organizer Set', 'nordic-desk-organizer', 'Minimalist bamboo desk organizer with multiple compartments', 27.99, 39.99, 150, 'https://picsum.photos/seed/home3/600/600', 1, 'ACTIVE', 234, NOW(), NOW(), 0);

-- Sample coupons
INSERT IGNORE INTO coupons (id, code, type, value, min_amount, usage_limit, enabled, created_at) VALUES
(1000000000000001, 'WELCOME10', 'PERCENTAGE', 10.00, 20.00, 1000, 1, NOW()),
(1000000000000002, 'SAVE5', 'FIXED', 5.00, 30.00, 500, 1, NOW());

-- Shipping methods
INSERT IGNORE INTO shipping_methods (id, name, description, price, min_days, max_days, enabled) VALUES
(1000000000000001, 'Standard Shipping', 'Delivered in 7-15 business days', 9.99, 7, 15, 1),
(1000000000000002, 'Express Shipping', 'Delivered in 3-7 business days', 19.99, 3, 7, 1),
(1000000000000003, 'Free Shipping', 'Free for orders over $50', 0.00, 10, 20, 1);
