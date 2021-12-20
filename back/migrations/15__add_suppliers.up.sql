CREATE TABLE com_supplier (
    id serial not null,
    name VARCHAR(255) not null,
    color VARCHAR(12),
    company_id BIGINT not null,
    created_by VARCHAR(100) not null,
    deleted_at TIMESTAMP,
    CONSTRAINT com_supplier_pk PRIMARY KEY (id),
    CONSTRAINT com_supplier_company_id_fk FOREIGN KEY (company_id) REFERENCES com_company(id),
    CONSTRAINT com_supplier_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user(email)
);