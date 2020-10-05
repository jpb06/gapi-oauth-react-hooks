# gapi-oauth-react-hooks

![Statements](./badges/badge-statements.svg) ![Branches](./badges/badge-branches.svg) ![Functions](./badges/badge-functions.svg) ![Lines](./badges/badge-lines.svg)

## Purpose

I needed SSO for google users and wasn't quite satisfied with what I found in the react eco system. Perhaps this will be useful for someone else, so here we go.

The package exposes its own declaration files; you won't need to install any @types/\* if you use typescript.

## Requirements

- react >= 16.8
- typescript >= 3.8 (if using ts).

## Installation

To install, use either yarn or npm:

```bash
yarn add gapi-oauth-react-hooks
```

```bash
npm i gapi-oauth-react-hooks
```

## Typical use

It's best to setup the config early, perhaps in the index or app file:

```Typescript
import { GapiConfig } from "gapi-oauth-react-hooks";

// pulling from .env here
GapiConfig.setup(
  process.env.GOOGLE_AUTH_CLIENTID,
  process.env.GOOGLE_AUTH_SCOPE,
  process.env.GOOGLE_AUTH_REDIRECTURI
);

ReactDOM.render(<Login />, document.getElementById("root"));
```

Now, let's use the main hook in our Login component:

```Typescript
import { useGoogleAuth } from "gapi-oauth-react-hooks";

export const Login = () => {
  const auth = useGoogleAuth();

  const display = {
    Errored: <>Oh no!</>,
    Loading: <>Loading ...</>,
    NotSignedIn: <SimpleButton onClick={auth.onSignIn} text="Login" />,
    SignedIn: <SignedIn {...auth} />
  };

  return <>{display[auth.state]}</>;
};

interface SignedInProps {
  onSignOut: () => Promise<void>;
  signedUser?: gapi.auth2.BasicProfile;
  authResponse?: gapi.auth2.AuthResponse;
}

const SignedIn: React.FC<SignedInProps> = ({ onSignOut, signedUser, authResponse }) => (
  <>
    <div>user {JSON.stringify(signedUser)}</div>
    <div>auth response {JSON.stringify(authResponse)}</div>
    <SimpleButton onClick={onSignOut} text="Logout" />
  </>
);
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

This hook returns an object containing:

- state : the state of gapi.
- signedUser : the user signed in, if any.
- authResponse : the google auth response.
- onSignIn : The signin function.
- onSignOut : The signout function.

## Log

- 2.0.3 : Yet another readme example improvement.
- 2.0.2 : Typo & missing export in index.
- 2.0.1 : Exporting the main hook interface.
- 2.0.0 : Main hook renamed to useGoogleAuth.
- 1.1.3 : Minor readme improvements.
- 1.1.2 : Using 'On' prefix convention for outgoing events.
- 1.1.1 : Fixing misc typos in readme.
- 1.1.0 : Returning auth response from the main hook.
- 1.0.9 : Fixing a GapiState import.
- 1.0.8 : Adding tests coverage.
- 1.0.7 : Improving example in readme.
- 1.0.6 : Moving type GapiState to its own file.
- 1.0.5 : Exporting type GapiState.
- 1.0.4 : Removing the GapiState enum; replacing it with a type to simplify rendering in react components.
- 1.0.3 : Misc: readme alterations.
- 1.0.2 : It's es5 we want to publish... Yes.
- 1.0.1 : Fixing typos.
- 1.0.0 : Initial publish.
