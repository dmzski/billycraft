import { Button, Loader } from '@coco-ui/core'
import { OutgoingApi } from '@/api/OutgoingApi'
import { useCallback } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { injectIdInPath, ROUTES } from '@/routes'
import { OutgoingResponse } from '@/models/Outgoing'
import OutgoingForm from './Form'
import { useDataLoader } from '@scaleway/use-dataloader'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

const FormPage = () => {
  const { id } = useParams<{ id: string }>()
  const { push } = useHistory()
  const { data, isLoading } = useDataLoader(['outgoings', id], () => OutgoingApi.findOneById(id), {
    enabled: id !== 'new',
  })

  const onSubmitSuccess = useCallback((res: OutgoingResponse) => {
    push(injectIdInPath(routes.DETAILS.path, res.id))
  }, [push])

  return (
    <div>
      <Link to={routes.LIST.path}>
        <Button type="button" size="xs" variant="ghost">
          Retourner à la liste des livrets d&apos;achats
        </Button>
      </Link>
      <div className="border-b py-2 my-4">
        <h1 className="text-2xl">
          {id !== 'new' ? "Modification d'un livret d'achat" : "Création d'un livret d'achat"}
        </h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <OutgoingForm
          onSubmitSuccess={onSubmitSuccess}
          disabledFields={id !== 'new' ? ['startDate'] : undefined}
          outgoing={data}
        />
      )}
    </div>
  )
}

export default FormPage
