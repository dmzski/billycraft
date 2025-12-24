export class ApiError {
	public message: string

	public code: number

	public constructor(code: number, message: string) {
		this.message = message
		this.code = code
	}
}
