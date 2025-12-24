BEGIN;

ALTER TABLE com_product DROP CONSTRAINT com_product_group_fk;
ALTER TABLE com_product DROP COLUMN group_id;
DROP TABLE com_product_group;
COMMIT;
