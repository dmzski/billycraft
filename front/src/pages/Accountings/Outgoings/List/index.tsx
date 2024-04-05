import { OutgoingResponse } from '@/models/Outgoing'
import Row from './Row'
import { useI18n } from '@/i18n'

type ListProps = {
  data?: OutgoingResponse[]
}
const List = ({ data }: ListProps) => {
  const { t } = useI18n()

  return (
    <div>
      <div className="grid sm:grid-cols-12 gap-4 bg-base-200 p-4 rounded-t">
        <div className="col-span-3">{t('accounting.outgoings.list.headers.name')}</div>
        <div className="col-span-3">{t('accounting.outgoings.list.headers.startDate')}</div>
        <div className="col-span-3">{t('accounting.outgoings.list.headers.endDate')}</div>
        <div className="col-span-3">{t('accounting.outgoings.list.headers.itTotal')}</div>
      </div>
      {data && data.length > 0 ? (
        <div>
          {data.map(outgoing => (
            <Row outgoing={outgoing} key={outgoing.id} />
          ))}
        </div>
      ) : (
        <div>Aucun livret enregistré</div>
      )}
    </div>
  )
}

export default List
