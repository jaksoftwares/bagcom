-- ==========================================
-- BAGCOM ULTIMATE MARKETPLACE SEED (IDEMPOTENT & COMPLIANT)
-- 15+ Products | 10 Categories | 5 Sellers
-- Handles duplicates and cross-schema standards.
-- ==========================================

DO $$ 
DECLARE 
    -- User IDs
    v_seller_1_id UUID;
    v_seller_2_id UUID;
    v_seller_3_id UUID;
    v_seller_4_id UUID;
    v_seller_5_id UUID;
    
    -- Category IDs
    v_cat_furniture UUID;
    v_cat_electronics UUID;
    v_cat_kitchen UUID;
    v_cat_fashion UUID;
    v_cat_books UUID;
    v_cat_sports UUID;
    v_cat_transport UUID;
    v_cat_personal UUID;
    v_cat_hobbies UUID;
    v_cat_jobs UUID;

    -- Location IDs
    v_loc_jkuat UUID;
    v_loc_uon UUID;
    v_loc_mombasa UUID;
    v_loc_eldoret UUID;
    
    -- Temp
    v_product_id UUID;
BEGIN
    -- 0. CLEANUP (Optional but ensures a fresh start for the Ultimate Seed)
    -- Uncomment the line below if you want to wipe everything first
    -- TRUNCATE public.products, public.categories, public.locations, public.users, public.product_images CASCADE;

    -- 1. SEED CATEGORIES (Using ON CONFLICT to avoid duplicate errors)
    INSERT INTO public.categories (name, slug, icon) VALUES ('Furniture & Home', 'furniture', 'Bed') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_furniture;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Electronics & Tech', 'electronics', 'Smartphone') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_electronics;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Kitchen & Appliances', 'kitchen', 'ChefHat') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_kitchen;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Fashion & Apparel', 'clothing', 'Shirt') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_fashion;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Books & Learning', 'books', 'BookOpen') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_books;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Sports & Outdoor', 'sports', 'Dumbbell') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_sports;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Transport & Bikes', 'transport', 'Bike') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_transport;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Beauty & Health', 'personal-care', 'Sparkles') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_personal;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Hobbies & Leisure', 'hobbies', 'Camera') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_hobbies;
    
    INSERT INTO public.categories (name, slug, icon) VALUES ('Jobs & Services', 'jobs', 'Briefcase') 
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon RETURNING id INTO v_cat_jobs;

    -- 2. SEED LOCATIONS
    INSERT INTO public.locations (county, city, institution_name, formatted_address) VALUES ('Kiambu', 'Juja', 'JKUAT', 'Main Campus') RETURNING id INTO v_loc_jkuat;
    INSERT INTO public.locations (county, city, institution_name, formatted_address) VALUES ('Nairobi', 'Nairobi', 'UoN', 'Main Campus') RETURNING id INTO v_loc_uon;
    INSERT INTO public.locations (county, city, institution_name, formatted_address) VALUES ('Mombasa', 'Mombasa', 'TUM', 'Main Campus') RETURNING id INTO v_loc_mombasa;
    INSERT INTO public.locations (county, city, institution_name, formatted_address) VALUES ('Uasin Gishu', 'Eldoret', 'Moi University', 'Main Campus') RETURNING id INTO v_loc_eldoret;

    -- 3. SEED 5 SELLERS (Auth-Compliant & Idempotent)
    
    -- Seller 1: John Kiprotich
    SELECT id INTO v_seller_1_id FROM public.users WHERE email = 'john@bagcom.co.ke';
    IF v_seller_1_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'john@bagcom.co.ke', crypt('Bagcom123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"John","last_name":"Kiprotich"}', now(), now(), '', '', '', '') RETURNING id INTO v_seller_1_id;
        INSERT INTO public.users (id, email, first_name, last_name, role, is_active) VALUES (v_seller_1_id, 'john@bagcom.co.ke', 'John', 'Kiprotich', 'SELLER', true);
    END IF;

    -- Seller 2: Mary Wanjiku
    SELECT id INTO v_seller_2_id FROM public.users WHERE email = 'mary@bagcom.co.ke';
    IF v_seller_2_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'mary@bagcom.co.ke', crypt('Bagcom123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Mary","last_name":"Wanjiku"}', now(), now(), '', '', '', '') RETURNING id INTO v_seller_2_id;
        INSERT INTO public.users (id, email, first_name, last_name, role, is_active) VALUES (v_seller_2_id, 'mary@bagcom.co.ke', 'Mary', 'Wanjiku', 'SELLER', true);
    END IF;

    -- Seller 3: David Mwangi
    SELECT id INTO v_seller_3_id FROM public.users WHERE email = 'david@bagcom.co.ke';
    IF v_seller_3_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'david@bagcom.co.ke', crypt('Bagcom123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"David","last_name":"Mwangi"}', now(), now(), '', '', '', '') RETURNING id INTO v_seller_3_id;
        INSERT INTO public.users (id, email, first_name, last_name, role, is_active) VALUES (v_seller_3_id, 'david@bagcom.co.ke', 'David', 'Mwangi', 'SELLER', true);
    END IF;

    -- Seller 4: Grace Akinyi
    SELECT id INTO v_seller_4_id FROM public.users WHERE email = 'grace@bagcom.co.ke';
    IF v_seller_4_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'grace@bagcom.co.ke', crypt('Bagcom123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Grace","last_name":"Akinyi"}', now(), now(), '', '', '', '') RETURNING id INTO v_seller_4_id;
        INSERT INTO public.users (id, email, first_name, last_name, role, is_active) VALUES (v_seller_4_id, 'grace@bagcom.co.ke', 'Grace', 'Akinyi', 'SELLER', true);
    END IF;

    -- Seller 5: Peter Ochieng
    SELECT id INTO v_seller_5_id FROM public.users WHERE email = 'peter@bagcom.co.ke';
    IF v_seller_5_id IS NULL THEN
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'peter@bagcom.co.ke', crypt('Bagcom123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Peter","last_name":"Ochieng"}', now(), now(), '', '', '', '') RETURNING id INTO v_seller_5_id;
        INSERT INTO public.users (id, email, first_name, last_name, role, is_active) VALUES (v_seller_5_id, 'peter@bagcom.co.ke', 'Peter', 'Ochieng', 'SELLER', true);
    END IF;

    -- 4. SEED 15+ PRODUCTS

    -- P1: Study Desk
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_1_id, v_cat_furniture, v_loc_jkuat, 'Study Desk with Ergonomic Chair', 'study-desk-ergonomic', 'Perfect study setup for engineering students.', 8500, true, 'GOOD', 'AVAILABLE', 'ACTIVE') 
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg', 1);
    END IF;

    -- P2: MacBook Pro
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_3_id, v_cat_electronics, v_loc_uon, 'MacBook Pro 2020 (M1 Chip)', 'macbook-pro-2020-m1', '8GB RAM, 256GB SSD, Retina Display.', 85000, true, 'LIKE_NEW', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg', 1);
    END IF;

    -- P3: Gas Cylinder
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_2_id, v_cat_kitchen, v_loc_jkuat, 'Gas Cylinder (13kg) with Burner', 'gas-cylinder-13kg', 'Full cylinder with 2-burner cooker.', 4200, false, 'NEW', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg', 1);
    END IF;

    -- P4: Giant Mountain Bike
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_2_id, v_cat_transport, v_loc_mombasa, 'Giant Mountain Bike (21 Speed)', 'giant-mountain-bike', 'Excellent for campus commuting.', 12500, true, 'GOOD', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg', 1);
    END IF;

    -- P5: iPhone 12
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_4_id, v_cat_electronics, v_loc_eldoret, 'iPhone 12 (64GB, Blue)', 'iphone-12-blue', 'Clean phone, 88% battery health.', 42000, true, 'GOOD', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/8059227/pexels-photo-8059227.jpeg', 1);
    END IF;

    -- P6: Samsung Microwave
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_4_id, v_cat_kitchen, v_loc_jkuat, 'Samsung Microwave Oven (23L)', 'samsung-microwave-23l', 'Barely used, digital display.', 6800, true, 'LIKE_NEW', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg', 1);
    END IF;

    -- P7: Engineering Textbooks
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_5_id, v_cat_books, v_loc_uon, 'Engineering Textbooks Collection', 'engineering-books', 'Complete set for 2nd & 3rd year.', 3500, true, 'GOOD', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg', 1);
    END IF;

    -- P8: Adidas Football
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_5_id, v_cat_sports, v_loc_eldoret, 'Adidas Official Match Ball', 'adidas-match-ball', 'Quality football for campus sports.', 2500, false, 'NEW', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg', 1);
    END IF;

    -- P11: Hair Dryer
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_4_id, v_cat_personal, v_loc_eldoret, 'Professional Ionic Hair Dryer', 'ionic-hair-dryer', 'High power, heat settings.', 2200, false, 'GOOD', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg', 1);
    END IF;

    -- P12: Revolving Chair
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_1_id, v_cat_furniture, v_loc_jkuat, 'Revolving Office Chair', 'revolving-office-chair', 'Breathable mesh back, adjustable.', 5500, true, 'GOOD', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/631411/pexels-photo-631411.jpeg', 1);
    END IF;

    -- P13: Motorbike Helmet
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_2_id, v_cat_transport, v_loc_mombasa, 'Full-Face Safety Helmet', 'safety-helmet-xl', 'Ece certified, matte black.', 3500, true, 'LIKE_NEW', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg', 1);
    END IF;

    -- P14: Fiction Books
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_5_id, v_cat_books, v_loc_uon, 'Best Selling Novels Bundle', 'novels-bundle', 'Includes 5 thriller novels.', 1500, false, 'GOOD', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg', 1);
    END IF;

    -- P15: Math Tutoring
    INSERT INTO public.products (seller_id, category_id, location_id, title, slug, description, price, negotiable, condition, availability, status)
    VALUES (v_seller_3_id, v_cat_jobs, v_loc_jkuat, 'Calculus & Algebra Tutoring', 'math-tutoring-service', 'Help with engineering math units.', 1000, true, 'NEW', 'AVAILABLE', 'ACTIVE')
    ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_product_id;
    IF v_product_id IS NOT NULL THEN
        INSERT INTO public.product_images (product_id, image_url, display_order) VALUES (v_product_id, 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg', 1);
    END IF;

    RAISE NOTICE 'Idempotent Seed Completed Successfully!';
END $$;
