import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useQueryParams = <
	T extends Record<string, string> = Record<string, string>,
>(): T => {
	const { search } = useLocation();

	return useMemo(() => {
		const urlParams = new URLSearchParams(search);
		const object = {} as T;
		for (const [key, value] of urlParams.entries()) {
			const typedKey = key as keyof T;
			object[typedKey] = value as (typeof object)[typeof typedKey];
		}

		return object;
	}, [search]);
};
