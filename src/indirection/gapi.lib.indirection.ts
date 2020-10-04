export const gapiLoad = (apiName: string, callback: () => void) =>
  window.gapi.load(apiName, callback);

export const gapiAuth2Init = (params: gapi.auth2.ClientConfig) =>
  window.gapi.auth2.init(params);
export const gapiGetAuth2Instance = () => window.gapi.auth2.getAuthInstance();
