export enum SearchCategoryEnum {
  QUOTE = "QUOTE",
  BILL = "BILL",
  CUSTOMER = "CUSTOMER",
  OTHER = "OTHER",
}

export class SearchResultDTO {
  id = "";
  description = "";
}

export class SearchDTO {
  category: SearchCategoryEnum = SearchCategoryEnum.OTHER;
  results: SearchResultDTO[] = [];
}
