CREATE TABLE com_bill_email_customization (
    id serial not null,
    body text default null,
    object text default null,
    company_id bigint not null,
    CONSTRAINT com_bill_email_customization_pk PRIMARY KEY (id),
    CONSTRAINT com_bill_email_customization_company_id FOREIGN KEY (company_id) REFERENCES com_company(id)
);

CREATE TABLE com_quote_email_customization (
    id serial not null,
    body text default null,
    object text default null,
    company_id bigint not null,
    CONSTRAINT com_quote_email_customization_pk PRIMARY KEY (id),
    CONSTRAINT com_quote_email_customization_company_id FOREIGN KEY (company_id) REFERENCES com_company(id)
);