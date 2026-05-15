-- M-Pesa Account Status tracking
CREATE TABLE IF NOT EXISTS public.mpesa_account_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shortcode VARCHAR NOT NULL,
    account_type VARCHAR NOT NULL, -- 'Utility', 'Working', 'MMF'
    balance DECIMAL DEFAULT 0,
    currency VARCHAR DEFAULT 'KES',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    raw_response JSONB
);

-- Ensure only admins can read this
ALTER TABLE public.mpesa_account_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage mpesa account status" ON public.mpesa_account_status
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );
