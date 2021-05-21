import fetchIntercept from "fetch-intercept";

let unregister: any;

function fetchRegister(token: string): any {
  fetchUnregister();
  unregister = fetchIntercept.register({
    request: function (url, config) {
      // Modify the url or config here
      if (!config.headers) {
        config.headers = {
          Authorization: "Bearer " + token,
        };
      } else {
        config.headers = {
          Authorization: "Bearer " + token,
          ...config.headers,
        };
      }
      return [url, config];
    },

    requestError: function (error) {
      // Called when an error occured during another 'request' interceptor call
      return Promise.reject(error);
    },

    response: function (response) {
      // Modify the reponse object
      return response;
    },

    responseError: function (error) {
      // Handle an fetch error
      return Promise.reject(error);
    },
  });
}

function fetchUnregister(): void {
  if (unregister) {
    unregister();
  }
}

export { fetchRegister, fetchUnregister };
