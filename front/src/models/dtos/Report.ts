export class ReportDTO {
  startDate = "";
  endDate = "";
  sales = 0;
  articleSales = 0;
  serviceSales = 0;
  otherSales = 0;
  details: ReportDTO[] = [];
}
