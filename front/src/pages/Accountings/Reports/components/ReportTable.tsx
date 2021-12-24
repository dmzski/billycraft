import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { ReportDTO } from 'models/dtos/Report'
import { ReactNode, useMemo } from 'react'

type ReportTableProps = {
  report: ReportDTO
}

type OnlyChildrenProps = {
  children: ReactNode
}

const ReportTableRow = ({ children }: OnlyChildrenProps): JSX.Element => (
  <div className="grid md:grid-cols-12">{children}</div>
)

const ReportTableLeft = ({ children }: OnlyChildrenProps): JSX.Element => (
  <div className="md:col-span-6 bg-primary-50 text-primary-700 border p-2">{children}</div>
)

const ReportTableRight = ({ children }: OnlyChildrenProps): JSX.Element => (
  <div className="md:col-span-6 p-2 border border-l-0">{children}</div>
)
const ReportTable = ({ report }: ReportTableProps): JSX.Element => {
  const formatCurrency = useFormatCurrency()

  const allTaxes = useMemo(() => report.serviceTaxes + report.articleTaxes + report.otherTaxes, [
    report,
  ])
  return (
    <div className="flex flex-col gap-2 md:gap-0">
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
        <ReportTableRight>{formatCurrency(report.outgoings)}</ReportTableRight>
      </ReportTableRow>
      <ReportTableRow>
        <ReportTableLeft>Restant net</ReportTableLeft>
        <ReportTableRight>
          {formatCurrency(report.sales - allTaxes - report.outgoings)}
        </ReportTableRight>
      </ReportTableRow>
    </div>
  )
}

export default ReportTable
