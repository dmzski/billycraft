import CounterAnimated from "@/components/CounterAnimated"
import { type ComponentType, type ReactNode, useMemo } from "react"
import clsx from "clsx"
import type { ReportResponse } from "@/sdk"
import {
	BanknotesIcon,
	CubeIcon,
	HandRaisedIcon,
	QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid"
import { useI18n } from "@/i18n"

const ReportCardVariants = {
	default: "text-foreground",
	secondary: "text-secondary",
	destrucitve: "text-destructive",
} as const

type ReportCardProps = {
	icon: ComponentType<{ className?: string }>
	title: string
	children?: ReactNode
	variant?: keyof typeof ReportCardVariants
}

const ReportCard = ({
	icon: IconComponent,
	title,
	children,
	variant = "default",
}: ReportCardProps) => (
	<div className="flex rounded-md flex-col px-8 py-5 mx-2 my-3">
		<div
			className={clsx(
				"flex flex-col font-bold justify-center items-center",
				ReportCardVariants[variant] ?? ReportCardVariants.default,
			)}
		>
			<IconComponent className="mb-2 text-4xl w-8" />
			<span>{title}</span>
		</div>
		<div className="font-bold mt-2 flex justify-center items-center">
			{children}
		</div>
	</div>
)

const ReportCards = ({ report }: { report: ReportResponse }) => {
	const { t } = useI18n()
	const formatter = useMemo(
		() =>
			new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" })
				.format,
		[],
	)
	return (
		<div className="flex flex-wrap justify-between w-full items-center">
			<ReportCard
				icon={BanknotesIcon}
				title={t("accounting.reports.components.card.salesRevenue")}
			>
				<span>
					<CounterAnimated
						format={formatter}
						value={Math.round(report.sales * 100) / 100}
					/>
				</span>
			</ReportCard>
			<ReportCard
				icon={CubeIcon}
				title={t("accounting.reports.components.card.articles")}
			>
				<span>
					<CounterAnimated
						format={formatter}
						value={Math.round(report.articleSales * 100) / 100}
					/>
				</span>
			</ReportCard>
			<ReportCard
				icon={HandRaisedIcon}
				title={t("accounting.reports.components.card.services")}
			>
				<span>
					<CounterAnimated
						format={formatter}
						value={Math.round(report.serviceSales * 100) / 100}
					/>
				</span>
			</ReportCard>
			<ReportCard
				icon={QuestionMarkCircleIcon}
				title={t("accounting.reports.components.card.others")}
			>
				<span>
					<CounterAnimated
						format={formatter}
						value={Math.round(report.otherSales * 100) / 100}
					/>
				</span>
			</ReportCard>
		</div>
	)
}

export default ReportCards
