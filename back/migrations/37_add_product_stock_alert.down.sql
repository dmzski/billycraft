BEGIN;
ALTER TABLE com_product DROP COLUMN low_stock;
ALTER TABLE com_product DROP COLUMN no_stock_alert;
COMMIT;
