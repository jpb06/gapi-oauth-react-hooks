export interface MockUser {
  id: string;
  email: string;
  name: string;
  familyName: string;
  givenName: string;
  imageUrl: string;
}
export const mockGapiCurrentUser = (
  user?: MockUser,
  authResponse?: gapi.auth2.AuthResponse
): gapi.auth2.CurrentUser => {
  if (!user) return (undefined as unknown) as gapi.auth2.CurrentUser;

  return {
    get: jest.fn().mockImplementation(() => ({
      getBasicProfile: jest.fn().mockReturnValue({
        getId: jest.fn().mockReturnValue(user.id),
        getEmail: jest.fn().mockReturnValue(user.email),
        getName: jest.fn().mockReturnValue(user.name),
        getFamilyName: jest.fn().mockReturnValue(user.familyName),
        getGivenName: jest.fn().mockReturnValue(user.givenName),
        getImageUrl: jest.fn().mockReturnValue(user.imageUrl),
      }),
      getAuthResponse: jest.fn().mockReturnValue(authResponse),
    })),
    listen: jest.fn(),
  };
};
