ALTER TABLE com_bill
ALTER COLUMN tva TYPE decimal;
ALTER TABLE com_quote
ALTER COLUMN tva TYPE decimal;
ALTER TABLE com_outgoing_lines
ALTER COLUMN vat TYPE decimal;
ALTER TABLE com_report_outgoing_lines
ALTER COLUMN vat TYPE decimal;
ALTER TABLE com_supplier
ALTER COLUMN vat TYPE decimal;
ALTER TABLE com_supplier
ALTER COLUMN vat
SET DEFAULT 0;
ALTER TABLE com_bill
ALTER COLUMN tva
SET DEFAULT 0;
ALTER TABLE com_quote
ALTER COLUMN tva
SET DEFAULT 0;
ALTER TABLE com_outgoing_lines
ALTER COLUMN vat
SET DEFAULT 0;
ALTER TABLE com_report_outgoing_lines
ALTER COLUMN vat
SET DEFAULT 0;