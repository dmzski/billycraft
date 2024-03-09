import { Loader } from '@coco-ui/core'
import { QuoteCustomizationApi } from '@/api/QuoteCustomizationApi'
import QuoteCustomization from '@/models/QuoteCustomization'
import QuoteCustomizationForm from './Forms/QuoteCustomizationForm'
import { useDataLoader } from '@scaleway/use-dataloader'

const QuoteCustomizationPage = () => {
  const quoteCustomizationQuery = useDataLoader('quote-customization', QuoteCustomizationApi.findMine)

  return (
    <div className="w-full flex justify-center flex-col items-center">
      {!quoteCustomizationQuery.isLoading ? (
        <div className="w-full">
          <QuoteCustomizationForm
            quoteCustomization={quoteCustomizationQuery.data ?? ({} as QuoteCustomization)}
          />
        </div>
      ) : null}
      {quoteCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default QuoteCustomizationPage
