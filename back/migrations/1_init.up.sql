CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS com_user;
CREATE TABLE com_user
(
    email         varchar(100) not null,
    first_name      varchar(100),
    last_name varchar(100),
    company_id    bigint,
    created_at   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp,
    version      integer               default 0,
    CONSTRAINT com_user_pk PRIMARY KEY (email)
);


DROP TABLE IF EXISTS com_company;
CREATE TABLE com_company
(
    id           serial,
    name         varchar(100) not null,
    city         varchar(100),
    phone_number varchar(10),
    address      varchar(50),
    siret        varchar(50),
    logo         varchar(255),
    postal_code  varchar(10),
    created_at   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp,
    created_by   varchar(100),
    version      integer               default 0,
    CONSTRAINT com_company_pk PRIMARY KEY (id),
    CONSTRAINT com_compagny_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user(email)
);

ALTER TABLE com_user ADD CONSTRAINT com_user_company_fk FOREIGN KEY (company_id) REFERENCES com_company(id);


DROP TABLE IF EXISTS com_customer;
CREATE TABLE com_customer
(
    id           serial,
    name         varchar(100) not null,
    contact      varchar(100),
    phone_number varchar(10),
    city         varchar(50),
    postal_code  varchar(10),
    address      varchar(255),
    created_at   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp,
    version      integer               default 0,
    company_id  bigint,
    CONSTRAINT com_customer_pk PRIMARY KEY (id),
    CONSTRAINT com_customer_company_fk FOREIGN KEY (company_id) REFERENCES com_company(id)
);

DROP TABLE IF EXISTS com_quote;
CREATE TABLE com_quote
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
    CONSTRAINT com_quote_pk PRIMARY KEY (id),
    CONSTRAINT com_quote_customer_fk FOREIGN KEY (customer_id) REFERENCES com_customer (id),
    CONSTRAINT com_quote_company_fk FOREIGN KEY (company_id) REFERENCES com_company (id),
    CONSTRAINT com_quote_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user (email)
);

DROP TABLE IF EXISTS com_setting;
CREATE TABLE com_setting
(
    id         varchar(100),
    value      varchar(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    version    integer            default 0,
    company_id bigint,
    CONSTRAINT com_setting_id PRIMARY KEY (id),
    CONSTRAINT com_setting_company_fk FOREIGN KEY (company_id) REFERENCES com_company(id)
);


DROP TABLE IF EXISTS com_quote_line;
CREATE TABLE com_quote_line
(
    quote_id   varchar(100) not null,
    line       integer      not null,
    quantity   decimal               default 0,
    price      decimal               default 0,
    description varchar(255),
    created_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    version    integer               default 0,
    CONSTRAINT com_quote_line_pk PRIMARY KEY (quote_id, line),
    CONSTRAINT com_quote_line_quote_fk FOREIGN KEY (quote_id) REFERENCES com_quote (id)
);

DROP TABLE IF EXISTS com_quote_customization;
CREATE TABLE com_quote_customization
(
    id                serial,
    company_id        bigint,
    after_information text,
    after_table       text,
    footer            text,
    version           integer            default 0,
    created_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp,
    CONSTRAINT com_quote_customization_pk PRIMARY KEY (id),
    CONSTRAINT com_quote_company_fk FOREIGN KEY (company_id) REFERENCES com_company(id)
);
