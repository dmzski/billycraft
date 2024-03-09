import { Button, Icon, Loader } from '@coco-ui/core'
import { OutgoingApi } from '@/api/OutgoingApi'
import { Link, useParams } from 'react-router-dom'
import { OUTGOING_ROUTES } from '../constants'
import OutgoingDetail from './OutgoingDetail'
import { useDataLoader } from '@scaleway/use-dataloader'

const Details = () => {
  const { id } = useParams<{ id: string }>()
  const { data: outgoing, isLoading } = useDataLoader(
    ["outgoing", id],
    () => OutgoingApi.findOneById(id),
    {
      enabled: !!id,
    },
  )

  return (
    <>
      <div className="flex md:justify-between flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="md:col-span-11">
          <Link to={OUTGOING_ROUTES.routes.LIST.path}>
            <Button type="button" variant="ghost" size="xs">
              <Icon name="arrow-left" size={12} />
              &nbsp; Retourner à la liste des livrets
            </Button>
          </Link>
        </div>
        {outgoing ? (
          <div>
            <Link to={OUTGOING_ROUTES.routes.FORM.path.replace(':id', outgoing.id)}>
              <Button variant="info">
                <Icon name="pencil" size={16} />
                &nbsp; Modifier
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
