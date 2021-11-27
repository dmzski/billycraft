export interface Todo {
  id: number;
  description: string;
  companyId: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  doneAt?: string;
  doneBy?: string;
}

export interface TodoRequest {
  description: string;
}
