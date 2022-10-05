import { Loader } from '@coco-ui/core'
import { QuoteCustomizationApi } from 'api/QuoteCustomizationApi'
import QuoteCustomization from 'models/QuoteCustomization'
import { useQuery } from 'react-query'
import QuoteCustomizationForm from './Forms/QuoteCustomizationForm'

const QuoteCustomizationPage = (): JSX.Element => {
  const quoteCustomizationQuery = useQuery('quote-customization', QuoteCustomizationApi.findMine, {
    refetchOnWindowFocus: false,
  })

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
