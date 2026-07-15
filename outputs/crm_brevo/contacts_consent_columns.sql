-- ============================================================
-- CRM / Brevo groundwork: marketing-consent columns on contacts
-- Idempotent — safe to run more than once.
-- Run in Supabase SQL editor.
-- ============================================================

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_source    text,           -- 'footer' | 'quote' | 'order' | 'offline' | 'import'
  ADD COLUMN IF NOT EXISTS subscribed_at     timestamptz,    -- when they opted in
  ADD COLUMN IF NOT EXISTS unsubscribed_at   timestamptz,    -- when they opted out (null = still subscribed)
  ADD COLUMN IF NOT EXISTS brevo_synced_at   timestamptz;    -- last successful push to Brevo (null = never)

-- Fast lookup of "who should be in the Brevo marketing list right now"
CREATE INDEX IF NOT EXISTS idx_contacts_marketing_consent
  ON contacts (marketing_consent)
  WHERE marketing_consent = true;

-- Handy view: current marketing audience (consented + not unsubscribed)
CREATE OR REPLACE VIEW marketing_audience AS
SELECT c.id, c.email, c.first_name, c.phone, c.company_id, co.name AS company_name,
       c.consent_source, c.subscribed_at, c.brevo_synced_at
FROM contacts c
LEFT JOIN companies co ON co.id = c.company_id
WHERE c.marketing_consent = true
  AND c.unsubscribed_at IS NULL
  AND c.email IS NOT NULL;
