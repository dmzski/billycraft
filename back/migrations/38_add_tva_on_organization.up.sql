BEGIN;
ALTER TABLE com_company ADD COLUMN vat_percent decimal DEFAULT 0;
COMMIT;
