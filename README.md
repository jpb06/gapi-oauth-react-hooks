# gapi-oauth-react-hooks

Uh yea... That's a mouthfull.

## Purpose

I needed SSO for google users and wasn't quite satisfied with what I found in the react eco system. Perhaps this will be useful for someone else, so here we go.

## Installation

First of, this will only work for react > 16.8 since it uses hooks. To install, use either yarn or npm:

```bash
yarn add gapi-oauth-react-hooks
```

```bash
npm i gapi-oauth-react-hooks
```

## Typical use

It's best to setup the config early, perhaps in the index or app file:

```js
import { GapiConfig } from "gapi-oauth-react-hooks";

// pulling from .env here
GapiConfig.setup(
  process.env.GOOGLE_AUTH_CLIENTID,
  process.env.GOOGLE_AUTH_SCOPE,
  process.env.GOOGLE_AUTH_REDIRECTURI
);

ReactDOM.render(<Login />, document.getElementById("root"));
```

Now, let's use the hook in the Login component:

```js
import { useGapiLogin, GapiState } from "gapi-oauth-react-hooks";

export const Login: React.FC = () => {
  const [state, user, handleSignIn, handleSignOut] = useGapiLogin();

  if (state === GapiState.Loading)
    return <div>Well, gapi is being loaded...</div>;
  if (state === GapiState.SignedIn)
    return (
      <>
        <div>user {JSON.stringify(user)}</div>
        <SimpleButton onClick={handleSignOut} text="Logout" />
      </>
    );

  return <SimpleButton onClick={handleSignIn} text="Login" />;
};
```

## Api

This package exposes three entities:

> A static class to hold gapi configuration

This class contains a config function that takes three parameters:

- clientId.
- scope.
- redirectUri.

> An interface defining the states Gapi can be at

This interface has the following members:

- Loading : gapi is not ready yet.
- Errored : an error occured while loading gapi.
- SignedIn : gapi is ready and a user is signed in.
- NotSignedIn : gapi is ready and no user is signed in.

> A react hook to handle signin and signout using gapi auth2

This hook returns:

- gapiState : the state of gapi.
- signedUser : the user signed in.
- handleGoogleSignIn : The signin function.
- handleGoogleSignout : The signout function.

The package exposes its own declaration files; you won't need to install an @types/\* if you use typescript.

## Log

- 1.0.3 : Misc: readme alterations.
- 1.0.2 : It's es5 we want to publish... Yes.
- 1.0.1 : Fixing typos.
- 1.0.0 : Initial publish.
