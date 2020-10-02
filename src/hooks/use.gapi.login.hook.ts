import { useGapiLoading } from "./use.gapi.loading.hook";

export const useGapiLogin = () => {
  const [gapiState, signedUser, setSignedUser, setGapiState] = useGapiLoading();

  const handleGoogleSignIn = async () => {
    if (gapiState !== "NotSignedIn")
      throw new Error("gapi is not ready for sign in");

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();

      const user = await authInstance.signIn({ prompt: "consent" });
      setSignedUser(user.getBasicProfile());
      setGapiState("SignedIn");
    } catch (err) {
      console.log("gapi login error:", err);
      setGapiState("Errored");
    }
  };

  const handleGoogleSignout = async () => {
    if (gapiState !== "SignedIn") return;

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
