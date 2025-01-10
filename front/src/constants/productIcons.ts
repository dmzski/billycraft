import type { ProductType } from "@/sdk"
import {
	HandRaisedIcon,
	PencilIcon,
	QuestionMarkCircleIcon,
	ShoppingBagIcon,
} from "@heroicons/react/24/solid"

export const PRODUCT_ICONS: Record<ProductType, typeof PencilIcon> = {
	TEXT: PencilIcon,
	ARTICLE: ShoppingBagIcon,
	SERVICE: HandRaisedIcon,
	OTHER_SERVICE: QuestionMarkCircleIcon,
}
