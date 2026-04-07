BEGIN;
ALTER TABLE com_company ADD COLUMN intra_vat_number VARCHAR(20);
COMMIT;
