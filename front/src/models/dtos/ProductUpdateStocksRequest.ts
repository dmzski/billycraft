export type ProductUpdateStocksRequest = {
  in: {
    productId: string
    quantity: number
  }[]
  out: {
    productId: string
    quantity: number
  }[]
}
