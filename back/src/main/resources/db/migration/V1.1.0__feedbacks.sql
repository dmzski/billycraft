-- Drop columns
ALTER TABLE com_quote_customization DROP COLUMN after_information;

-- Add more information
ALTER TABLE com_customer ADD COLUMN email varchar(200) default '';
ALTER TABLE com_company ADD COLUMN email varchar(200) default '';
ALTER TABLE com_quote_customization ADD COLUMN main_color varchar(10) default 'lightgray';
ALTER TABLE com_quote_customization ADD COLUMN display_company_email boolean default false;
ALTER TABLE com_quote_customization ADD COLUMN display_company_phone_number boolean default false;
ALTER TABLE com_quote_customization ADD COLUMN display_customer_email boolean default false;
ALTER TABLE com_quote_customization ADD COLUMN display_customer_phone_number boolean default false;