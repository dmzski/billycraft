import { NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import ListPage from './ListPage'
import GroupsPage from './GroupsPage'
import { useI18n } from '@/i18n'
import { ReactNode } from 'react'

const { routes } = ROUTES.PRODUCTS

type ProductLayoutProps = {
  children: ReactNode
}

const ProductsLayout = ({ children }: ProductLayoutProps) => {
  const { scopedT } = useI18n()
  const pageT = scopedT('products')

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl mb-4">{pageT('title')}</h1>
        <div className="tabs tabs-bordered">
          <NavLink activeClassName="tab-active" to={routes.LIST.path} className="tab flex-grow">
            {pageT('tabs.list')}
          </NavLink>
          <NavLink activeClassName="tab-active" to={routes.GROUPS.path} className="tab flex-grow">
            {pageT('tabs.groups')}
          </NavLink>
        </div>
      </div>
      {children}
    </div>
  )
}
const ProductsSwitch = () => (
  <Switch>
    <Route
      path={routes.LIST.path()}
      exact={routes.LIST.exact}
      render={() => (
        <ProductsLayout>
          <ListPage />
        </ProductsLayout>
      )}
    />
    <Route
      path={routes.GROUPS.path()}
      exact={routes.GROUPS.exact}
      render={() => (
        <ProductsLayout>
          <GroupsPage />
        </ProductsLayout>
      )}
    />
    <Route>
      <Redirect to={routes.LIST.path()} />
    </Route>
  </Switch>
)

export default ProductsSwitch
