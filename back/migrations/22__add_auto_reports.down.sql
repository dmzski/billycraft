ALTER TABLE com_company DROP COLUMN auto_month_report;
ALTER TABLE com_company DROP COLUMN auto_year_report;
DELETE FROM com_user
WHERE email = 'bot@coco-erp.fr';