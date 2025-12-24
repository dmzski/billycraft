ALTER TABLE com_product ADD COLUMN supplier_id uuid DEFAULT NULL;
ALTER TABLE com_product ADD CONSTRAINT com_product_supplier_fk FOREIGN KEY (supplier_id) REFERENCES com_supplier(id) ON UPDATE CASCADE ON DELETE SET NULL;
