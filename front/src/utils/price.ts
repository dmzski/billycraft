export function roundTwoDecimals(aPrice: number): number {
  return Math.round(aPrice * 100) / 100
}

export function calculatePriceTTC(price?: number | string | null, tva = 0): number {
  if (!price) {
    return 0
  }
  const typedPrice = parseFloat(`${price}`)
  const computedVat = tva / 100
  return roundTwoDecimals(typedPrice * (1 + computedVat))
}

export function calculatePriceET(price?: number | string | null): number {
  if (!price) {
    return 0
  }
  return roundTwoDecimals(Number(price))
}

export function calculatePriceETFromIT(price?: number | string | null, tva = 0): number {
  if (!price) {
    return 0
  }
  const typedPrice = parseFloat(`${price}`)
  const computedVat = tva / 100

  return roundTwoDecimals(typedPrice / (1 + computedVat))
}
