import { Loader } from '@coco-ui/core'
import QuoteCustomization from '@/models/QuoteCustomization'
import QuoteCustomizationForm from './Forms/QuoteCustomizationForm'
import { useMyQuoteCustomizationQuery } from '@/queries/useMyQuoteCustomizationQuery'

const QuoteCustomizationPage = () => {
  const { data: quoteCustomization, isLoading } = useMyQuoteCustomizationQuery()

  return (
    <div className="w-full flex justify-center flex-col items-center">
      {!isLoading ? (
        <div className="w-full">
          <QuoteCustomizationForm
            quoteCustomization={quoteCustomization ?? ({} as QuoteCustomization)}
          />
        </div>
      ) : null}
      {isLoading && !quoteCustomization ? (
        <div className="mt-4 flex justify-center">
          <Loader />
        </div>
      ) : null}
    </div>
  )
}

export default QuoteCustomizationPage
