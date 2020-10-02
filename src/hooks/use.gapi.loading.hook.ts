import { useEffect, useState } from "react";

import { loadScript, removeScript } from "../logic/resource.loading.logic";
import { GapiState } from "../types/gapiState";
import { useGapiConfig } from "./use.gapi.config.hook";

export const useGapiLoading = () => {
  const config = useGapiConfig();
  const [state, setState] = useState<GapiState>("Loading");
  const [user, setUser] = useState<gapi.auth2.BasicProfile>();

  const setSignedInUser = (gapi: gapi.auth2.GoogleAuth, isMounted: boolean) => {
    if (!isMounted) return;

    if (gapi.isSignedIn.get()) {
      setUser(gapi.currentUser.get().getBasicProfile());
      setState("SignedIn");
    } else {
      setState("NotSignedIn");
    }
  };

  useEffect(() => {
    console.log("gapi loading use effect", config);
    let isMounted = true;
    loadScript(
      document,
      "google-login",
      "https://apis.google.com/js/api.js",
      () => {
        window.gapi.load("auth2", () => {
          const GoogleAuth = window.gapi.auth2.getAuthInstance();
          if (!GoogleAuth) {
            window.gapi.auth2.init(config).then(
              (res) => setSignedInUser(res, isMounted),
              (err) => setState("Errored")
            );
          } else {
            setSignedInUser(GoogleAuth, isMounted);
          }
        });
      }
    );

    return () => {
      isMounted = false;
      removeScript(document, "google-login");
    };
  }, [config]);

  return [state, user, setUser, setState] as const;
};
