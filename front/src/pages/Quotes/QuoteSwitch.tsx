import { Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import Quote from '.'
import { Create } from './Create/Create'
import { Edit } from './Edit/Edit'

const QuoteSwitch = () => (
  <Switch>
    <Route path={ROUTES.QUOTES.path} exact={ROUTES.QUOTES.exact} component={Quote} />
    <Route path={ROUTES.QUOTE_EDIT.path} component={Edit} />
    <Route path={ROUTES.QUOTE_ADD.path} component={Create} />
  </Switch>
)

export default QuoteSwitch
