export class ReportDTO {
  startDate: string = "";
  endDate: string = "";
  sales: number = 0;
  articleSales: number = 0;
  serviceSales: number = 0;
  otherSales: number = 0;
  details: ReportDTO[] = [];
}
