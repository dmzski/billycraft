export const BASE_API_URL = ((window as unknown) as Window & { API_URL: string }).API_URL
export const API_URL = BASE_API_URL
export const GRAPHQL_URL = `${BASE_API_URL}/graphql`

export const VERSION = '2.0.0'
export const DISPLAY_NEWS = false
