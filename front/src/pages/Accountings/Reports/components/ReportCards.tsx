import CounterAnimated from '@/components/CounterAnimated'
import { ComponentType, ReactNode, useMemo } from 'react'
import clsx from 'clsx'
import { ReportResponse } from '@/models/Report'
import { BanknotesIcon, CubeIcon, HandRaisedIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

const ReportCardVariants = {
  primary: 'text-primary-700',
  secondary: 'text-secondary-700',
  success: 'text-success-700',
  info: 'text-info-700',
  error: 'text-error-700',
  warning: 'text-warning-700',
} as const

type ReportCardProps = {
  icon: ComponentType<{ className: string }>
  title: string
  children?: ReactNode
  variant?: keyof typeof ReportCardVariants
}

const ReportCard = ({
  icon: IconComponent,
  title,
  children,
  variant = 'primary',
}: ReportCardProps) => (
  <div className="flex rounded-md flex-col px-8 py-5 mx-2 my-3">
    <div
      className={clsx(
        'flex flex-col font-bold justify-center items-center',
        ReportCardVariants[variant] ?? ReportCardVariants.primary,
      )}
    >
      <IconComponent className="mb-2 text-4xl w-8" />
      <span>{title}</span>
    </div>
    <div className="font-bold mt-2 flex justify-center items-center">{children}</div>
  </div>
)

const ReportCards = ({ report }: { report: ReportResponse }) => {
  const { t } = useI18n()
  const formatter = useMemo(
    () => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format,
    [],
  )
  return (
    <div className="flex flex-wrap justify-between w-full items-center">
      <ReportCard icon={BanknotesIcon} title={t('accounting.reports.components.card.salesRevenue')} variant="primary">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.sales * 100) / 100} />
        </span>
      </ReportCard>
      <ReportCard icon={CubeIcon} title={t('accounting.reports.components.card.articles')} variant="info">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.articleSales * 100) / 100} />
        </span>
      </ReportCard>
      <ReportCard icon={HandRaisedIcon} title={t('accounting.reports.components.card.services')} variant="success">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.serviceSales * 100) / 100} />
        </span>
      </ReportCard>
      <ReportCard icon={QuestionMarkCircleIcon} title={t('accounting.reports.components.card.others')} variant="secondary">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.otherSales * 100) / 100} />
        </span>
      </ReportCard>
    </div>
  )
}

export default ReportCards
