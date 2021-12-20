import { Button } from '@coco-ui/core'
import Supplier from 'models/Supplier'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'routes'

type ListProps = {
  data: Supplier[]
}
const List = ({ data }: ListProps): JSX.Element => {
  const history = useHistory()
  return (
    <div>
      <div className="flex pb-2 p-2 font-bold border-b">
        <div className="w-20 mr-2">Couleur</div>
        <div className="flex-grow">Nom</div>
      </div>
      {data.map((supplier, index) => (
        <div
          className={`flex items-center border-b p-2 ${
            index % 2 === 0 ? 'bg-background' : 'bg-gray-100'
          }`}
        >
          <div className="w-20 mr-2">
            <div
              className="ml-4 w-6 h-6 rounded-full"
              style={{ backgroundColor: supplier.color }}
            />
          </div>
          <div className="flex-grow">{supplier.name}</div>
          <div className="flex">
            <Button
              onClick={() => {
                history.push(ROUTES.SUPPLIERS_FORM.path.replace(':id', `${supplier.id}`))
              }}
              size="sm"
              iconSize={14}
              icon="pencil"
              variant="info"
            >
              Modifier
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default List
