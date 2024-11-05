export type ReportDTO = {
	startDate: string;
	endDate: string;
	sales: number;
	articleSales: number;
	serviceSales: number;
	otherSales: number;
	outgoings: number;
	articleTaxes: number;
	serviceTaxes: number;
	otherTaxes: number;
	details: ReportDTO[];
};
