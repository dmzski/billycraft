export const HttpClient = {
  GET: function (url: string, config?: RequestInit) {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, ...config }) as any, abort: () => controller.abort() };
  },
  POST: function (url: string, body: any, config?: any) {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "POST", body, ...config }) as any, abort: () => controller.abort() };
  },
  PUT: function (url: string, body: any, config?: any) {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "PUT", body, ...config }) as any, abort: () => controller.abort() };
  },
  PATCH: function (url: string, body: any, config?: any) {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "PATCH", body, ...config }) as any, abort: () => controller.abort() };
  },
  DELETE: function (url: string, body: any, config?: any) {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "DELETE", body, ...config }) as any, abort: () => controller.abort() };
  },
};
