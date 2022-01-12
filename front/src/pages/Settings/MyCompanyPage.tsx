import { CompanyApi } from 'api/CompanyApi'
import { useQuery } from 'react-query'
import MyCompagnyForm from './Forms/MyCompagnyForm'

const MyCompanyPage = () => {
  const { data: company, refetch } = useQuery('my-company', CompanyApi.getMine, {
    refetchOnWindowFocus: false,
  })

  return (
    <div>
      {company ? (
        <MyCompagnyForm
          company={company}
          onSubmitSuccess={() => {
            refetch()
          }}
        />
      ) : null}
    </div>
  )
}

export default MyCompanyPage
