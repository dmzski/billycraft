import { Button, Icon } from '@coco-ui/core'
import clsx from 'clsx'
import Supplier from 'models/Supplier'
import { useHistory } from 'react-router-dom'
import { injectIdInPath, ROUTES } from 'routes'

type ListProps = {
  data: Supplier[]
}
const List = ({ data }: ListProps): JSX.Element => {
  const history = useHistory()
  return (
    <div>
      <div className="px-2 py-4 grid md:grid-cols-12 bg-base-200 rounded-t">
        <div>Couleur</div>
        <div className="md:col-span-9">Nom</div>
        <div>TVA</div>
        <div />
      </div>
      {data.map((supplier, index) => (
        <div
          className={clsx(
            'grid md:grid-cols-12 p-2 items-center',
            index % 2 !== 0 ? 'bg-base-200' : null,
          )}
        >
          <div>
            <div
              className="ml-4 w-6 h-6 rounded-full"
              style={{ backgroundColor: supplier.color }}
            />
          </div>
          <div className="md:col-span-9">{supplier.name}</div>
          <div>{supplier.vat}&nbsp;%</div>
          <div className="flex">
            <Button
              onClick={() => {
                history.push(injectIdInPath(ROUTES.SUPPLIERS_FORM.path, supplier.id))
              }}
              size="sm"
              variant="info"
            >
              <Icon name="pencil" />
              &nbsp; Modifier
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default List
