import clsx from 'clsx'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { ReportResponse } from '@/models/Report'
import { ReactNode, useMemo } from 'react'
import { useI18n } from '@/i18n'

type ReportTableProps = {
  report: ReportResponse
}

type OnlyChildrenProps = {
  children: ReactNode
  noBorder?: boolean
}

const ReportTableRow = ({ children }: { children: ReactNode }) => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const ReportTableLeft = ({ children, noBorder }: OnlyChildrenProps) => (
  <dt className={clsx('md:col-span-6 bg-base-300 p-2', noBorder ? '' : 'border-b')}>{children}</dt>
)

const ReportTableRight = ({ children, noBorder }: OnlyChildrenProps) => (
  <dd className={clsx('md:col-span-6 p-2', noBorder ? '' : 'border-b')}>{children}</dd>
)
const ReportTable = ({ report }: ReportTableProps) => {
  const formatCurrency = useFormatCurrency()
  const { t } = useI18n()

  const allTaxes = useMemo(
    () => report.serviceTaxes + report.articleTaxes + report.otherTaxes,
    [report],
  )
  return (
    <div className="flex flex-col gap-2 md:gap-0 border rounded">
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.articleSells')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.articleSales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.serviceSells')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.serviceSales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.otherSells')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.otherSales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.salesRevenue')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.sales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.toDeclare')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(allTaxes)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.etIncome')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.sales - allTaxes)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>
          {t('accounting.reports.components.table.headers.outcomes')}
        </ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.totalOutgoings)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft noBorder>
          {t('accounting.reports.components.table.headers.etRemaining')}
        </ReportTableLeft>
        <ReportTableRight noBorder>
          {formatCurrency(report.sales - allTaxes - report.totalOutgoings)}
        </ReportTableRight>
      </ReportTableRow>
    </div>
  )
}

export default ReportTable
