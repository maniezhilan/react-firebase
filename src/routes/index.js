// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import LoginRoute from './Login'
import SignupRoute from './Signup'
import MenusRoute from './Menus'
import OrdersRoute from './Orders'
import AccountRoute from './Account'
import RecoverRoute from './Recover'
import NotFoundRoute from './NotFound'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = store => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    AccountRoute,
    LoginRoute,
    SignupRoute,
    MenusRoute(store), // async route definitions recieve store
    OrdersRoute(store),
    RecoverRoute(store), // async route definitions recieve store
    /* Place all Routes above here so NotFoundRoute can act as a 404 page */
    NotFoundRoute(store) // async route definitions recieve store
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
