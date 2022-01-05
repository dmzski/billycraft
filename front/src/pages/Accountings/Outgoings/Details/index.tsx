import { Button, Loader } from '@coco-ui/core'
import { OutgoingApi } from 'api/OutgoingApi'
import { SupplierApi } from 'api/SupplierApi'
import clsx from 'clsx'
import { useFormatCurrency } from 'hooks/useFormatCurrency'
import Supplier from 'models/Supplier'
import { ReactNode, useMemo } from 'react'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { OUTGOING_ROUTES } from '../constants'
import OutgoingLinesTable from './OutgoingLinesTable'

type OnlyChildrenProps = {
  children: ReactNode
}

const DetailsTableRow = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dl className="grid md:grid-cols-12">{children}</dl>
)

const DetailsTableLeft = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dt className="md:col-span-6 border p-2 bg-primary-50 text-primary-700">{children}</dt>
)

const DetailsTableRight = ({ children }: OnlyChildrenProps): JSX.Element => (
  <dd className="md:col-span-6 p-2 border border-t-0 md:border-l-0 md:border-t">{children}</dd>
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

const Details = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const formatCurrency = useFormatCurrency()
  const { data: outgoing, isLoading } = useQuery(
    `outgoing-${id}`,
    () => OutgoingApi.findOneById(id),
    {
      enabled: !!id,
    },
  )
  const { data: suppliers } = useQuery(`suppliers`, SupplierApi.findAll, {
    staleTime: 6000,
  })

  const total = useMemo(
    () =>
      outgoing?.lines
        ? outgoing.lines.reduce((acc, line) => acc + line.totalHT * (1 - line.vat), 0)
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
                (Number(acc[line.supplierId ?? -1]) || 0) + line.totalHT * (1 - line.vat),
            }),
            {} as Record<number, number>,
          )
        : ({} as Record<number, number>),
    [outgoing],
  )

  return (
    <>
      <div className="grid md:grid-cols-12 md:items-center gap-2 mb-2 md:mb-4">
        <Link className="md:col-span-11" to={OUTGOING_ROUTES.routes.LIST.path}>
          <Button
            type="button"
            className="md:w-auto w-full"
            variant="inverted-primary"
            icon="arrow-left"
            iconSize={12}
            size="xs"
          >
            Retourner à la liste des livrets
          </Button>
        </Link>
        {outgoing ? (
          <Link to={OUTGOING_ROUTES.routes.FORM.path.replace(':id', outgoing.id)}>
            <Button
              className="mb-2 w-full md:w-auto"
              size="xs"
              iconSize={16}
              variant="info"
              icon="pencil"
            >
              Modifier
            </Button>
          </Link>
        ) : null}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-full gap-2">
          <Loader />
          Chargement du livret
        </div>
      ) : null}
      {outgoing ? (
        <div className="flex flex-col gap-2">
          <h1 className="border-b text-2xl text-primary-700 mb-4">
            Détail d&apos;un livret d&apos;achat
          </h1>
          <section className="md:pl-2">
            <h2 className="text-lg mb-2">Vue d&apos;ensemble</h2>
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
      ) : null}
    </>
  )
}

export default Details
