CREATE TABLE com_outgoing (
    id uuid not null DEFAULT uuid_generate_v4(),
    name VARCHAR(255) not null,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100) not null,
    company_id BIGINT not null,
    CONSTRAINT com_outgoing_pk PRIMARY KEY (id),
    CONSTRAINT com_outgoing_company_id_fk FOREIGN KEY (company_id) REFERENCES com_company(id),
    CONSTRAINT com_outgoing_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user(email)
);
CREATE TABLE com_outgoing_lines (
    outgoing_id uuid not null,
    line int not null,
    supplier_id bigint,
    bill_id varchar(100),
    supplier_bill_reference VARCHAR(100),
    total_ht DECIMAL not null,
    vat int not null,
    CONSTRAINT com_outgoing_lines_pk PRIMARY KEY (outgoing_id, line),
    CONSTRAINT com_outgoing_lines_outgoing_id_fk FOREIGN KEY (outgoing_id) REFERENCES com_outgoing(id),
    CONSTRAINT com_outgoing_lines_supplier_id_fk FOREIGN KEY (supplier_id) REFERENCES com_supplier(id),
    CONSTRAINT com_outgoing_lines_bill_id_fk FOREIGN KEY (bill_id) REFERENCES com_bill(id)
);