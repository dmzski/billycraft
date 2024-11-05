import { UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useOrganizationLogoQuery = (
	src: string,
	dataloaderConfig?: UseDataLoaderConfig<string, Error>,
) => {
	const key = ["organziation", "logo", src];

	return useDataLoader(
		key,
		async () => {
			const res = await fetch(src);
			if (res.ok) {
				const blob = await res.blob();
				const reader = new FileReader();

				return new Promise<string>((resolve, reject) => {
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
			}

			return undefined;
		},
		dataloaderConfig,
	);
};
