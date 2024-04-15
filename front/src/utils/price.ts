
export function calculatePriceTTC(price?: number | string | null, tva = 0): number {
  if (!price) {
    return 0
  }
  const finalPrice = Number(`${price}`)
  return Number((finalPrice + finalPrice * (tva / 100)).toFixed(2))
}

export function calculatePriceET(price?: number | string | null): number {
  if (!price) {
    return 0
  }
  const finalPrice = Number(`${price}`).toFixed(2)
  return Number(finalPrice)
}
