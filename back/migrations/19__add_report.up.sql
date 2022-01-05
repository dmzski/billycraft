CREATE TABLE com_report (
    id uuid not null default uuid_generate_v4(),
    name VARCHAR(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    article_sales decimal,
    service_sales decimal,
    other_sales decimal,
    article_taxes decimal,
    service_taxes decimal,
    other_taxes decimal,
    outgoings decimal,
    company_id bigint,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    CONSTRAINT com_report_pk PRIMARY KEY (id),
    CONSTRAINT com_report_company_id_fk FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE
    SET NULL,
        CONSTRAINT com_report_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user(email) ON DELETE
    SET NULL
);
CREATE TABLE com_report_bills (
    report_id uuid not null,
    bill_id VARCHAR(255) not null,
    CONSTRAINT com_report_bills_pk PRIMARY KEY (report_id, bill_id),
    CONSTRAINT com_report_bills_report_id_fk FOREIGN KEY (report_id) REFERENCES com_report(id) ON DELETE CASCADE,
    CONSTRAINT com_report_bills_bill_id_fk FOREIGN KEY (bill_id) REFERENCES com_bill(id) ON DELETE CASCADE
);
CREATE TABLE com_report_outgoings (
    report_id uuid not null,
    outgoing_id uuid not null,
    CONSTRAINT com_report_outgoings_pk PRIMARY KEY (report_id, outgoing_id),
    CONSTRAINT com_report_outgoings_report_id_fk FOREIGN KEY (report_id) REFERENCES com_report(id) ON DELETE CASCADE,
    CONSTRAINT com_report_outgoings_outgoing_id_fk FOREIGN KEY (outgoing_id) REFERENCES com_outgoing(id) ON DELETE CASCADE
);