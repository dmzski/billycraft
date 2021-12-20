import { Button, Loader } from '@coco-ui/core'
import { SupplierApi } from 'api/SupplierApi'
import Supplier from 'models/Supplier'
import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { ROUTES } from 'routes'
import SupplierList from './List'
import SupplierModalForm from './modals/SupplierModalForm'

const Suppliers = () => {
  const { data, isLoading, refetch } = useQuery(['suppliers'], SupplierApi.findAll, {
    refetchOnWindowFocus: false,
  })
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [selected, setSelected] = useState<Supplier | undefined>()

  const handleCreate = useCallback(() => {
    setSelected({} as Supplier)
    history.push(ROUTES.SUPPLIERS_FORM.path.replace(':id', 'new'))
  }, [history])

  const handleClose = useCallback(() => {
    setSelected(undefined)
    history.push(ROUTES.SUPPLIERS.path)
  }, [history])

  const onSubmitSuccess = useCallback(
    (res: Supplier) => {
      refetch()
      if (id !== `${res.id}`) history.push(ROUTES.SUPPLIERS_FORM.path.replace(':id', `${res.id}`))
    },
    [refetch, history, id],
  )

  useEffect(() => {
    if (data && id && Number(id) > 0) {
      setSelected(data.find(({ id: supplierId }) => supplierId === Number(id)))
    }
  }, [id, data])

  return (
    <>
      <div className="flex mb-4">
        <h2 className="text-3xl flex-grow">Fournisseurs</h2>
        <Button variant="primary" onClick={handleCreate}>
          Créer un fournisseur
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading && data && data.length > 0 ? <SupplierList data={data} /> : null}
      {!isLoading && (!data || data.length === 0) ? <div>Aucun fournisseur</div> : null}
      <SupplierModalForm
        isOpen={!!selected}
        onClose={handleClose}
        onSubmitSuccess={onSubmitSuccess}
        supplier={selected ?? ({} as Supplier)}
      />
    </>
  )
}

export default Suppliers
