BEGIN;
ALTER TABLE com_product ADD COLUMN stock DECIMAL DEFAULT NULL;
-- QRcode can be up to 7100 characters and barcode is only 44 characters
ALTER TABLE com_product ADD COLUMN code  VARCHAR(10000) DEFAULT NULL;
COMMIT;
