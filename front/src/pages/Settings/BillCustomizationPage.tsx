import { BillCustomizationApi } from '@/api/BillCustomizationApi'
import BillCustomization from '@/models/BillCustomization'
import BillCustomizationForm from './Forms/BillCustomizationForm'
import { useDataLoader } from '@scaleway/use-dataloader'

const BillCustomizationPage = () => {
  const billCustomizationQuery = useDataLoader('bill-customization', BillCustomizationApi.findMine)

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
