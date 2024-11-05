export interface Todo {
	id: string;
	description: string;
	companyId: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	doneAt?: string;
	doneBy?: string;
}

export interface TodoRequest {
	description: string;
}
