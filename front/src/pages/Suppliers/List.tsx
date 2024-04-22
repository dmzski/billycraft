import { Button } from '@coco-ui/core'
import Supplier from '@/models/Supplier'
import SupplierModalForm from './modals/SupplierModalForm'
import { PencilIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

type ListProps = {
  data: Supplier[]
  reloadData: () => Promise<void>
}
const List = ({ data, reloadData }: ListProps) => {
  const { scopedT } = useI18n()
  const pageT = scopedT('suppliers.list')
  return (
    <div>
      <div className="px-2 py-4 grid md:grid-cols-12 bg-base-200 rounded-t">
        <div>{pageT('headers.color')}</div>
        <div className="md:col-span-9">{pageT('headers.name')}</div>
        <div>{pageT('headers.vat')}</div>
        <div />
      </div>
      {data.map(supplier => (
        <div key={supplier.id} className="grid md:grid-cols-12 p-2 items-center border-b">
          <div>
            <div
              className="ml-4 w-6 h-6 rounded-full"
              style={{ backgroundColor: supplier.color }}
            />
          </div>
          <div className="md:col-span-9">{supplier.name}</div>
          <div>{supplier.vat}&nbsp;%</div>
          <div className="flex justify-end">
            <SupplierModalForm
              disclosure={
                <Button variant="primary" outline>
                  <PencilIcon className="w-4" />
                </Button>
              }
              onSubmitSuccess={reloadData}
              supplier={supplier}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default List
