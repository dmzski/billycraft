import { Button, Loader } from '@coco-ui/core'
import SupplierList from './List'
import SupplierModalForm from './modals/SupplierModalForm'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'

const Suppliers = () => {
  const { data, isLoading, reload } = useAllSuppliersQuery()

  const reloadData = async () => {
    await reload()
  }

  return (
    <>
      <div className="flex mb-4">
        <h2 className="text-3xl flex-grow">Fournisseurs</h2>
        <SupplierModalForm
          disclosure={<Button variant="primary">Créer un fournisseur</Button>}
          onSubmitSuccess={reloadData}
        />
      </div>
      {isLoading && !data ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading && data ? (
        <SupplierList reloadData={reloadData} data={data} />
      ) : null}
    </>
  )
}

export default Suppliers
