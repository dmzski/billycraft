export const HttpClient = {
  GET: (url: string, config?: RequestInit): { query: any; abort: () => void } => {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, ...config }) as any, abort: () => controller.abort() };
  },
  POST: (url: string, body: any, config?: any): { query: any; abort: () => void } => {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "POST", body, ...config }) as any, abort: () => controller.abort() };
  },
  PUT: (url: string, body: any, config?: any): { query: any; abort: () => void } => {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "PUT", body, ...config }) as any, abort: () => controller.abort() };
  },
  PATCH: (url: string, body: any, config?: any): { query: any; abort: () => void } => {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "PATCH", body, ...config }) as any, abort: () => controller.abort() };
  },
  DELETE: (url: string, body: any, config?: any): { query: any; abort: () => void } => {
    const controller = new AbortController();
    const signal = controller.signal;
    return { query: fetch(url, { signal, method: "DELETE", body, ...config }) as any, abort: () => controller.abort() };
  },
};
