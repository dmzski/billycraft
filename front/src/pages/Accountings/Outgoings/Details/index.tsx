import { Button, Loader } from '@coco-ui/core'
import { OutgoingApi } from 'api/OutgoingApi'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { OUTGOING_ROUTES } from '../constants'
import OutgoingDetail from './OutgoingDetail'

const Details = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const { data: outgoing, isLoading } = useQuery(
    `outgoing-${id}`,
    () => OutgoingApi.findOneById(id),
    {
      enabled: !!id,
    },
  )

  return (
    <>
      <div className="grid md:grid-cols-12 md:items-center gap-2 mb-2 md:mb-4">
        <div className="md:col-span-11">
          <Link to={OUTGOING_ROUTES.routes.LIST.path}>
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
        </div>
        {outgoing ? (
          <div>
            <Link to={OUTGOING_ROUTES.routes.FORM.path.replace(':id', outgoing.id)}>
              <Button
                className="w-full md:w-auto"
                size="xs"
                iconSize={16}
                variant="info"
                icon="pencil"
              >
                Modifier
              </Button>
            </Link>
          </div>
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
          <OutgoingDetail outgoing={outgoing} />
        </div>
      ) : null}
    </>
  )
}

export default Details
