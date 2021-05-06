import { act, renderHook } from '@testing-library/react-hooks';

import { GapiConfig } from '../logic/gapi.config.logic';
import { useGapiConfig } from './use.gapi.config.hook';

describe('useGapiConfig hook', () => {
  it('should return the gapi config', () => {
    const clientId = 'Yolo';
    const scope = 'profile';
    const redirectUrl = 'http://localhost:3000';
    GapiConfig.setup(clientId, scope, redirectUrl);

    const { result } = renderHook(() => useGapiConfig());

    expect(result.current.client_id).toBe(clientId);
    expect(result.current.cookie_policy).toBe('single_host_origin');
    expect(result.current.fetch_basic_profile).toBe(true);
    expect(result.current.ux_mode).toBe('redirect');
    expect(result.current.scope).toBe(scope);
    expect(result.current.redirect_uri).toBe(redirectUrl);
  });
});
