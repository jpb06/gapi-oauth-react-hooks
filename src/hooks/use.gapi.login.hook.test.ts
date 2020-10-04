import { mocked } from "ts-jest/utils";

import { act, renderHook } from "@testing-library/react-hooks";

import { gapiGetAuth2Instance } from "../indirection/gapi.lib.indirection";
import { mockedUser } from "../tests-related/mocks/data/mocked.user.data";
import { mockGapiCurrentUser } from "../tests-related/mocks/gapi/auth2.current.user.mock";
import { mockGoogleAuth } from "../tests-related/mocks/gapi/auth2.google.auth.mock";
import { useGapiLoading } from "./use.gapi.loading.hook";
import { useGapiLogin } from "./use.gapi.login.hook";

jest.mock("./use.gapi.loading.hook");
jest.mock("../indirection/gapi.lib.indirection");

describe("useGapiLogin hook", () => {
  const setSignedUserMock = jest.fn();
  const setStateMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should be loading first", () => {
    mocked(useGapiLoading).mockReturnValueOnce({
      state: "Loading",
      signedUser: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
    });
    const { result } = renderHook(() => useGapiLogin());

    expect(result.current.state).toBe("Loading");
    expect(result.current.signedUser).toBeUndefined();
    expect(result.current.handleGoogleSignIn).toBeInstanceOf(Function);
    expect(result.current.handleGoogleSignout).toBeInstanceOf(Function);
  });

  it("should throw an error if trying to sign in while gapi is loading", async () => {
    mocked(useGapiLoading).mockReturnValueOnce({
      state: "Loading",
      signedUser: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
    });
    const { result } = renderHook(() => useGapiLogin());

    expect(result.current.handleGoogleSignIn).rejects.toThrowError(
      "gapi is not ready for sign in"
    );
  });

  it("should sign in", async () => {
    mocked(useGapiLoading).mockReturnValueOnce({
      state: "NotSignedIn",
      signedUser: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
    });
    mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser)
    );

    const { result } = renderHook(() => useGapiLogin());

    await result.current.handleGoogleSignIn();

    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith("SignedIn");
    expect(setSignedUserMock).toHaveBeenCalledTimes(1);
    // not using asymetric matcher because the object contains functions = useless error messages
    expect(setSignedUserMock.mock.calls[0][0].getId()).toBe(mockedUser.id);
    expect(setSignedUserMock.mock.calls[0][0].getEmail()).toBe(
      mockedUser.email
    );
    expect(setSignedUserMock.mock.calls[0][0].getFamilyName()).toBe(
      mockedUser.familyName
    );
    expect(setSignedUserMock.mock.calls[0][0].getGivenName()).toBe(
      mockedUser.givenName
    );
    expect(setSignedUserMock.mock.calls[0][0].getImageUrl()).toBe(
      mockedUser.imageUrl
    );
    expect(setSignedUserMock.mock.calls[0][0].getName()).toBe(mockedUser.name);
  });

  it("should report on errors", async () => {
    mocked(useGapiLoading).mockReturnValueOnce({
      state: "NotSignedIn",
      signedUser: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
    });
    mocked(gapiGetAuth2Instance).mockImplementationOnce(() => {
      throw new Error("Oh no!");
    });

    const { result } = renderHook(() => useGapiLogin());

    await result.current.handleGoogleSignIn();

    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith("Errored");
  });

  it("shouldn't do anything if trying to sign out when user is not signed in", async () => {
    mocked(useGapiLoading).mockReturnValueOnce({
      state: "NotSignedIn",
      signedUser: undefined,
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
    });
    const signOutMock = jest.fn();
    const disconnectMock = jest.fn();
    mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, jest.fn(), signOutMock, disconnectMock)
    );

    const { result } = renderHook(() => useGapiLogin());

    await result.current.handleGoogleSignout();

    expect(gapiGetAuth2Instance).toHaveBeenCalledTimes(0);
    expect(signOutMock).toHaveBeenCalledTimes(0);
    expect(disconnectMock).toHaveBeenCalledTimes(0);
  });

  it("should sign out", async () => {
    mocked(useGapiLoading).mockReturnValueOnce({
      state: "SignedIn",
      signedUser: mockGapiCurrentUser(mockedUser).get().getBasicProfile(),
      setState: setStateMock,
      setSignedUser: setSignedUserMock,
    });
    const signOutMock = jest.fn();
    const disconnectMock = jest.fn();
    mocked(gapiGetAuth2Instance).mockImplementationOnce(() =>
      mockGoogleAuth(true, mockedUser, jest.fn(), signOutMock, disconnectMock)
    );

    const { result } = renderHook(() => useGapiLogin());

    await result.current.handleGoogleSignout();

    expect(gapiGetAuth2Instance).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
