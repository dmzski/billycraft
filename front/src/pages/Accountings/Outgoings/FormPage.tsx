import { Button, Loader } from '@coco-ui/core'
import { OutgoingApi } from 'api/OutgoingApi'
import { useCallback } from 'react'
import { useQuery, useQueryCache } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from 'routes'
import OutgoingForm from './Form'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

const FormPage = () => {
  const { id } = useParams<{ id: string }>()
  const queryCache = useQueryCache()
  const { data, isLoading, refetch } = useQuery(
    ['outgoings', id],
    () => OutgoingApi.findOneById(id),
    {
      refetchOnWindowFocus: false,
      enabled: id !== 'new',
    },
  )

  const onSubmitSuccess = useCallback(() => {
    refetch()
    queryCache.invalidateQueries('outgoings')
  }, [refetch])
  return (
    <div>
      <Link to={routes.LIST.path}>
        <Button type="button" size="xs" variant="inverted-primary">
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
