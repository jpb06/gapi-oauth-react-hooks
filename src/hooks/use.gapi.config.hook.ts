import { useMemo } from 'react';

import { GapiConfig } from '../logic/gapi.config.logic';

export const useGapiConfig = (): gapi.auth2.ClientConfig =>
  useMemo(
    () => ({
      client_id: GapiConfig.ClientId,
      cookie_policy: 'single_host_origin',
      fetch_basic_profile: true,
      ux_mode: 'redirect',
      scope: GapiConfig.Scope,
      redirect_uri: GapiConfig.RedirectUri,
    }),
    [],
  );
