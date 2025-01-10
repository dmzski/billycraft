import { PRODUCT_ICONS } from "@/constants/productIcons"
import { useI18n } from "@/i18n"
import type { ProductType } from "@/sdk"

type ProductTypeLabelProps = {
	type: ProductType
	short?: boolean
}

export const ProductTypeLabel = ({ type, short }: ProductTypeLabelProps) => {
	const { scopedT } = useI18n()
	const t = scopedT(`products.type.${type}`)
	const IconComponent = PRODUCT_ICONS[type] ?? PRODUCT_ICONS.OTHER_SERVICE

	return (
		<span className="inline-flex gap-2 items-center">
			{IconComponent ? (
				<IconComponent className="size-5" title={t("label")} />
			) : null}
			{!short ? <span>{t("label")}</span> : null}
		</span>
	)
}
