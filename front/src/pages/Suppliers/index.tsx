import { Button, Loader } from '@coco-ui/core'
import { SupplierApi } from '@/api/SupplierApi'
import Supplier from '@/models/Supplier'
import SupplierList from './List'
import SupplierModalForm from './modals/SupplierModalForm'
import { useDataLoader } from '@scaleway/use-dataloader'

const Suppliers = () => {
  const { data, isLoading, reload } = useDataLoader(['suppliers'], SupplierApi.findAll)

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
