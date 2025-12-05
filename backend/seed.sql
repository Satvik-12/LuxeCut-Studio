USE luxecut;

-- Seed Admin User (password: Admin123!)
-- Hash generated using bcrypt
INSERT INTO admin_users (email, password_hash) VALUES 
('admin@luxecut.com', '$2b$12$KJjJRhhtu7f4uQ4zJ9BmCufJXAaLNzIW357T8HOyEeKApi2Igpyqu');

-- Seed Services
INSERT INTO services (name, description, duration_minutes, price) VALUES 
('Haircut - Men', 'Standard men''s haircut', 30, 500.00),
('Haircut - Women', 'Standard women''s haircut', 60, 1200.00),
('Facial', 'Rejuvenating facial', 45, 1500.00),
('Hair Spa', 'Deep conditioning', 60, 2000.00);

-- Seed Stylists
INSERT INTO stylists (name, specialties) VALUES 
('Alice', 'Haircuts, Coloring'),
('Bob', 'Men''s Cuts, Beard'),
('Charlie', 'Facials, Spa');
