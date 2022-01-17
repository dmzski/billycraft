ALTER TABLE com_company
ADD COLUMN auto_month_report boolean DEFAULT FALSE;
ALTER TABLE com_company
ADD COLUMN auto_year_report boolean DEFAULT FALSE;
INSERT INTO com_user (email, first_name, last_name)
VALUES ('bot@coco-erp.fr', 'Bot', 'Coco-ERP');