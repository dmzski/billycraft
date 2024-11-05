export type OutgoingLineResponse = {
	supplierId?: string;
	supplierBillReference?: string;
	billId?: string;
	totalHT: number;
	vat: number;
	line: number;
};

export type OutgoingResponse = {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	lines: OutgoingLineResponse[];
	companyId: string;
	createdBy: string;
};

export type OutgoingLineRequest = {
	supplierId?: string;
	supplierBillReference?: string;
	billId?: string;
	totalHT: number;
	vat: number;
	line: number;
};

export type OutgoingRequest = {
	name: string;
	startDate: string;
	endDate: string;
	lines: OutgoingLineRequest[];
};
