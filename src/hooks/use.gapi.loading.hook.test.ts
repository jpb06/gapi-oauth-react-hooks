import { renderHook } from '@testing-library/react';

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

jest.mock('../logic/resource.loading.logic');
jest.mock('../indirection/gapi.lib.indirection');

describe('useGapiLoading hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have loading as its default state', () => {
    const { result } = renderHook(() => useGapiLoading());

    expect(result.current.state).toBe('Loading');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should call loadScript once', () => {
    renderHook(() => useGapiLoading());

    expect(jest.mocked(loadScript)).toHaveBeenCalledTimes(1);
  });

  it('should call removeScript once if component unmounts', () => {
    renderHook(() => useGapiLoading()).unmount();

    expect(jest.mocked(loadScript)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(removeScript)).toHaveBeenCalledTimes(1);
  });

  it('should initialize auth2 if the auth instance does not exist after load', () => {
    jest
      .mocked(loadScript)
      .mockImplementationOnce((document, id, jsSrc, callback) => callback());
    jest
      .mocked(gapiLoad)
      .mockImplementationOnce((name, callback) => callback());
    jest
      .mocked(gapiGetAuth2Instance)
      .mockImplementationOnce(() => null as unknown as gapi.auth2.GoogleAuth);
    jest.mocked(gapiAuth2Init).mockReturnValueOnce(mockGoogleAuth(false));

    const { result } = renderHook(() => useGapiLoading());

    expect(jest.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should initialize auth2 and set the current user if he is signed in', () => {
    jest
      .mocked(loadScript)
      .mockImplementationOnce((document, id, jsSrc, callback) => callback());
    jest
      .mocked(gapiLoad)
      .mockImplementationOnce((name, callback) => callback());
    jest
      .mocked(gapiGetAuth2Instance)
      .mockImplementationOnce(() =>
        mockGoogleAuth(true, mockedUser, mockedAuthResponse),
      );

    const { result } = renderHook(() => useGapiLoading());

    expect(jest.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('SignedIn');
    expect(result.current.signedUser).not.toBeUndefined();
    expect(result.current.signedUser).toEqual(mockedUser);
    expect(result.current.authResponse).toMatchObject(mockedAuthResponse);
  });

  it('should set the user as not signed in', () => {
    jest
      .mocked(loadScript)
      .mockImplementationOnce((document, id, jsSrc, callback) => callback());
    jest
      .mocked(gapiLoad)
      .mockImplementationOnce((name, callback) => callback());
    jest
      .mocked(gapiGetAuth2Instance)
      .mockImplementationOnce(() => mockGoogleAuth(false));

    const { result } = renderHook(() => useGapiLoading());

    expect(jest.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('NotSignedIn');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should report on gapi errors', () => {
    jest
      .mocked(loadScript)
      .mockImplementationOnce((document, id, jsSrc, callback) => callback());
    jest
      .mocked(gapiLoad)
      .mockImplementationOnce((name, callback) => callback());
    jest
      .mocked(gapiGetAuth2Instance)
      .mockImplementationOnce(() => null as unknown as gapi.auth2.GoogleAuth);
    const thenFn = (_: jest.Mock, err: jest.Mock) => {
      err();
    };
    jest
      .mocked(gapiAuth2Init)
      .mockImplementationOnce(() =>
        mockGoogleAuth(false, undefined, undefined, thenFn),
      );

    const { result } = renderHook(() => useGapiLoading());

    expect(jest.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('Errored');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should set state as errored when script failed to load', () => {
    jest
      .mocked(loadScript)
      .mockImplementationOnce((document, id, jsSrc, callback, err) => err());

    const { result } = renderHook(() => useGapiLoading());

    expect(result.current.state).toBe('Errored');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should call setSignedInUser on init', () => {
    jest
      .mocked(loadScript)
      .mockImplementationOnce((document, id, jsSrc, callback) => callback());
    jest
      .mocked(gapiLoad)
      .mockImplementationOnce((name, callback) => callback());
    jest
      .mocked(gapiGetAuth2Instance)
      .mockImplementationOnce(() => null as unknown as gapi.auth2.GoogleAuth);
    const thenFn = (res: jest.Mock, _: jest.Mock) => {
      res(mockGoogleAuth(true, mockedUser, mockedAuthResponse));
    };
    jest
      .mocked(gapiAuth2Init)
      .mockImplementationOnce(() =>
        mockGoogleAuth(true, mockedUser, mockedAuthResponse, thenFn),
      );

    const { result } = renderHook(() => useGapiLoading());

    expect(jest.mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('SignedIn');
    expect(result.current.signedUser).not.toBeUndefined();
    expect(result.current.signedUser).toEqual(mockedUser);

    expect(result.current.authResponse).toMatchObject(mockedAuthResponse);
  });
});
