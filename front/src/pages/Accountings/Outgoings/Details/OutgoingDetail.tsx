import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { OutgoingResponse } from '@/models/Outgoing'
import { ReportOutgoingResponse } from '@/models/Report'
import Supplier from '@/models/Supplier'
import { ReactNode, useMemo } from 'react'
import OutgoingLinesTable from './OutgoingLinesTable'
import { useI18n } from '@/i18n'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'

type OnlyChildrenProps = {
  children: ReactNode
}

const DetailsTableRow = ({ children }: OnlyChildrenProps) => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const DetailsTableLeft = ({ children }: OnlyChildrenProps) => (
  <dt className="md:col-span-6 border-b p-4 bg-base-200">{children}</dt>
)

const DetailsTableRight = ({ children }: OnlyChildrenProps) => (
  <dd className="md:col-span-6 p-4 border-b">{children}</dd>
)

type SupplierDetailRowProps = {
  value: number
  supplier?: Supplier
}
const SupplierDetailRow = ({ value, supplier }: SupplierDetailRowProps) => {
  const formatCurrency = useFormatCurrency()
  const { t } = useI18n()

  return (
    <dl style={{ backgroundColor: supplier?.color }} className="grid md:grid-cols-12 p-2 border-t">
      <dt className="md:col-span-6">{supplier?.name ?? t('accounting.outgoings.details.lines.defaultSupplier')}</dt>
      <dd className="md:col-span-6">{formatCurrency(value ?? 0)}</dd>
    </dl>
  )
}

type OutgoingDetailProps = {
  outgoing: OutgoingResponse | ReportOutgoingResponse
}
const OutgoingDetail = ({ outgoing }: OutgoingDetailProps) => {
  const { t } = useI18n()
  const { data: suppliers } = useAllSuppliersQuery()
  const formatCurrency = useFormatCurrency()

  const total = useMemo(
    () =>
      outgoing?.lines
        ? outgoing.lines.reduce((acc, line) => acc + line.totalHT * (1 + line.vat / 100), 0)
        : 0,
    [outgoing],
  )

  const groupBySuppliers = useMemo(
    () =>
      outgoing?.lines
        ? outgoing.lines.reduce(
          (acc, line) => ({
            ...acc,
            [line.supplierId ?? -1]:
              (Number(acc[line.supplierId ?? -1]) || 0) + line.totalHT * (1 + line.vat / 100),
          }),
          {} as Record<number, number>,
        )
        : ({} as Record<number, number>),
    [outgoing],
  )

  return (
    <div>
      <section className="md:pl-2">
        <div className="md:pl-2 flex flex-col gap-2 md:gap-0">
          <DetailsTableRow>
            <DetailsTableLeft>{t('accounting.outgoings.details.headers.name')}</DetailsTableLeft>
            <DetailsTableRight>{outgoing.name}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>{t('accounting.outgoings.details.headers.startDate')}</DetailsTableLeft>
            <DetailsTableRight>{outgoing.startDate}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>{t('accounting.outgoings.details.headers.endDate')}</DetailsTableLeft>
            <DetailsTableRight>{outgoing.endDate}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>{t('accounting.outgoings.details.headers.createdBy')}</DetailsTableLeft>
            <DetailsTableRight>{outgoing.createdBy}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>{t('accounting.outgoings.details.headers.itTotal')}</DetailsTableLeft>
            <DetailsTableRight>{formatCurrency(total)}</DetailsTableRight>
          </DetailsTableRow>
        </div>
      </section>
      {Object.keys(groupBySuppliers).length > 0 ? (
        <section className="md:pl-2 mt-4">
          <h2 className="text-lg mb-2">{t('accounting.outgoings.details.supplierDetail.title')}</h2>
          <div className="md:ml-2 flex flex-col gap-2 md:gap-0 rounded border">
            <div className="grid md:grid-cols-12 bg-primary-50 text-primary-700 py-4 p-2">
              <div className="md:col-span-6">{t('supplier')}</div>
              <div className="md:col-span-6">{t('itTotal')}</div>
            </div>
            {Object.entries(groupBySuppliers).map(([key, value]) => (
              <SupplierDetailRow
                value={value}
                supplier={suppliers?.find(({ id: supplierId }) => supplierId === Number(key))}
              />
            ))}
          </div>
        </section>
      ) : null}
      {outgoing.lines.length > 0 ? (
        <section className="md:pl-2 mt-4">
          <h2 className="text-lg mb-2">{t('accounting.outgoings.details.lines.title')}</h2>
          <div className="md:pl-2">
            <OutgoingLinesTable lines={outgoing.lines} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default OutgoingDetail
