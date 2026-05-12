-- ==========================================
-- BAGCOM CATEGORY HIERARCHY & PRODUCT UPDATE
-- Implements Subcategories & Real-World Mapping
-- Run this in Supabase SQL Editor
-- ==========================================

DO $$ 
DECLARE 
    -- Parent Category IDs
    v_cat_electronics UUID;
    v_cat_furniture UUID;
    v_cat_kitchen UUID;
    v_cat_fashion UUID;
    v_cat_books UUID;
    
    -- Subcategory IDs
    v_sub_laptops UUID;
    v_sub_smartphones UUID;
    v_sub_desks UUID;
    v_sub_beds UUID;
    v_sub_gas UUID;
    v_sub_appliances UUID;
    v_sub_clothing UUID;
    v_sub_textbooks UUID;
BEGIN
    -- 1. IDENTIFY PARENT CATEGORIES (Using slugs for reliability)
    SELECT id INTO v_cat_electronics FROM public.categories WHERE slug = 'electronics';
    SELECT id INTO v_cat_furniture FROM public.categories WHERE slug = 'furniture';
    SELECT id INTO v_cat_kitchen FROM public.categories WHERE slug = 'kitchen';
    SELECT id INTO v_cat_fashion FROM public.categories WHERE slug = 'clothing';
    SELECT id INTO v_cat_books FROM public.categories WHERE slug = 'books';

    -- 2. CREATE/UPDATE SUBCATEGORIES (Idempotent)
    -- Electronics Subcategories
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Laptops & PCs', 'laptops', 'Laptop', v_cat_electronics) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_laptops;
    
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Smartphones & Tablets', 'smartphones', 'Smartphone', v_cat_electronics) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_smartphones;

    -- Furniture Subcategories
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Study & Office', 'study-furniture', 'PenTool', v_cat_furniture) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_desks;
    
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Bedroom Furniture', 'bedroom-furniture', 'Bed', v_cat_furniture) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_beds;

    -- Kitchen Subcategories
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Gas & Cooking', 'gas-cooking', 'Flame', v_cat_kitchen) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_gas;
    
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Kitchen Appliances', 'kitchen-appliances', 'Box', v_cat_kitchen) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_appliances;

    -- Fashion Subcategories
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Casual Wear', 'casual-wear', 'Shirt', v_cat_fashion) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_clothing;

    -- Books Subcategories
    INSERT INTO public.categories (name, slug, icon, parent_id) 
    VALUES ('Academic Textbooks', 'academic-books', 'Book', v_cat_books) 
    ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id RETURNING id INTO v_sub_textbooks;

    -- 3. REMAP EXISTING PRODUCTS TO SUBCATEGORIES
    -- Remap MacBook Pro to Laptops
    UPDATE public.products SET category_id = v_sub_laptops WHERE slug = 'macbook-pro-2020-m1';
    
    -- Remap iPhone to Smartphones
    UPDATE public.products SET category_id = v_sub_smartphones WHERE slug = 'iphone-12-blue';
    
    -- Remap Study Desk to Study Furniture
    UPDATE public.products SET category_id = v_sub_desks WHERE slug = 'study-desk-ergonomic';
    
    -- Remap Queen Bed to Bedroom Furniture
    UPDATE public.products SET category_id = v_sub_beds WHERE slug = 'queen-size-bed-mattress';
    
    -- Remap Gas Cylinder to Gas & Cooking
    UPDATE public.products SET category_id = v_sub_gas WHERE slug = 'gas-cylinder-13kg';
    
    -- Remap Microwave to Kitchen Appliances
    UPDATE public.products SET category_id = v_sub_appliances WHERE slug = 'samsung-microwave-23l';
    
    -- Remap Engineering Books to Academic Textbooks
    UPDATE public.products SET category_id = v_sub_textbooks WHERE slug = 'engineering-books';

    RAISE NOTICE 'Hierarchy Update Successful: 8 Subcategories created and products remapped.';
END $$;
