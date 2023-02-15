import clsx from 'clsx'
import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { ReportResponse } from 'models/Report'
import { ReactNode, useMemo } from 'react'

type ReportTableProps = {
  report: ReportResponse
}

type OnlyChildrenProps = {
  children: ReactNode
  noBorder?: boolean
}

const ReportTableRow = ({ children }: { children: ReactNode }): JSX.Element => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const ReportTableLeft = ({ children, noBorder }: OnlyChildrenProps): JSX.Element => (
  <dt className={clsx('md:col-span-6 bg-base-300 p-2', noBorder ? '' : 'border-b')}>{children}</dt>
)

const ReportTableRight = ({ children, noBorder }: OnlyChildrenProps): JSX.Element => (
  <dd className={clsx('md:col-span-6 p-2', noBorder ? '' : 'border-b')}>{children}</dd>
)
const ReportTable = ({ report }: ReportTableProps): JSX.Element => {
  const formatCurrency = useFormatCurrency()

  const allTaxes = useMemo(
    () => report.serviceTaxes + report.articleTaxes + report.otherTaxes,
    [report],
  )
  return (
    <div className="flex flex-col gap-2 md:gap-0 border rounded">
      <ReportTableRow>
        <ReportTableLeft>Ventes de marchandises</ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.articleSales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>Services commerciaux ou artisanaux</ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.serviceSales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>Autres types de service</ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.otherSales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>Chifre d&apos;affaire</ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.sales)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>A déclarer</ReportTableLeft>
        <ReportTableRight>{formatCurrency(allTaxes)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>Bénéfices net</ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.sales - allTaxes)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>Dépenses</ReportTableLeft>
        <ReportTableRight>{formatCurrency(report.totalOutgoings)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft noBorder>Restant net</ReportTableLeft>
        <ReportTableRight noBorder>
          {formatCurrency(report.sales - allTaxes - report.totalOutgoings)}
        </ReportTableRight>
      </ReportTableRow>
    </div>
  )
}

export default ReportTable
