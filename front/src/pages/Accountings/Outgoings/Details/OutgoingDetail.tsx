import { SupplierApi } from 'api/SupplierApi'
import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { OutgoingResponse } from 'models/Outgoing'
import { ReportOutgoingResponse } from 'models/Report'
import Supplier from 'models/Supplier'
import { ReactNode, useMemo } from 'react'
import { useQuery } from 'react-query'
import OutgoingLinesTable from './OutgoingLinesTable'

type OnlyChildrenProps = {
  children: ReactNode
}

const DetailsTableRow = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const DetailsTableLeft = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dt className="md:col-span-6 border-b p-4 bg-base-200">{children}</dt>
)

const DetailsTableRight = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dd className="md:col-span-6 p-4 border-b">{children}</dd>
)

type SupplierDetailRowProps = {
  value: number
  supplier?: Supplier
}
const SupplierDetailRow = ({ value, supplier }: SupplierDetailRowProps) => {
  const formatCurrency = useFormatCurrency()

  return (
    <dl style={{ backgroundColor: supplier?.color }} className="grid md:grid-cols-12 p-2 border-t">
      <dt className="md:col-span-6">{supplier?.name ?? 'Divers'}</dt>
      <dd className="md:col-span-6">{formatCurrency(value ?? 0)}</dd>
    </dl>
  )
}

type OutgoingDetailProps = {
  outgoing: OutgoingResponse | ReportOutgoingResponse
}
const OutgoingDetail = ({ outgoing }: OutgoingDetailProps): JSX.Element => {
  const { data: suppliers } = useQuery(`suppliers`, SupplierApi.findAll, {
    staleTime: 6000,
  })
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
            <DetailsTableLeft>Nom du livret</DetailsTableLeft>
            <DetailsTableRight>{outgoing.name}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>Date de début</DetailsTableLeft>
            <DetailsTableRight>{outgoing.startDate}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>Date de fin</DetailsTableLeft>
            <DetailsTableRight>{outgoing.endDate}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>Créé par</DetailsTableLeft>
            <DetailsTableRight>{outgoing.createdBy}</DetailsTableRight>
          </DetailsTableRow>
          <DetailsTableRow>
            <DetailsTableLeft>Total TTC</DetailsTableLeft>
            <DetailsTableRight>{formatCurrency(total)}</DetailsTableRight>
          </DetailsTableRow>
        </div>
      </section>
      {Object.keys(groupBySuppliers).length > 0 ? (
        <section className="md:pl-2 mt-4">
          <h2 className="text-lg mb-2">Détail par fournisseur</h2>
          <div className="md:ml-2 flex flex-col gap-2 md:gap-0 rounded border">
            <div className="grid md:grid-cols-12 bg-primary-50 text-primary-700 py-4 p-2">
              <div className="md:col-span-6">Fournisseur</div>
              <div className="md:col-span-6">Total TTC</div>
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
          <h2 className="text-lg mb-2">Détail des lignes</h2>
          <div className="md:pl-2">
            <OutgoingLinesTable lines={outgoing.lines} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default OutgoingDetail
