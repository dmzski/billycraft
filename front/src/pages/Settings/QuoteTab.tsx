import { Loader } from '@coco-ui/core'
import { QuoteCustomizationApi } from 'api/QuoteCustomizationApi'
import { useQuery } from 'react-query'
import QuoteCustomizationForm from './Forms/QuoteCustomizationForm'

const QuoteTab = (): JSX.Element => {
  const quoteCustomizationQuery = useQuery('quote-customization', QuoteCustomizationApi.findMine, {
    refetchOnWindowFocus: false,
  })

  return (
    <div className="w-full flex justify-center flex-col items-center">
      {quoteCustomizationQuery.data && (
        <div className="w-full">
          <QuoteCustomizationForm quoteCustomization={quoteCustomizationQuery.data} />
        </div>
      )}
      {quoteCustomizationQuery.isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      )}
      {quoteCustomizationQuery.isError && <div>Une erreur est survenue</div>}
    </div>
  )
}

export default QuoteTab
