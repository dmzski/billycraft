import { sendErrorToSentry } from '@/utils/errors'

type HTTPClientRequest<T> = Promise<T> & {
  cancel?: () => void
}

const defaultHeaders = {
  'Content-Type': 'application/json',
}

const defaultConfig: RequestInit = {
  credentials: 'include',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any
type BodyType = AnyType

const computeBody = (body: BodyType): string | File | FormData | undefined => {
  if (!body) return undefined

  if (
    typeof body === 'string' ||
    (body as File).stream ||
    typeof (body as FormData).getAll === 'function'
  )
    return body

  return JSON.stringify(body)
}

const handleFetchResponse =
  <T>(request: RequestInit) =>
  async (res: Response): Promise<T | Response> => {
    if (!res.ok) {
      const error = new Error(`${request.method} - ${res.status} - ${res.statusText} - ${res.url}`)

      const extras = {
        requestBody: request.body,
        requestMethod: request.method,
        requestUrl: res.url,
        responseStatusText: res.statusText,
        responseStatus: res.status,
        responseBody: await (res.headers.get('Content-type') === 'application/json'
          ? res.json()
          : res.text()),
      }

      sendErrorToSentry(error, extras)
      throw error
    }

    if (res.headers.get('Content-type') === 'application/json') {
      return res.json() as Promise<T>
    }

    return res
  }

export const HttpClient = {
  GET: <T = AnyType>(url: string, config?: RequestInit): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const request = {
      signal,
      method: 'GET',
      ...defaultConfig,
      ...config,
    }
    const promise = fetch(url, request).then(handleFetchResponse(request)) as HTTPClientRequest<T>
    promise.cancel = controller.abort
    return promise
  },
  POST: <T = AnyType>(url: string, body?: BodyType, config?: RequestInit): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const request = {
      ...defaultConfig,
      ...config,
      signal,
      method: 'POST',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }
    const promise = fetch(url, request).then(handleFetchResponse(request)) as HTTPClientRequest<T>
    promise.cancel = controller.abort
    return promise
  },
  PUT: <T = AnyType>(url: string, body?: BodyType, config?: RequestInit): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const request = {
      ...defaultConfig,
      ...config,
      signal,
      method: 'PUT',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }
    const promise = fetch(url, request).then(handleFetchResponse(request)) as HTTPClientRequest<T>
    promise.cancel = controller.abort
    return promise
  },
  PATCH: <T = AnyType>(
    url: string,
    body?: BodyType,
    config?: RequestInit,
  ): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const request = {
      ...defaultConfig,
      ...config,
      signal,
      method: 'PATCH',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }
    const promise = fetch(url, request).then(handleFetchResponse(request)) as HTTPClientRequest<T>
    promise.cancel = controller.abort
    return promise
  },
  DELETE: <T = AnyType>(
    url: string,
    body?: BodyType,
    config?: RequestInit,
  ): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const request = {
      ...defaultConfig,
      ...config,
      signal,
      method: 'DELETE',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }
    const promise = fetch(url, request).then(handleFetchResponse(request)) as HTTPClientRequest<T>
    promise.cancel = controller.abort

    return promise
  },
}
