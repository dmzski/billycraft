interface QuoteEmailCustomization {
	id?: string;
	body: string;
	object: string;
	sendAutomatically: boolean;
	companyId: string;
}

export default QuoteEmailCustomization;
