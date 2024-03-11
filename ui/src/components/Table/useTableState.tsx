import { useEffect, useState } from "react";

export type useTableStateProps<T extends object> = {
  data: T[]
  initialSort?: { field: keyof T; order: 'asc' | 'desc' }
}

export type useTableStateResult<T extends object> = {
  data: T[]
  sort?: { field: keyof T; order: 'asc' | 'desc' }
  onSort: (field: keyof T, order: 'asc' | 'desc') => void
}

const isNumber = (value: unknown): value is number => !Number.isNaN(value)

const sortData = <T extends object,>(data: T[], field: keyof T, order = 'asc') => {
  const sortedData = [
    ...data.sort((currentRow, nextRow) =>
      isNumber(currentRow[field]) && isNumber(nextRow[field])
        ? (currentRow[field] as number) - (nextRow[field] as number)
        : `${currentRow[field] as string ?? ""}`.localeCompare(nextRow[field] as string ?? "")
    ),
  ]

  return order === 'asc' ? sortedData : sortedData.reverse()
}

const useTableState = <T extends object,>({
  data,
  initialSort,
}: useTableStateProps<T>): useTableStateResult<T> => {
  const [state, setState] = useState({
    data,
    sort: initialSort,
  })

  const onSort = (field: keyof T, order: 'asc' | 'desc') => {
    setState({
      data: sortData(data, field, order),
      sort: {
        field,
        order,
      },
    })
  }

  useEffect(() => {
    setState({
      ...state,
      data: state.sort?.field
        ? sortData(data, state.sort.field, state.sort?.order)
        : data,
    })
  }, [data])

  return {
    ...state,
    onSort,
  }
}

export default useTableState
