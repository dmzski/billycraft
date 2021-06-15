CREATE TABLE com_product_keywords (
    product_id bigint not null,
    keyword varchar(255) not null
);

ALTER TABLE com_product ADD COLUMN name varchar(255) default '';
ALTER TABLE com_quote_line ADD COLUMN name varchar(255) default '';
ALTER TABLE com_bill_line ADD COLUMN name varchar(255) default '';