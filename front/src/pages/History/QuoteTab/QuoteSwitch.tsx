import { Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from '../constant'
import HistoryTab from './HistoryTab'
import RefusedTab from './RefusedTab'
import { useI18n } from '@/i18n'
import { Tabs } from '@coco-ui/core'
import { RRTab } from '@/components/RRTab'

const QUOTE_ROUTES = HISTORY_ROUTES.QUOTES.routes
const QuoteSwitch = () => {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl">{t('history.tabs.quote.title')}</h1>
      <div>
        <Tabs>
          <RRTab to={QUOTE_ROUTES.ARCHIVED.path()}>{t('history.tabs.quote.links.archived')}</RRTab>
          <RRTab to={QUOTE_ROUTES.REFUSED.path()}>{t('history.tabs.quote.links.refused')}</RRTab>
        </Tabs>
      </div>
      <Switch>
        <Route path={QUOTE_ROUTES.ARCHIVED.path()} component={HistoryTab} />
        <Route path={QUOTE_ROUTES.REFUSED.path()} component={RefusedTab} />
        <Route render={() => <Redirect to={QUOTE_ROUTES.ARCHIVED.path()} />} />
      </Switch>
    </div>
  )
}

export default QuoteSwitch
