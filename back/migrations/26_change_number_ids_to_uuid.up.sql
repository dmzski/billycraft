
BEGIN;

-- DROP ALL CONSTRAINT
ALTER TABLE com_bill_customization DROP CONSTRAINT com_bill_company_fk;
ALTER TABLE com_bill DROP CONSTRAINT com_bill_company_fk;
ALTER TABLE com_bill_email_customization DROP CONSTRAINT com_bill_email_customization_company_id;
ALTER TABLE com_customer DROP CONSTRAINT com_customer_company_fk;
ALTER TABLE com_outgoing DROP CONSTRAINT com_outgoing_company_id_fk;
ALTER TABLE com_product DROP CONSTRAINT com_product_company_id;
ALTER TABLE com_quote_customization DROP CONSTRAINT com_quote_company_fk;
ALTER TABLE com_quote DROP CONSTRAINT com_quote_company_fk;
ALTER TABLE com_quote_email_customization DROP CONSTRAINT com_quote_email_customization_company_id;
ALTER TABLE com_report DROP CONSTRAINT com_report_company_id_fk;
ALTER TABLE com_setting DROP CONSTRAINT com_setting_company_fk;
ALTER TABLE com_supplier DROP CONSTRAINT com_supplier_company_id_fk;
ALTER TABLE com_todo DROP CONSTRAINT com_todo_company_id;
ALTER TABLE com_user DROP CONSTRAINT com_user_company_fk;

-- ALTER TYPES OF foreign keys
ALTER TABLE com_bill_customization ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_bill ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_bill_email_customization ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_customer ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_outgoing ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_product ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_quote_customization ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_quote ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_quote_email_customization ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_report ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_setting ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_supplier ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_todo ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;
ALTER TABLE com_user ALTER COLUMN company_id SET DATA TYPE UUID USING LPAD(TO_HEX(company_id), 32, '0')::UUID;

-- ALTER TYPES OF primary key
ALTER TABLE com_company ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- ADD CONSTRAINT ON ALL FOREIGN KEYS
ALTER TABLE "com_bill_customization" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_bill" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_bill_email_customization" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_customer" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_outgoing" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_product" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_quote_customization" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_quote" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_quote_email_customization" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_report" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_setting" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_supplier" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_todo" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "com_user" ADD CONSTRAINT "company_id_fk" FOREIGN KEY (company_id) REFERENCES com_company(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER CUSTOMER FOREIGN KEYS
ALTER TABLE com_bill DROP CONSTRAINT com_bill_customer_fk;
ALTER TABLE com_bill ALTER COLUMN customer_id SET DATA TYPE UUID USING LPAD(TO_HEX(customer_id), 32, '0')::UUID;
ALTER TABLE com_quote DROP CONSTRAINT com_quote_customer_fk;
ALTER TABLE com_quote ALTER COLUMN customer_id SET DATA TYPE UUID USING LPAD(TO_HEX(customer_id), 32, '0')::UUID;

ALTER TABLE com_customer ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

ALTER TABLE com_bill ADD CONSTRAINT customer_fk FOREIGN KEY (customer_id) REFERENCES com_customer(id);
ALTER TABLE com_quote ADD CONSTRAINT customer_fk FOREIGN KEY (customer_id) REFERENCES com_customer(id);

-- ALTER com_supplier
ALTER TABLE com_outgoing_lines DROP CONSTRAINT com_outgoing_lines_supplier_id_fk;
ALTER TABLE com_report_outgoing_lines DROP CONSTRAINT com_report_outgoing_lines_supplier_id_fk;
ALTER TABLE com_outgoing_lines ALTER COLUMN supplier_id SET DATA TYPE UUID USING LPAD(TO_HEX(supplier_id), 32, '0')::UUID;
ALTER TABLE com_report_outgoing_lines ALTER COLUMN supplier_id SET DATA TYPE UUID USING LPAD(TO_HEX(supplier_id), 32, '0')::UUID;

ALTER TABLE com_supplier ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

ALTER TABLE com_outgoing_lines ADD CONSTRAINT supplier_id_fk FOREIGN KEY (supplier_id) REFERENCES com_supplier(id);
ALTER TABLE com_report_outgoing_lines ADD CONSTRAINT supplier_id_fk FOREIGN KEY (supplier_id) REFERENCES com_supplier(id);

-- ALTER OTHER TABLES WITHOUT FOREIGN KEY
ALTER TABLE com_quote_customization ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

ALTER TABLE com_bill_customization ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

ALTER TABLE com_quote_email_customization ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

ALTER TABLE com_bill_email_customization ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();


ALTER TABLE com_product ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

ALTER TABLE com_todo ALTER COLUMN id DROP DEFAULT, 
ALTER COLUMN id SET DATA TYPE UUID USING LPAD(TO_HEX(id), 32, '0')::UUID, 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();


COMMIT;
