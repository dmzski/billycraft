import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { HISTORY_ROUTES } from '../constant'
import HistoryTab from './HistoryTab'
import RefusedTab from './RefusedTab'
import { useI18n } from '@/i18n'

const QUOTE_ROUTES = HISTORY_ROUTES.QUOTES.routes
const QuoteSwitch = () => {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">{t('history.tabs.quote.title')}</h1>
      <div className="tabs tabs-boxed">
        <NavLink
          activeClassName="tab-active"
          to={QUOTE_ROUTES.ARCHIVED.path}
          className="tab flex-grow"
        >
          {t('history.tabs.quote.links.archived')}
        </NavLink>
        <NavLink
          activeClassName="tab-active"
          to={QUOTE_ROUTES.REFUSED.path}
          className="tab flex-grow"
        >
          {t('history.tabs.quote.links.refused')}
        </NavLink>
      </div>
      <Switch>
        <Route path={QUOTE_ROUTES.ARCHIVED.path} component={HistoryTab} />
        <Route path={QUOTE_ROUTES.REFUSED.path} component={RefusedTab} />
        <Route render={() => <Redirect to={QUOTE_ROUTES.ARCHIVED.path} />} />
      </Switch>
    </div>
  )
}

export default QuoteSwitch
