import { Button, Loader } from '@coco-ui/core'
import { SupplierApi } from 'api/SupplierApi'
import Supplier from 'models/Supplier'
import { useQuery } from 'react-query'
import SupplierList from './List'
import SupplierModalForm from './modals/SupplierModalForm'

const Suppliers = () => {
  const { data, isLoading, refetch } = useQuery(['suppliers'], SupplierApi.findAll, {
    refetchOnWindowFocus: false,
  })

  const reloadData = async () => {
    await refetch()
  }

  return (
    <>
      <div className="flex mb-4">
        <h2 className="text-3xl flex-grow">Fournisseurs</h2>
        <SupplierModalForm
          disclosure={<Button variant="primary">Créer un fournisseur</Button>}
          onSubmitSuccess={reloadData}
          supplier={{} as Supplier}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading && data && data.length > 0 ? (
        <SupplierList reloadData={reloadData} data={data} />
      ) : null}
      {!isLoading && (!data || data.length === 0) ? <div>Aucun fournisseur</div> : null}
    </>
  )
}

export default Suppliers
