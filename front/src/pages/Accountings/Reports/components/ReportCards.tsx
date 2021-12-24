import { ReportDTO } from 'models/dtos/Report'
import CounterAnimated from 'components/CounterAnimated'
import { ReactNode, useMemo } from 'react'
import { Icon } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import clsx from 'clsx'

const ReportCardVariants = {
  primary: 'text-primary-700',
  secondary: 'text-secondary-700',
  success: 'text-success-700',
  info: 'text-info-700',
  error: 'text-error-700',
  warning: 'text-warning-700',
} as const

type ReportCardProps = {
  icon: string
  title: string
  children?: ReactNode
  variant?: keyof typeof ReportCardVariants
}

const ReportCard = ({
  icon,
  title,
  children,
  variant = 'primary',
}: ReportCardProps): JSX.Element => (
  <div className="flex rounded-md flex-col px-8 py-5 mx-2 my-3">
    <div
      className={clsx(
        'flex flex-col font-bold justify-center items-center',
        ReportCardVariants[variant] ?? ReportCardVariants.primary,
      )}
    >
      <Icon name={icon as IconName} className="mb-2 text-4xl" />
      <span>{title}</span>
    </div>
    <div className="font-bold mt-2 flex justify-center items-center">{children}</div>
  </div>
)

const ReportCards = ({ report }: { report: ReportDTO }): JSX.Element => {
  const formatter = useMemo(
    () => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format,
    [],
  )
  return (
    <div className="flex flex-wrap justify-between w-full items-center">
      <ReportCard icon="cash" title="Chiffre d'affaire" variant="primary">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.sales * 100) / 100} />
        </span>
      </ReportCard>
      <ReportCard icon="cube" title="Matériels" variant="info">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.articleSales * 100) / 100} />
        </span>
      </ReportCard>
      <ReportCard icon="hand" title="Services" variant="success">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.serviceSales * 100) / 100} />
        </span>
      </ReportCard>
      <ReportCard icon="question-mark-circle" title="Autres" variant="secondary">
        <span>
          <CounterAnimated format={formatter} value={Math.round(report.otherSales * 100) / 100} />
        </span>
      </ReportCard>
    </div>
  )
}

export default ReportCards
