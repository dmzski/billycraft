import { OutgoingApi } from '@/api/OutgoingApi'
import { Button, Loader } from '@coco-ui/core'
import { ROUTES } from '@/routes'
import { Link } from 'react-router-dom'
import OutgoingList from '../List'
import { useDataLoader } from '@scaleway/use-dataloader'
import { useI18n } from '@/i18n'

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS

const ListPage = () => {
  const {t} = useI18n()
  const { data, isLoading } = useDataLoader(['outgoings'], () => OutgoingApi.findAll())

  return (
    <div>
      <div className="flex justify-between border-b my-4 pb-2 items-center">
        <h2 className="text-xl">{t('accounting.outgoings.pages.list.title')}</h2>
        <Link to={routes.FORM.path.replace(':id', 'new')}>
          <Button variant="primary">{t('accounting.outgoings.pages.list.add')}</Button>
        </Link>
      </div>
      {isLoading && !data ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {data ? <OutgoingList data={data} /> : null}
    </div>
  )
}

export default ListPage
