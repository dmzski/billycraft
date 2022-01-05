DROP TABLE IF EXISTS com_report_outgoings;
DROP TABLE IF EXISTS com_report_bills;
CREATE TABLE com_report_outgoing (
    id uuid not null DEFAULT uuid_generate_v4(),
    outgoing_id uuid not null,
    report_id uuid not null,
    name VARCHAR(255) not null,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by VARCHAR(100) not null,
    CONSTRAINT com_report_outgoing_pk PRIMARY KEY (id),
    CONSTRAINT com_report_outgoing_report_id_fk FOREIGN KEY (report_id) REFERENCES com_report(id) ON DELETE CASCADE
);
CREATE TABLE com_report_outgoing_lines (
    report_outgoing_id uuid not null,
    line int not null,
    supplier_id bigint,
    bill_id varchar(100),
    supplier_bill_reference VARCHAR(100),
    total_ht DECIMAL not null,
    vat int not null default 0,
    CONSTRAINT com_report_outgoing_lines_pk PRIMARY KEY (report_outgoing_id, line),
    CONSTRAINT com_report_outgoing_lines_report_outgoing_id_fk FOREIGN KEY (report_outgoing_id) REFERENCES com_report_outgoing(id),
    CONSTRAINT com_report_outgoing_lines_supplier_id_fk FOREIGN KEY (supplier_id) REFERENCES com_supplier(id)
);
CREATE TABLE com_report_bill (
    id uuid not null DEFAULT uuid_generate_v4(),
    bill_id varchar(100),
    customer_id bigint,
    title varchar(255),
    tva integer,
    sent_at timestamp,
    paid_at timestamp,
    article_sales decimal,
    service_sales decimal,
    other_sales decimal,
    article_taxes decimal,
    service_taxes decimal,
    other_taxes decimal,
    outgoings decimal,
    created_by VARCHAR(100) not null,
    report_id uuid not null,
    CONSTRAINT com_report_bills_pk PRIMARY KEY (id),
    CONSTRAINT com_report_bills_report_id_fk FOREIGN KEY (report_id) REFERENCES com_report(id) ON DELETE CASCADE
);