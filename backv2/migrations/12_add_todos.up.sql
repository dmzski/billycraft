CREATE TABLE com_todo (
    id           serial,
    description  text NOT NULL,
    company_id     bigint,
    created_at   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp,
    created_by   varchar(100),
    done_by      varchar(100),
    done_at      timestamp,
    deleted_at   timestamp,
    CONSTRAINT com_todo_pk PRIMARY KEY (id),
    CONSTRAINT com_todo_created_by_fk FOREIGN KEY (created_by) REFERENCES com_user(email),
    CONSTRAINT com_todo_done_by_fk FOREIGN KEY (done_by) REFERENCES com_user(email),
    CONSTRAINT com_todo_company_id FOREIGN KEY (company_id) REFERENCES com_company(id)
);