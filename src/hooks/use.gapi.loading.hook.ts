import { useEffect, useState } from 'react';

import {
  gapiAuth2Init,
  gapiGetAuth2Instance,
  gapiLoad,
} from '../indirection/gapi.lib.indirection';
import { asPlainObject } from '../logic/conversion.logic';
import { loadScript, removeScript } from '../logic/resource.loading.logic';
import { GapiState } from '../types/gapiState';
import { UserProfile } from '../types/user.profile';
import { useGapiConfig } from './use.gapi.config.hook';

interface GapiLoadingHookProps {
  state: GapiState;
  signedUser?: UserProfile;
  authResponse?: gapi.auth2.AuthResponse;
  setState: React.Dispatch<React.SetStateAction<GapiState>>;
  setSignedUser: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
  setAuthResponse: React.Dispatch<
    React.SetStateAction<gapi.auth2.AuthResponse | undefined>
  >;
}

export const useGapiLoading = (): GapiLoadingHookProps => {
  const config = useGapiConfig();
  const [state, setState] = useState<GapiState>('Loading');
  const [signedUser, setSignedUser] = useState<UserProfile>();
  const [authResponse, setAuthResponse] = useState<gapi.auth2.AuthResponse>();

  const setSignedInUser = (auth: gapi.auth2.GoogleAuth) => {
    if (auth.isSignedIn.get()) {
      const currentUser = auth.currentUser.get();
      setAuthResponse(currentUser.getAuthResponse());
      setSignedUser(asPlainObject(currentUser.getBasicProfile()));
      setState('SignedIn');
    } else {
      setState('NotSignedIn');
    }
  };

  useEffect(() => {
    loadScript(
      document,
      'google-login',
      'https://apis.google.com/js/api.js',
      () =>
        gapiLoad('auth2', async () => {
          const GoogleAuth = gapiGetAuth2Instance();
          if (!GoogleAuth) {
            gapiAuth2Init(config).then(
              (res) => setSignedInUser(res),
              (_) => setState('Errored'),
            );
          } else {
            setSignedInUser(GoogleAuth);
          }
        }),
    );

    return () => {
      removeScript(document, 'google-login');
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
