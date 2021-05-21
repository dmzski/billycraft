
CREATE SEQUENCE com_product_id_seq;
CREATE TABLE com_product (
  id bigint not null default nextval('com_product_id_seq'),
  description varchar(255),
  price numeric,
  company_id bigint not null,
  version integer,
  created_at timestamp default CURRENT_TIMESTAMP,
  updated_at timestamp,
  created_by varchar(100),
  CONSTRAINT com_product_pk PRIMARY KEY (id),
  CONSTRAINT com_product_company_id FOREIGN KEY (company_id) REFERENCES com_company (id)
);

ALTER SEQUENCE com_product_id_seq OWNED BY com_product.id;