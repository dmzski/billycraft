import { ProductApi } from 'api/ProductApi'
import { useQuery } from 'react-query'
import Loader from '../../components/Loader'
import ProductTable from './List'
import Product from '../../models/Product'

const ProductsPage = (): JSX.Element => {
  const productsQuery = useQuery('products', () => ProductApi.findAll(), {
    refetchOnWindowFocus: false,
  })
  return (
    <>
      <h2 className="text-3xl">Articles</h2>
      <p className="text-sm mt-1">
        Retrouvez ci-dessous la liste des articles que vous avez enregistrés. Vous pourrez les
        ajouter plus rapidement lors de la création de vos factures et devis.
      </p>
      <div className="flex-col justify-center mt-8 items-center">
        {productsQuery.isLoading ? (
          <div className="w-full flex justify-center">
            <Loader />
          </div>
        ) : null}
        {productsQuery.isError ? <div>Une erreur est survenue</div> : null}
        {productsQuery.data && !productsQuery.isLoading ? (
          <ProductTable
            products={productsQuery.data.sort((a: Product, b: Product) =>
              a.name.localeCompare(b.name),
            )}
          />
        ) : null}
      </div>
    </>
  )
}

export default ProductsPage
