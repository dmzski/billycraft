import fetchIntercept from 'fetch-intercept'

let unregister: () => void

function fetchUnregister(): void {
  if (unregister) {
    unregister()
  }
}

function fetchRegister(token: string): void {
  fetchUnregister()
  unregister = fetchIntercept.register({
    request(url, baseConfig) {
      const config = { ...baseConfig }
      // Modify the url or config here
      if (!config.headers) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        }
      } else {
        config.headers = {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        }
      }
      return [url, config]
    },

    requestError(error) {
      // Called when an error occured during another 'request' interceptor call
      return Promise.reject(error)
    },

    response(response) {
      // Modify the reponse object
      return response
    },

    responseError(error) {
      // Handle an fetch error
      return Promise.reject(error)
    },
  })
}

export { fetchRegister, fetchUnregister }
