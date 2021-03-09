# gapi-oauth-react-hooks

![Code quality](https://img.shields.io/codefactor/grade/github/jpb06/gapi-oauth-react-hooks?logo=codefactor)
![Coverage](./badges/coverage-global%20coverage.svg)
![Github workflow](https://img.shields.io/github/workflow/status/jpb06/gapi-oauth-react-hooks/checks?label=last%20workflow&logo=github-actions)
![Last commit](https://img.shields.io/github/last-commit/jpb06/gapi-oauth-react-hooks?logo=git)

## :zap: Purpose

I needed SSO for google users and wasn't quite satisfied with what I found in the react eco system. Perhaps this will be useful for someone else, so here we go :rocket:

The package exposes its own declaration files; you won't need to install any @types/\* if you use typescript.

## :zap: Requirements

- react >= 16.8
- typescript >= 3.8 (if using ts).

## :zap: Installation

To install, use either yarn or npm:

```bash
yarn add gapi-oauth-react-hooks
```

```bash
npm i gapi-oauth-react-hooks
```

## :zap: Typical use

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
import { useGoogleAuth, UserProfile } from "gapi-oauth-react-hooks";

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
  signedUser?: UserProfile;
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

## :zap: Api

This package exposes two functions as well as two types:

### :bangbang: Types

#### :id: A type defining the states Gapi can be at

This type can have the following values:

- 'Loading' : gapi is not ready yet.
- 'Errored' : an error occured while loading gapi.
- 'SignedIn' : gapi is ready and a user is signed in.
- 'NotSignedIn' : gapi is ready and no user is signed in.

#### :id: An interface defining user data

- id : the id of the user.
- email : the user email.
- familyName : the user family name.
- givenName : the user given name.
- name : the user name.
- imageUrl: the user avatar.

### :bangbang: Functions

#### :arrow_right_hook: A static class to hold gapi configuration

This class contains a config function that takes three parameters:

- clientId.
- scope.
- redirectUri.

```javascript
import { GapiConfig } from "gapi-oauth-react-hooks";

GapiConfig.setup(clientId, scope, redirectUri);
```

#### :arrow_right_hook: A react hook to handle signin and signout using gapi auth2

This hook returns an object containing:

- state : the state of gapi.
- signedUser : the user signed in, if any.
- authResponse : the google auth response.
- onSignIn : The signin function.
- onSignOut : The signout function.

```javascript
import { useGoogleAuth } from "gapi-oauth-react-hooks";

const {
  state,
  signedUser,
  authResponse,
  onSignIn,
  onSignOut,
} = useGoogleAuth();
```
