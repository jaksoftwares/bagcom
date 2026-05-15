-- Migration to support M-Pesa B2C v3
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS conversation_id VARCHAR;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS originator_conversation_id VARCHAR;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS response_code VARCHAR;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS response_description TEXT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS raw_callback JSONB;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS callback_payload JSONB;
