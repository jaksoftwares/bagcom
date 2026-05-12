-- Admin Messaging and Notifications Expansion

-- 1. Support Responses: Back-and-forth messaging for tickets
CREATE TABLE IF NOT EXISTS public.support_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- Internal notes for admins only
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Broadcast Notifications: Global admin announcements
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    target_role TEXT DEFAULT 'ALL', -- 'ALL', 'BUYER', 'SELLER'
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;

-- Support Responses: Users see public responses on their tickets, admins see all
CREATE POLICY "Users can view public responses on own tickets" ON public.support_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets t 
            WHERE t.id = ticket_id AND t.user_id = auth.uid()
        ) AND is_internal = FALSE
    );

CREATE POLICY "Admins can manage all responses" ON public.support_responses
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- Broadcast Notifications: Everyone can view active broadcasts, admins can manage
CREATE POLICY "Everyone can view broadcasts" ON public.broadcast_notifications
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage broadcasts" ON public.broadcast_notifications
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );
