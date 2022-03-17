# gapi-oauth-react-hooks

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://github.dev/jpb06/gapi-oauth-react-hooks)
![npm bundle size](https://img.shields.io/bundlephobia/min/gapi-oauth-react-hooks)
![Github workflow](https://img.shields.io/github/workflow/status/jpb06/gapi-oauth-react-hooks/Tests?label=last%20workflow&logo=github-actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jpb06_gapi-oauth-react-hooks)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jpb06_gapi-oauth-react-hooks)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=security_rating)](https://sonarcloud.io/dashboard?id=jpb06_gapi-oauth-react-hooks)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jpb06_gapi-oauth-react-hooks)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=coverage)](https://sonarcloud.io/dashboard?id=jpb06_gapi-oauth-react-hooks)
![Coverage](./badges/coverage-jest%20coverage.svg)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jpb06_gapi-oauth-react-hooks)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jpb06_gapi-oauth-react-hooks)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=code_smells)](https://sonarcloud.io/dashboard?id=jpb06_gapi-oauth-react-hooks)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jpb06_gapi-oauth-react-hooks)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jpb06_gapi-oauth-react-hooks)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/gapi-oauth-react-hooks?label=snyk%20vulnerabilities)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jpb06_gapi-oauth-react-hooks&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=jpb06_gapi-oauth-react-hooks)
![Last commit](https://img.shields.io/github/last-commit/jpb06/gapi-oauth-react-hooks?logo=git)

## ⚡ Purpose

I needed SSO for google users and wasn't quite satisfied with what I found in the react eco system. Perhaps this will be useful for someone else, so here we go :rocket:

The package exposes its own declaration files; you won't need to install any @types/\* if you use typescript.

## ⚡ Installation

To install, use either yarn or npm:

```bash
yarn add gapi-oauth-react-hooks
```

```bash
npm i gapi-oauth-react-hooks
```

## ⚡ Typical use

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
    NotSignedIn: <button onClick={auth.onSignIn} >Login</button>,
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
    <button onClick={onSignOut} >Logout</button>
  </>
);
```

## ⚡ Api

This package exposes two functions as well as two types:

### 🔶 Types

#### 🌀 `GapiState`

This type defines gapi state.

| Value       | Description                            |
| ----------- | -------------------------------------- |
| Loading     | gapi is not ready yet                  |
| Errored     | an error occured while loading gapi    |
| SignedIn    | gapi is ready and a user is signed in  |
| NotSignedIn | gapi is ready and no user is signed in |

#### 🌀 `UserProfile`

This type defines user data properties.

| Property   | Description          |
| ---------- | -------------------- |
| id         | the id of the user   |
| email      | the user email       |
| familyName | the user family name |
| givenName  | the user given name  |
| name       | the user name        |
| imageUrl   | the user avatar      |

#### 🌀 `GoogleAuthHookProps`

This type defines what returns the `useGoogleAuth` hook.

| Property     | Description                  |
| ------------ | ---------------------------- |
| state        | The gapi state               |
| signedUser   | The signer user (duh)        |
| authResponse | The auth response            |
| onSignIn     | A function initiating login  |
| onSignOut    | A function initiating logout |

### 🔶 Functions

#### 🌀 `GapiConfig.setup`

This static class contains a config function that takes three parameters. Once called, `useGoogleAuth` can be used.

```javascript
import { GapiConfig } from 'gapi-oauth-react-hooks';

GapiConfig.setup(clientId, scope, redirectUri);
```

| Parameter   | Description         |
| ----------- | ------------------- |
| clientId    | The gapi client id  |
| scope       | The requested scope |
| redirectUri | The redirect Uri    |

#### 🌀 `useGoogleAuth`

This react hook handles signin and signout using gapi auth2.

```javascript
import { useGoogleAuth, GoogleAuthHookProps } from 'gapi-oauth-react-hooks';

const {
  state,
  signedUser,
  authResponse,
  onSignIn,
  onSignOut,
}: GoogleAuthHookProps = useGoogleAuth();
```
