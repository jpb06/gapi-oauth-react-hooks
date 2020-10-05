import { useEffect, useState } from "react";

import { gapiAuth2Init, gapiGetAuth2Instance, gapiLoad } from "../indirection/gapi.lib.indirection";
import { loadScript, removeScript } from "../logic/resource.loading.logic";
import { GapiState } from "../types/gapiState";
import { useGapiConfig } from "./use.gapi.config.hook";

interface GapiLoadingHookProps {
  state: GapiState;
  signedUser?: gapi.auth2.BasicProfile;
  authResponse?: gapi.auth2.AuthResponse;
  setState: React.Dispatch<React.SetStateAction<GapiState>>;
  setSignedUser: React.Dispatch<
    React.SetStateAction<gapi.auth2.BasicProfile | undefined>
  >;
  setAuthResponse: React.Dispatch<
    React.SetStateAction<gapi.auth2.AuthResponse | undefined>
  >;
}

export const useGapiLoading = (): GapiLoadingHookProps => {
  const config = useGapiConfig();
  const [state, setState] = useState<GapiState>("Loading");
  const [signedUser, setSignedUser] = useState<gapi.auth2.BasicProfile>();
  const [authResponse, setAuthResponse] = useState<gapi.auth2.AuthResponse>();

  const setSignedInUser = (auth: gapi.auth2.GoogleAuth) => {
    if (auth.isSignedIn.get()) {
      const currentUser = auth.currentUser.get();
      setAuthResponse(currentUser.getAuthResponse());
      setSignedUser(currentUser.getBasicProfile());
      setState("SignedIn");
    } else {
      setState("NotSignedIn");
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadScript(
      document,
      "google-login",
      "https://apis.google.com/js/api.js",
      () =>
        gapiLoad("auth2", async () => {
          const GoogleAuth = gapiGetAuth2Instance();
          if (!GoogleAuth) {
            gapiAuth2Init(config).then(
              (res) => setSignedInUser(res),
              (err) => setState("Errored")
            );
          } else {
            setSignedInUser(GoogleAuth);
          }
        })
    );

    return () => {
      isMounted = false;
      removeScript(document, "google-login");
    };
  }, [config]);

  return {
    state,
    signedUser,
    authResponse,
    setState,
    setSignedUser,
    setAuthResponse,
  };
};
