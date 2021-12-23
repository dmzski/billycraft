import React from 'react'
import { useQuery } from 'react-query'
import { OutgoingApi } from 'api/OutgoingApi'
import { Loader } from '@coco-ui/core'
import OutgoingList from '../List'

const ListPage = () => {
  const { data, isLoading } = useQuery(['outgoings'], OutgoingApi.findAll, {
    refetchOnWindowFocus: false,
  })

  return (
    <div>
      <h2 className="text-xl mb-4 pb-2 border-b">Tous vos livrets d&apos;achat</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading ? <OutgoingList data={data} /> : null}
    </div>
  )
}

export default ListPage
