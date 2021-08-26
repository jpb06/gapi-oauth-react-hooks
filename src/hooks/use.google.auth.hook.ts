import { gapiGetAuth2Instance } from '../indirection/gapi.lib.indirection';
import { asPlainObject } from '../logic/conversion.logic';
import { GapiState } from '../types/gapiState';
import { UserProfile } from '../types/user.profile';
import { useGapiLoading } from './use.gapi.loading.hook';

export interface GoogleAuthHookProps {
  state: GapiState;
  signedUser?: UserProfile;
  authResponse?: gapi.auth2.AuthResponse;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const useGoogleAuth = (): GoogleAuthHookProps => {
  const {
    state,
    signedUser,
    authResponse,
    setState,
    setSignedUser,
    setAuthResponse,
  } = useGapiLoading();

  const handleSignIn = async () => {
    if (state !== 'NotSignedIn') {
      throw new Error('gapi is not ready for sign in');
    }

    try {
      const authInstance = gapiGetAuth2Instance();
      const user = await authInstance.signIn({ prompt: 'consent' });
      setAuthResponse(user.getAuthResponse());
      setSignedUser(asPlainObject(user.getBasicProfile()));
      setState('SignedIn');
    } catch (err) {
      console.error('gapi login error:', err);
      setState('Errored');
    }
  };

  const handleSignOut = async () => {
    if (state !== 'SignedIn') {
      return;
    }

    const authInstance = gapiGetAuth2Instance();
    await authInstance.signOut();

    setAuthResponse(undefined);
    setSignedUser(undefined);
    setState('NotSignedIn');
  };

  return {
    state,
    signedUser,
    authResponse,
    onSignIn: handleSignIn,
    onSignOut: handleSignOut,
  };
};
