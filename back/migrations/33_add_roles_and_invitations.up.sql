BEGIN;

CREATE TABLE com_role (
  email varchar(250) NOT NULL,
  company_id uuid not null,
  role varchar(50) not null DEFAULT 'EDITOR',
  CONSTRAINT com_role_pk PRIMARY KEY (email, company_id)
);

INSERT INTO com_role (email, company_id, role)
  (SELECT created_by, id, 'OWNER' FROM com_company);

INSERT INTO com_role (email, company_id, role) 
  (SELECT u.email, u.company_id, 'EDITOR' FROM com_user u JOIN com_company c ON u.company_id = c.id WHERE u.email <> c.created_by);

CREATE TABLE com_invitation (
  company_id uuid not null,
  email varchar(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL,
  status varchar(50) NOT NULL DEFAULT 'PENDING',
  role varchar(50) not null DEFAULT 'EDITOR',
  CONSTRAINT com_invitation_pk PRIMARY KEY (company_id, email),
  CONSTRAINT com_invitation_company_fk FOREIGN KEY (company_id) REFERENCES com_company (id)
);
COMMIT;
