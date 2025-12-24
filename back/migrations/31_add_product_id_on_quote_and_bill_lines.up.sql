BEGIN;

ALTER TABLE com_bill_line ADD COLUMN product_id uuid DEFAULT NULL;
ALTER TABLE com_bill_line ADD CONSTRAINT com_bill_line_product_fk FOREIGN KEY (product_id) REFERENCES com_product (id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE com_quote_line ADD COLUMN product_id uuid DEFAULT NULL;
ALTER TABLE com_quote_line ADD CONSTRAINT com_quote_line_product_fk FOREIGN KEY (product_id) REFERENCES com_product (id) ON UPDATE CASCADE ON DELETE SET NULL;

COMMIT;
