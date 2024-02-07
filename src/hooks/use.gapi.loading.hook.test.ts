import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

import { useGapiLoading } from './use.gapi.loading.hook';
import {
  gapiAuth2Init,
  gapiGetAuth2Instance,
  gapiLoad,
} from '../indirection/gapi.lib.indirection';
import { loadScript, removeScript } from '../logic/resource.loading.logic';
import { mockedAuthResponse } from '../tests-related/mocks/data/mocked.auth.response.data';
import { mockedUser } from '../tests-related/mocks/data/mocked.user.data';
import { mockGoogleAuth } from '../tests-related/mocks/gapi/auth2.google.auth.mock';

vi.mock('../logic/resource.loading.logic');
vi.mock('../indirection/gapi.lib.indirection');

describe('useGapiLoading hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should have loading as its default state', () => {
    const { result } = renderHook(() => useGapiLoading());

    expect(result.current.state).toBe('Loading');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should call loadScript once', () => {
    renderHook(() => useGapiLoading());

    expect(vi.mocked(loadScript)).toHaveBeenCalledTimes(1);
  });

  it('should call removeScript once if component unmounts', () => {
    renderHook(() => useGapiLoading()).unmount();

    expect(vi.mocked(loadScript)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(removeScript)).toHaveBeenCalledTimes(1);
  });

  it('should initialize auth2 if the auth instance does not exist after load', () => {
    vi.mocked(loadScript).mockImplementationOnce(
      (document, id, jsSrc, callback) => callback(),
    );
    vi.mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(
      () => null as unknown as gapi.auth2.GoogleAuth,
    );
    vi.mocked(gapiAuth2Init).mockReturnValueOnce(mockGoogleAuth(false));

    const { result } = renderHook(() => useGapiLoading());

    expect(vi.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should initialize auth2 and set the current user if he is signed in', () => {
    vi.mocked(loadScript).mockImplementationOnce(
      (document, id, jsSrc, callback) => callback(),
    );
    vi.mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, mockedAuthResponse),
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(vi.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('SignedIn');
    expect(result.current.signedUser).not.toBeUndefined();
    expect(result.current.signedUser).toEqual(mockedUser);
    expect(result.current.authResponse).toMatchObject(mockedAuthResponse);
  });

  it('should set the user as not signed in', () => {
    vi.mocked(loadScript).mockImplementationOnce(
      (document, id, jsSrc, callback) => callback(),
    );
    vi.mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(false),
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(vi.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('NotSignedIn');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should report on gapi errors', () => {
    vi.mocked(loadScript).mockImplementationOnce(
      (document, id, jsSrc, callback) => callback(),
    );
    vi.mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(
      () => null as unknown as gapi.auth2.GoogleAuth,
    );
    const thenFn = (_: Mock, err: Mock) => {
      err();
    };
    vi.mocked(gapiAuth2Init).mockImplementationOnce(() =>
      mockGoogleAuth(false, undefined, undefined, thenFn),
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(vi.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('Errored');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should set state as errored when script failed to load', () => {
    vi.mocked(loadScript).mockImplementationOnce(
      (document, id, jsSrc, callback, err) => err(),
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(result.current.state).toBe('Errored');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should call setSignedInUser on init', () => {
    vi.mocked(loadScript).mockImplementationOnce(
      (document, id, jsSrc, callback) => callback(),
    );
    vi.mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(
      () => null as unknown as gapi.auth2.GoogleAuth,
    );
    const thenFn = (res: Mock, _: Mock) => {
      res(mockGoogleAuth(true, mockedUser, mockedAuthResponse));
    };
    vi.mocked(gapiAuth2Init).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, mockedAuthResponse, thenFn),
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(vi.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('SignedIn');
    expect(result.current.signedUser).not.toBeUndefined();
    expect(result.current.signedUser).toEqual(mockedUser);

    expect(result.current.authResponse).toMatchObject(mockedAuthResponse);
  });
});
