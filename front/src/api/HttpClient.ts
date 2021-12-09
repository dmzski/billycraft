type HTTPClientRequest<T> = Promise<T> & {
  cancel?: () => void
}

const defaultHeaders = {
  'Content-Type': 'application/json',
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

const transformBody = async <T>(res: Response): Promise<T | Response> => {
  if (
    res.headers.get('Content-type') === 'application/json' &&
    res.status >= 200 &&
    res.status < 300
  )
    return res.json() as Promise<T>
  if (res.status >= 400) throw res
  return res
}

export const HttpClient = {
  GET: <T = AnyType>(url: string, config?: RequestInit): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const promise = fetch(url, { signal, method: 'GET', ...config }).then(
      transformBody,
    ) as HTTPClientRequest<T>
    promise.cancel = controller.abort
    return promise
  },
  POST: <T = AnyType>(url: string, body?: BodyType, config?: RequestInit): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const promise = fetch(url, {
      ...config,
      signal,
      method: 'POST',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }).then(transformBody) as HTTPClientRequest<T>
    promise.cancel = controller.abort
    return promise
  },
  PUT: <T = AnyType>(url: string, body?: BodyType, config?: RequestInit): HTTPClientRequest<T> => {
    const controller = new AbortController()
    const { signal } = controller
    const promise = fetch(url, {
      ...config,
      signal,
      method: 'PUT',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }).then(transformBody) as HTTPClientRequest<T>
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
    const promise = fetch(url, {
      ...config,
      signal,
      method: 'PATCH',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }).then(transformBody) as HTTPClientRequest<T>
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
    const promise = fetch(url, {
      ...config,
      signal,
      method: 'DELETE',
      body: computeBody(body),
      headers: {
        ...defaultHeaders,
        ...config?.headers,
      },
    }).then(transformBody) as HTTPClientRequest<T>
    promise.cancel = controller.abort

    return promise
  },
}
