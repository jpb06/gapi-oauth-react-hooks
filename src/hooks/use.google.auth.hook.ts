import { gapiGetAuth2Instance } from "../indirection/gapi.lib.indirection";
import { GapiState } from "../types/gapiState";
import { useGapiLoading } from "./use.gapi.loading.hook";

export interface GoogleAuthHookProps {
  state: GapiState;
  signedUser?: gapi.auth2.BasicProfile;
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
    if (state !== "NotSignedIn")
      throw new Error("gapi is not ready for sign in");

    try {
      const authInstance = gapiGetAuth2Instance();
      const user = await authInstance.signIn({ prompt: "consent" });
      setAuthResponse(user.getAuthResponse());
      setSignedUser(user.getBasicProfile());
      setState("SignedIn");
    } catch (err) {
      console.error("gapi login error:", err);
      setState("Errored");
    }
  };

  const handleSignOut = async () => {
    if (state !== "SignedIn") return;

    const authInstance = gapiGetAuth2Instance();
    await authInstance.signOut();
    await authInstance.disconnect();

    setAuthResponse(undefined);
    setSignedUser(undefined);
  };

  return {
    state,
    signedUser,
    authResponse,
    onSignIn: handleSignIn,
    onSignOut: handleSignOut,
  };
};
