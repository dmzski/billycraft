BEGIN;

-- Drop constraints
ALTER TABLE com_outgoing_lines DROP CONSTRAINT com_outgoing_lines_bill_id_fk;
ALTER TABLE com_bill_line DROP CONSTRAINT com_bill_line_bill_fk;
ALTER TABLE com_bill_line DROP CONSTRAINT com_bill_line_pk;
ALTER TABLE com_bill DROP CONSTRAINT com_bill_pk;

-- Rename column
ALTER TABLE com_bill RENAME COLUMN id TO name;
ALTER TABLE com_outgoing_lines RENAME COLUMN bill_id TO bill_id_old;
ALTER TABLE com_bill_line RENAME COLUMN bill_id TO bill_id_old;

-- Add new ones
ALTER TABLE com_bill ADD COLUMN id UUID DEFAULT uuid_generate_v4();
ALTER TABLE com_outgoing_lines ADD COLUMN bill_id UUID DEFAULT NULL;
ALTER TABLE com_bill_line ADD COLUMN bill_id UUID;

-- Set values
UPDATE com_outgoing_lines b SET bill_id = q.id FROM com_bill q WHERE b.bill_id_old = q.name;
UPDATE com_bill_line ql SET bill_id = q.id FROM com_bill q WHERE ql.bill_id_old = q.name;

-- Clear old column
ALTER TABLE com_outgoing_lines DROP COLUMN bill_id_old;
ALTER TABLE com_bill_line DROP COLUMN bill_id_old;


-- Add constraints
ALTER TABLE com_bill_line ALTER COLUMN bill_id SET NOT NULL;
ALTER TABLE com_bill ADD CONSTRAINT com_bill_pk PRIMARY KEY (id);
ALTER TABLE com_bill_line ADD CONSTRAINT com_bill_line_pk PRIMARY KEY (bill_id, line);
ALTER TABLE com_outgoing_lines ADD CONSTRAINT com_outgoing_lines_bill_id_fk FOREIGN KEY (bill_id) REFERENCES com_bill(id);
ALTER TABLE com_bill_line ADD CONSTRAINT com_bill_line_bill_id_fk FOREIGN KEY (bill_id) REFERENCES com_bill(id);

COMMIT;
