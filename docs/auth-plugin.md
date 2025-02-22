---
title: Auth Plugin
---

The Auth module assists setting up user login and logout.

## Setup

See the [Auth Setup](/api-overview.html#auth-plugin) section for an example of how to setup the Auth Plugin.

## Breaking Changes in 2.0

The following breaking changes were made between 1.x and 2.0:

- The `auth` method is now called `makeAuthPlugin`.

## Configuration

You can provide a `userService` in the auth plugin's options to automatically populate the user upon successful login.

## State

It includes the following state by default:

```js
{
  accessToken: undefined, // The JWT
  payload: undefined, // The JWT payload

  userService: null, // Specify the userService to automatically populate the user upon login.
  entityIdField: 'userId', // The property in the payload storing the user id
  responseEntityField: 'user', // The property in the payload storing the user
  user: null, // automatically populates if you have correctly configured the three previous settings.

  isAuthenticatePending: false,
  isLogoutPending: false,

  errorOnAuthenticate: undefined,
  errorOnLogout: undefined
}
```

## Actions

The following actions are included in the `auth` module.  Login is accomplished through the `authenticate` action.  For logout, use the `logout` action.  It's important to note that the records that were loaded for a user are NOT automatically cleared upon logout.  Because the business logic requirements for that feature would vary from app to app, it can't be baked into Feathers-Vuex.  It must be manually implemented.  The recommended solution is to simply refresh the browser, which clears the data from memory.

- `authenticate`: use instead of `feathersClient.authenticate()`
- `logout`: use instead of `feathersClient.logout()`

If you provided a `userService` and have correctly configured your `entityIdField` and `responseEntityField` (the defaults work with Feathers V4 out of the box), the `user` state will be updated with the logged-in user.  The record will also be reactive, which means when the user record updates (in the users service) the auth user will automatically update, as well.

> Note: The Vuex auth store will not update if you use the feathers client version of the above methods.
