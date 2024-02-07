import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useGapiLoading } from './use.gapi.loading.hook';
import { useGoogleAuth } from './use.google.auth.hook';
import { gapiGetAuth2Instance } from '../indirection/gapi.lib.indirection';
import { asPlainObject } from '../logic/conversion.logic';
import { mockedAuthResponse } from '../tests-related/mocks/data/mocked.auth.response.data';
import { mockedUser } from '../tests-related/mocks/data/mocked.user.data';
import { mockGapiCurrentUser } from '../tests-related/mocks/gapi/auth2.current.user.mock';
import { mockGoogleAuth } from '../tests-related/mocks/gapi/auth2.google.auth.mock';

vi.mock('./use.gapi.loading.hook');
vi.mock('../indirection/gapi.lib.indirection');

describe('useGoogleAuth hook', () => {
  const setSignedUserMock = vi.fn();
  const setStateMock = vi.fn();
  const setAuthResponseMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should be loading first', () => {
    vi.mocked(useGapiLoading).mockReturnValueOnce({
      state: 'Loading',
      signedUser: undefined,
      authResponse: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
      setAuthResponse: setAuthResponseMock,
    });
    const { result } = renderHook(() => useGoogleAuth());

    expect(result.current.state).toBe('Loading');
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.onSignIn).toBeInstanceOf(Function);
    expect(result.current.onSignOut).toBeInstanceOf(Function);
  });

  it('should throw an error if trying to sign in while gapi is loading', async () => {
    vi.mocked(useGapiLoading).mockReturnValueOnce({
      state: 'Loading',
      signedUser: undefined,
      authResponse: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
      setAuthResponse: setAuthResponseMock,
    });
    const { result } = renderHook(() => useGoogleAuth());

    return expect(result.current.onSignIn).rejects.toThrow(
      'gapi is not ready for sign in',
    );
  });

  it('should sign in', async () => {
    vi.mocked(useGapiLoading).mockReturnValueOnce({
      state: 'NotSignedIn',
      signedUser: undefined,
      authResponse: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
      setAuthResponse: setAuthResponseMock,
    });
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, mockedAuthResponse),
    );

    const { result } = renderHook(() => useGoogleAuth());

    await result.current.onSignIn();

    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith('SignedIn');
    expect(setSignedUserMock).toHaveBeenCalledTimes(1);
    expect(setSignedUserMock).toHaveBeenCalledWith(mockedUser);
  });

  it('should report on errors', async () => {
    console.error = vi.fn();
    vi.mocked(useGapiLoading).mockReturnValueOnce({
      state: 'NotSignedIn',
      signedUser: undefined,
      authResponse: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
      setAuthResponse: setAuthResponseMock,
    });
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(() => {
      throw new Error('Oh no!');
    });

    const { result } = renderHook(() => useGoogleAuth());

    await result.current.onSignIn();

    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith('Errored');
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("shouldn't do anything if trying to sign out when user is not signed in", async () => {
    vi.mocked(useGapiLoading).mockReturnValueOnce({
      state: 'NotSignedIn',
      signedUser: undefined,
      authResponse: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
      setAuthResponse: setAuthResponseMock,
    });
    const signOutMock = vi.fn();
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(
        true,
        mockedUser,
        mockedAuthResponse,
        vi.fn(),
        signOutMock,
      ),
    );

    const { result } = renderHook(() => useGoogleAuth());

    await result.current.onSignOut();

    expect(gapiGetAuth2Instance).toHaveBeenCalledTimes(0);
    expect(signOutMock).toHaveBeenCalledTimes(0);
  });

  it('should sign out', async () => {
    vi.mocked(useGapiLoading).mockReturnValueOnce({
      state: 'SignedIn',
      signedUser: asPlainObject(
        mockGapiCurrentUser(mockedUser).get().getBasicProfile(),
      ),
      authResponse: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
      setAuthResponse: setAuthResponseMock,
    });
    const signOutMock = vi.fn();
    vi.mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(
        true,
        mockedUser,
        mockedAuthResponse,
        vi.fn(),
        signOutMock,
      ),
    );

    const { result } = renderHook(() => useGoogleAuth());

    await result.current.onSignOut();

    expect(gapiGetAuth2Instance).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledTimes(1);

    expect(setAuthResponseMock).toHaveBeenCalledTimes(1);
    expect(setSignedUserMock).toHaveBeenCalledTimes(1);
  });
});
