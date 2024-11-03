import { Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import ListPage from './ListPage'
import GroupsPage from './GroupsPage'
import { ReactNode } from 'react'

const { routes } = ROUTES.PRODUCTS

type ProductLayoutProps = {
  children: ReactNode
}

const ProductsLayout = ({ children }: ProductLayoutProps) => {

  return (
    <div className="flex flex-col gap-12">
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
