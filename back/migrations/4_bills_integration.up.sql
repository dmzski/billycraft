ALTER TABLE com_quote_line ADD COLUMN type varchar(100);

DROP TABLE IF EXISTS com_bill;
CREATE TABLE com_bill
(
    id          varchar(100),
    title       varchar(150),
    status      varchar(50)        default 'DRAFT',
    customer_id bigint,
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  timestamp,
    version     integer            default 0,
    company_id  bigint,
    tva         integer,
    created_by  varchar(100),
    sent_at timestamp,
    file_name varchar(255),
    quote_id    varchar(255),
    CONSTRAINT com_bill_pk PRIMARY KEY (id),
    CONSTRAINT com_bill_customer_fk FOREIGN KEY (customer_id) REFERENCES com_customer (id),
    CONSTRAINT com_bill_company_fk FOREIGN KEY (company_id) REFERENCES com_company (id),
    CONSTRAINT com_bill_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user (email),
    CONSTRAINT com_bill_quote_id_fk FOREIGN KEY (quote_id) REFERENCES com_quote (id)
);

DROP TABLE IF EXISTS com_bill_line;
CREATE TABLE com_bill_line
(
    bill_id   varchar(100) not null,
    line       integer      not null,
    type        varchar(100),
    quantity   decimal               default 0,
    price      decimal               default 0,
    description varchar(255),
    created_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    version    integer               default 0,
    CONSTRAINT com_bill_line_pk PRIMARY KEY (bill_id, line),
    CONSTRAINT com_bill_line_bill_fk FOREIGN KEY (bill_id) REFERENCES com_bill (id)
);

DROP TABLE IF EXISTS com_bill_customization;
CREATE TABLE com_bill_customization
(
    id                serial,
    company_id        bigint,
    main_color varchar(10) default 'lightgray',
    display_company_email boolean default false,
    display_company_phone_number boolean default false,
    display_customer_email boolean default false,
    display_customer_phone_number boolean default false,
    after_table       text,
    footer            text,
    version           integer            default 0,
    created_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp,
    CONSTRAINT com_bill_customization_pk PRIMARY KEY (id),
    CONSTRAINT com_bill_company_fk FOREIGN KEY (company_id) REFERENCES com_company(id)
);