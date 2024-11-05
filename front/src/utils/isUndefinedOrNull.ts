export const isUndefinedOrNull = (value: unknown): value is undefined | null =>
	value === null || value === undefined;
