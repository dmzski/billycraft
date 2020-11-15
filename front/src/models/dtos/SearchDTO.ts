export enum SearchCategoryEnum {
  QUOTE = "QUOTE",
  BILL = "BILL",
  CUSTOMER = "CUSTOMER",
  OTHER = "OTHER",
}

export class SearchResultDTO {
  id: string = "";
  description: string = "";
}

export class SearchDTO {
  category: SearchCategoryEnum = SearchCategoryEnum.OTHER;
  results: SearchResultDTO[] = [];
}
