import { mocked } from 'ts-jest/utils';

import { renderHook } from '@testing-library/react-hooks';

import {
  gapiAuth2Init,
  gapiGetAuth2Instance,
  gapiLoad,
} from '../indirection/gapi.lib.indirection';
import { loadScript, removeScript } from '../logic/resource.loading.logic';
import { mockedAuthResponse } from '../tests-related/mocks/data/mocked.auth.response.data';
import { mockedUser } from '../tests-related/mocks/data/mocked.user.data';
import { mockGoogleAuth } from '../tests-related/mocks/gapi/auth2.google.auth.mock';
import { useGapiLoading } from './use.gapi.loading.hook';

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

    expect(mocked(loadScript)).toHaveBeenCalledTimes(1);
  });

  it('should call removeScript once if component unmounts', () => {
    renderHook(() => useGapiLoading()).unmount();

    expect(mocked(loadScript)).toHaveBeenCalledTimes(1);
    expect(mocked(removeScript)).toHaveBeenCalledTimes(1);
  });

  it('should initialize auth2 if the auth instance does not exist after load', () => {
    mocked(loadScript).mockImplementationOnce((document, id, jsSrc, callback) =>
      callback()
    );
    mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    mocked(gapiGetAuth2Instance).mockImplementationOnce(
      () => null as unknown as gapi.auth2.GoogleAuth
    );
    mocked(gapiAuth2Init).mockReturnValueOnce(mockGoogleAuth(false));

    const { result } = renderHook(() => useGapiLoading());

    expect(mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should initialize auth2 and set the current user if he is signed in', () => {
    mocked(loadScript).mockImplementationOnce((document, id, jsSrc, callback) =>
      callback()
    );
    mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, mockedAuthResponse)
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('SignedIn');
    expect(result.current.signedUser).not.toBeUndefined();
    expect(result.current.signedUser).toEqual(mockedUser);
    expect(result.current.authResponse).toMatchObject(mockedAuthResponse);
  });

  it('should set the user as not signed in', () => {
    mocked(loadScript).mockImplementationOnce((document, id, jsSrc, callback) =>
      callback()
    );
    mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(false)
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('NotSignedIn');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should report on errors', () => {
    mocked(loadScript).mockImplementationOnce((document, id, jsSrc, callback) =>
      callback()
    );
    mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    mocked(gapiGetAuth2Instance).mockImplementationOnce(
      () => null as unknown as gapi.auth2.GoogleAuth
    );
    const thenFn = (res: any, err: any) => {
      err();
    };
    mocked(gapiAuth2Init).mockImplementationOnce(() =>
      mockGoogleAuth(false, undefined, undefined, thenFn)
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('Errored');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.authResponse).toBeUndefined();
  });

  it('should call setSignedInUser on init', () => {
    mocked(loadScript).mockImplementationOnce((document, id, jsSrc, callback) =>
      callback()
    );
    mocked(gapiLoad).mockImplementationOnce((name, callback) => callback());
    mocked(gapiGetAuth2Instance).mockImplementationOnce(
      () => null as unknown as gapi.auth2.GoogleAuth
    );
    const thenFn = (res: any, err: any) => {
      res(mockGoogleAuth(true, mockedUser, mockedAuthResponse));
    };
    mocked(gapiAuth2Init).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, mockedAuthResponse, thenFn)
    );

    const { result } = renderHook(() => useGapiLoading());

    expect(mocked(gapiLoad)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiGetAuth2Instance)).toHaveBeenCalledTimes(1);
    expect(mocked(gapiAuth2Init)).toHaveBeenCalledTimes(1);

    expect(result.current.state).toBe('SignedIn');
    expect(result.current.signedUser).not.toBeUndefined();
    expect(result.current.signedUser).toEqual(mockedUser);

    expect(result.current.authResponse).toMatchObject(mockedAuthResponse);
  });
});
