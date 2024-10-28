import { Redirect, Route, Switch } from 'react-router-dom'
import { ROUTES } from '@/routes'
import ListPage from './ListPage'
import GroupsPage from './GroupsPage'
import { useI18n } from '@/i18n'
import { ReactNode } from 'react'
import { Tabs } from '@coco-ui/core'
import { RRTab } from '@/components/RRTab'

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
        <div>
          <Tabs>
            <RRTab to={routes.LIST.path()}>{pageT('tabs.list')}</RRTab>
            <RRTab to={routes.GROUPS.path()}>{pageT('tabs.groups')}</RRTab>
          </Tabs>
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
