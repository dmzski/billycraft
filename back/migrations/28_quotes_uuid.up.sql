BEGIN;

-- Drop constraints
ALTER TABLE com_bill DROP CONSTRAINT com_bill_quote_id_fk;
ALTER TABLE com_quote_line DROP CONSTRAINT com_quote_line_quote_fk;
ALTER TABLE com_quote_line DROP CONSTRAINT com_quote_line_pk;
ALTER TABLE com_quote DROP CONSTRAINT com_quote_pk;

-- Rename column
ALTER TABLE com_quote RENAME COLUMN id TO name;
ALTER TABLE com_bill RENAME COLUMN quote_id TO quote_id_old;
ALTER TABLE com_quote_line RENAME COLUMN quote_id TO quote_id_old;

-- Add new ones
ALTER TABLE com_quote ADD COLUMN id UUID DEFAULT uuid_generate_v4();
ALTER TABLE com_bill ADD COLUMN quote_id UUID DEFAULT NULL;
ALTER TABLE com_quote_line ADD COLUMN quote_id UUID;

-- Set values
UPDATE com_bill b SET quote_id = q.id FROM com_quote q WHERE b.quote_id_old = q.name;
UPDATE com_quote_line ql SET quote_id = q.id FROM com_quote q WHERE ql.quote_id_old = q.name;

-- Clear old column
ALTER TABLE com_bill DROP COLUMN quote_id_old;
ALTER TABLE com_quote_line DROP COLUMN quote_id_old;


-- Add constraints
ALTER TABLE com_quote_line ALTER COLUMN quote_id SET NOT NULL;
ALTER TABLE com_quote ADD CONSTRAINT com_quote_pk PRIMARY KEY (id);
ALTER TABLE com_quote_line ADD CONSTRAINT com_quote_line_pk PRIMARY KEY (quote_id, line);
ALTER TABLE com_bill ADD CONSTRAINT com_bill_quote_id_fk FOREIGN KEY (quote_id) REFERENCES com_quote(id);
ALTER TABLE com_quote_line ADD CONSTRAINT com_quote_line_quote_id_fk FOREIGN KEY (quote_id) REFERENCES com_quote(id);

COMMIT;
