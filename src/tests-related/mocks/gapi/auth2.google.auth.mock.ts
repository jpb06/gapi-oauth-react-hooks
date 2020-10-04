import { mockGapiCurrentUser, MockUser } from "./auth2.current.user.mock";

export const mockGoogleAuth = (
  isSignedIn: boolean,
  user?: MockUser,
  authResponse?: gapi.auth2.AuthResponse,
  thenFn: (res: any, err: any) => void = jest.fn(),
  signOutMockFn = jest.fn(),
  disconnectMockFn = jest.fn()
): gapi.auth2.GoogleAuth => ({
  signIn: jest
    .fn()
    .mockReturnValue(mockGapiCurrentUser(user, authResponse)?.get()),
  signOut: signOutMockFn,
  disconnect: disconnectMockFn,
  grantOfflineAccess: jest.fn(),
  attachClickHandler: jest.fn(),
  then: thenFn,
  isSignedIn: {
    get: jest.fn().mockReturnValue(isSignedIn),
    listen: jest.fn(),
  },
  currentUser: mockGapiCurrentUser(user, authResponse),
});
