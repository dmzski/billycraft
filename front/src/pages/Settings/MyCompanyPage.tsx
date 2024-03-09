import { CompanyApi } from '@/api/CompanyApi'
import MyCompagnyForm from './Forms/MyCompagnyForm'
import { useDataLoader } from '@scaleway/use-dataloader'

const MyCompanyPage = () => {
  const { data: company, reload } = useDataLoader('my-company', CompanyApi.getMine)

  return (
    <div>
      {company ? (
        <MyCompagnyForm
          company={company}
          onSubmitSuccess={async () => {
            await reload()
          }}
        />
      ) : null}
    </div>
  )
}

export default MyCompanyPage
