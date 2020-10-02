import { GapiState, useGapiLoading } from "./use.gapi.loading.hook";

export const useGapiLogin = () => {
  const [gapiState, signedUser, setSignedUser, setGapiState] = useGapiLoading();

  const handleGoogleSignIn = async () => {
    if (gapiState !== GapiState.NotSignedIn)
      throw new Error("gapi is not ready for sign in");

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();

      const user = await authInstance.signIn({ prompt: "consent" });
      setSignedUser(user.getBasicProfile());
      setGapiState(GapiState.SignedIn);
    } catch (err) {
      console.log("gapi login error:", err);
      setGapiState(GapiState.Errored);
    }
  };

  const handleGoogleSignout = async () => {
    if (gapiState !== GapiState.SignedIn) return;

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    await authInstance.disconnect();
  };

  return [
    gapiState,
    signedUser,
    handleGoogleSignIn,
    handleGoogleSignout,
  ] as const;
};
