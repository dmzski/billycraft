import { Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import Quote from '.'
import QuoteForm from './Form'

const QuoteSwitch = () => (
  <Switch>
    <Route path={ROUTES.QUOTES.path} exact={ROUTES.QUOTES.exact} component={Quote} />
    <Route path={ROUTES.QUOTE_FORM.path} component={QuoteForm} />
  </Switch>
)

export default QuoteSwitch
