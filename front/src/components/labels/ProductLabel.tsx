import { PRODUCT_ICONS } from "@/constants/productIcons"
import { useI18n } from "@/i18n"
import type { ProductResponse } from "@/sdk"

type ProductLabelProps = {
	product: ProductResponse
}

export const ProductLabel = ({ product }: ProductLabelProps) => {
	const { scopedT } = useI18n()
	const t = scopedT(`products.type.${product.type}`)
	const IconComponent =
		PRODUCT_ICONS[product.type] ?? PRODUCT_ICONS.OTHER_SERVICE

	return (
		<span className="inline-flex gap-2 items-center">
			{IconComponent ? (
				<IconComponent className="size-5" title={t("label")} />
			) : null}
			<span>{product.name}</span>
		</span>
	)
}
