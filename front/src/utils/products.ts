import Product from "@/models/Product";

export type ProductFilters = Record<"type" | "name", string>

export const filterProducts = (products: Product[], filter: ProductFilters) => {
  let filtered = products
  if (filter.type) {
    filtered = filtered.filter(({type}) => type === filter.type)
  }
  if (filter.name) {
    filtered =  filtered.filter(({name}) => name.toLowerCase().includes(filter.name.toLowerCase()))
  }

  return filtered
}
