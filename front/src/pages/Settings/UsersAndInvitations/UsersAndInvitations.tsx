import { useI18n } from '@/i18n'
import { ROUTES } from '@/routes'
import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { Users } from './Users'
import { Invitations } from './Invitations'

export const UsersAndInvitations = () => {
  const { scopedT } = useI18n()

  const pageT = scopedT('settings.users')

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">{pageT('title')}</h1>
      <div role="tablist" className="tabs tabs-bordered">
        <NavLink
          role="tab"
          className="tab"
          activeClassName="tab-active"
          to={ROUTES.SETTINGS.routes.USERS.routes.USERS.path()}
        >
          {pageT('tabs.users')}
        </NavLink>
        <NavLink
          role="tab"
          className="tab"
          activeClassName="tab-active"
          to={ROUTES.SETTINGS.routes.USERS.routes.INVITATIONS.path()}
        >
          {pageT('tabs.invitations')}
        </NavLink>
      </div>
      <Switch>
        <Route path={ROUTES.SETTINGS.routes.USERS.routes.USERS.path()} component={Users} />
        <Route
          path={ROUTES.SETTINGS.routes.USERS.routes.INVITATIONS.path()}
          component={Invitations}
        />
        <Route render={() => <Redirect to={ROUTES.SETTINGS.routes.USERS.routes.USERS.path()} />} />
      </Switch>
    </div>
  )
}
