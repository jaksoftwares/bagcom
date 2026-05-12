-- Admin Governance and Platform Control Tables

-- 1. Audit Logs: Record all administrative actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL, -- e.g., 'APPROVE_SELLER', 'FORCE_RELEASE', 'UPDATE_SETTINGS'
    entity_type TEXT NOT NULL, -- e.g., 'USER', 'ORDER', 'SETTING'
    entity_id TEXT, -- ID of the affected record
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. System Settings: Global platform configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('maintenance_mode', 'false', 'Disable all marketplace actions'),
    ('commission_rate', '10', 'Platform commission percentage'),
    ('auto_release_days', '7', 'Days after delivery to auto-release escrow'),
    ('min_payout_amount', '100', 'Minimum amount for seller withdrawal')
ON CONFLICT (key) DO NOTHING;

-- 3. Support Tickets: User mediation and support
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    assigned_admin_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for Governance Tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage audit logs and system settings
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')));

CREATE POLICY "Admins can manage system settings" ON public.system_settings
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')));

-- Users can view their own tickets, admins can view all
CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')));

CREATE POLICY "Users can create own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);
