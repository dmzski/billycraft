import { Button } from '@coco-ui/core'
import { ReportApi } from '@/api/ReportApi'
import List from './components/List'
import CreateReportModal from './modals/CreateReportModal'
import { useDataLoader } from '@scaleway/use-dataloader'
import { useI18n } from '@/i18n'

const ListPage = () => {
  const {t} = useI18n()
  const { data, reload } = useDataLoader(['reports', 'all'], () => ReportApi.findAll())

  return (
    <div className='flex flex-col gap-5'>
      <div className="flex items-center pb-2 border-b">
        <h2 className="text-2xl flex-grow">{t('accounting.reports.list.title')}</h2>
        <CreateReportModal
          disclosure={
            <Button variant="primary">{t('accounting.reports.list.create')}</Button>
          }
          onSubmitSuccess={reload}
        />
      </div>
      {data ? (
        <div>
          <List reports={data} />
        </div>
      ) : null}
    </div>
  )
}

export default ListPage
