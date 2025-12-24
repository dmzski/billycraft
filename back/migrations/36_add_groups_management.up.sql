BEGIN;

CREATE TABLE com_product_group (
  id uuid DEFAULT uuid_generate_v4(),
  name varchar(255) not null,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
  created_by varchar(255),
  company_id uuid,
  CONSTRAINT com_product_group_pk PRIMARY KEY (id),
  CONSTRAINT com_product_group_company_fk FOREIGN KEY (company_id) REFERENCES com_company (id) ON DELETE SET NULL ON UPDATE CASCADE
);

ALTER TABLE com_product ADD COLUMN group_id uuid DEFAULT NULL;
ALTER TABLE com_product ADD CONSTRAINT com_product_group_fk FOREIGN KEY (group_id) REFERENCES com_product_group (id) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;
