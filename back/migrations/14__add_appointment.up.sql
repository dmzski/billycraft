CREATE TABLE com_appointment (
    id serial,
    name varchar(255) NOT NULL,
    description text,
    company_id bigint NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp,
    created_by varchar(100),
    done_by varchar(100),
    done_at timestamp,
    deleted_at timestamp,
    start_date timestamp,
    end_date timestamp,
    quote_id varchar(100),
    bill_id varchar(100),
    customer_id bigint,
    CONSTRAINT com_appointment_pk PRIMARY KEY (id),
    CONSTRAINT com_appointment_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user(email),
    CONSTRAINT com_appointment_done_by_fk FOREIGN KEY (done_by) REFERENCES com_user(email),
    CONSTRAINT com_appointment_company_id FOREIGN KEY (company_id) REFERENCES com_company(id),
    CONSTRAINT com_appointment_quote_id FOREIGN KEY (quote_id) REFERENCES com_quote(id),
    CONSTRAINT com_appointment_bill_id FOREIGN KEY (bill_id) REFERENCES com_bill(id),
    CONSTRAINT com_appointment_customer_id FOREIGN KEY (customer_id) REFERENCES com_customer(id)
);
CREATE TABLE com_appointment_assignees (
    appointment_id bigint NOT NULL,
    assignee varchar(100) NOT NULL,
    CONSTRAINT com_appointment_assignees_pk PRIMARY KEY (appointment_id, assignee),
    CONSTRAINT com_appointment_assignees_appointment_id_fk FOREIGN KEY (appointment_id) REFERENCES com_appointment(id),
    CONSTRAINT com_appointment_assignees_assignee_fk FOREIGN KEY (assignee) REFERENCES com_user(email)
);