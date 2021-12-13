import { Loader } from '@coco-ui/core'
import { BillCustomizationApi } from 'api/BillCustomizationApi'
import { useQuery } from 'react-query'
import BillCustomizationForm from './Forms/BillCustomizationForm'

const BillTab = (): JSX.Element => {
  const billCustomizationQuery = useQuery('bill-customization', BillCustomizationApi.findMine, {
    refetchOnWindowFocus: false,
  })

  return (
    <div className="w-full">
      {billCustomizationQuery.data && (
        <div>
          <BillCustomizationForm billCustomization={billCustomizationQuery.data} />
        </div>
      )}
      {billCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      )}
      {billCustomizationQuery.isError && <div>Une erreur est survenue</div>}
    </div>
  )
}

export default BillTab
