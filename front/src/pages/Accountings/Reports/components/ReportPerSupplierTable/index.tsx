import { SupplierApi } from 'api/SupplierApi'
import { useFormatCurrency } from 'hooks/useFormatCurrency'
import { ReportResponse } from 'models/Report'
import Supplier from 'models/Supplier'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

type SupplierDetailRowProps = {
  value: number
  supplier?: Supplier
}
const SupplierDetailRow = ({ value, supplier }: SupplierDetailRowProps) => {
  const formatCurrency = useFormatCurrency()

  return (
    <dl style={{ backgroundColor: supplier?.color }} className="grid md:grid-cols-12 p-2 border-t">
      <dt className="md:col-span-6">{supplier?.name ?? 'Aucun fournisseur'}</dt>
      <dd className="md:col-span-6">{formatCurrency(value ?? 0)}</dd>
    </dl>
  )
}

type ReportPerSupplierTableProps = {
  report: ReportResponse
}

const ReportPerSupplierTable = ({ report }: ReportPerSupplierTableProps): JSX.Element => {
  const { data: suppliers } = useQuery(`suppliers`, SupplierApi.findAll, {
    staleTime: 6000,
    refetchOnWindowFocus: false,
  })
  const groupBySuppliers = useMemo(
    () =>
      Object.values(
        report.outgoings
          ?.map(outgoing => outgoing.lines)
          .filter(lines => Array.isArray(lines))
          .flat()
          .reduce(
            (acc, line) => {
              const index = line.supplierId ?? -1
              if (acc[index]) {
                return {
                  ...acc,
                  [index]: {
                    total: (Number(acc[index]) || 0) + line.totalHT * (1 - line.vat),
                    supplier: acc[index].supplier,
                  },
                }
              }

              const supplier = suppliers?.find(
                ({ id: supplierId }) => supplierId === line.supplierId,
              )
              return {
                ...acc,
                [supplier?.id ?? -1]: {
                  total: (Number(acc[index]) || 0) + line.totalHT * (1 - line.vat),
                  supplier,
                },
              }
            },
            {} as Record<
              number,
              {
                total: number
                supplier?: Supplier
              }
            >,
          ),
      ).sort(({ supplier: supplierA }, { supplier: supplerB }) =>
        (supplierA?.name ?? '').localeCompare(supplerB?.name ?? ''),
      ),
    [report.outgoings, suppliers],
  )

  return (
    <div className="flex flex-col gap-4">
      {Object.keys(groupBySuppliers).length > 0 ? (
        <div className="md:ml-2 flex flex-col rounded border">
          <div className="grid md:grid-cols-12 bg-primary-50 text-primary-700 py-4 p-2">
            <div className="md:col-span-6">Fournisseur</div>
            <div className="md:col-span-6">Total TTC</div>
          </div>
          {groupBySuppliers.map(({ total, supplier }) => (
            <SupplierDetailRow value={total} supplier={supplier} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ReportPerSupplierTable
