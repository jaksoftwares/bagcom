-- Add INSERT policy for users to reply to their own tickets

CREATE POLICY "Users can insert responses on own tickets" ON public.support_responses
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        is_internal = FALSE AND
        EXISTS (
            SELECT 1 FROM public.support_tickets t 
            WHERE t.id = ticket_id AND t.user_id = auth.uid()
        )
    );
