-- EXPANDED SYSTEM SETTINGS REGISTRY
-- Adds comprehensive configuration keys for all platform modules

INSERT INTO public.system_settings (key, value, description)
VALUES 
    -- 1. Financial Brackets
    ('commission_silver', '8', 'Silver tier commission (%)'),
    ('commission_gold', '5', 'Gold tier commission (%)'),
    ('onboarding_fee', '0', 'One-time seller onboarding fee (KSh)'),
    
    -- 2. Catalog & Inventory
    ('max_images_per_product', '5', 'Maximum images allowed per listing'),
    ('require_product_approval', 'false', 'Force manual audit of new products'),
    ('prohibited_keywords', 'illegal,weapon,drug', 'Comma-separated forbidden terms'),
    
    -- 3. Support & Fulfillment
    ('support_email', 'ops@bagcom.com', 'Primary operational support email'),
    ('support_phone', '+254700000000', 'Emergency platform hotline'),
    ('dispute_grace_days', '3', 'Days for seller response before auto-refund'),
    ('max_active_tickets', '5', 'Max open tickets per user'),
    
    -- 4. Communication & Identity
    ('enable_sms_alerts', 'true', 'Global SMS gateway toggle'),
    ('enable_email_alerts', 'true', 'Global Email gateway toggle'),
    ('sender_id', 'BAGCOM', 'SMS Sender Identification'),
    ('google_analytics_id', '', 'Tracking ID for platform analytics')
ON CONFLICT (key) DO NOTHING;
