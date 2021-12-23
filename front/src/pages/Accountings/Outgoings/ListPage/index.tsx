import { useQuery } from 'react-query'
import { OutgoingApi } from 'api/OutgoingApi'
import { Button, Loader } from '@coco-ui/core'
import { ROUTES } from 'routes'
import { Link } from 'react-router-dom'
import OutgoingList from '../List'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

const ListPage = () => {
  const { data, isLoading } = useQuery(['outgoings'], OutgoingApi.findAll, {
    refetchOnWindowFocus: false,
  })

  return (
    <div>
      <div className="flex justify-between border-b my-4 pb-2 items-center">
        <h2 className="text-xl">Tous vos livrets d&apos;achat</h2>
        <Link to={routes.FORM.path.replace(':id', 'new')}>
          <Button>Ajouter un livret d&apos;achat</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading ? <OutgoingList data={data} /> : null}
    </div>
  )
}

export default ListPage
