import { BillCustomizationApi } from 'api/BillCustomizationApi'
import BillCustomization from 'models/BillCustomization'
import { useQuery } from 'react-query'
import BillCustomizationForm from './Forms/BillCustomizationForm'

const BillCustomizationPage = () => {
  const billCustomizationQuery = useQuery('bill-customization', BillCustomizationApi.findMine, {
    refetchOnWindowFocus: false,
  })

  return (
    <div className="w-full">
      <div>
        <BillCustomizationForm
          billCustomization={billCustomizationQuery.data ?? ({} as BillCustomization)}
        />
      </div>
    </div>
  )
}

export default BillCustomizationPage
