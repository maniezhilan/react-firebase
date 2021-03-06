import { MENU_PATH as path } from 'constants'

export default store => ({
  path,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const Menus = require('./containers/MenusContainer').default

        /*  Return getComponent   */
        cb(null, Menus)

        /* Webpack named bundle   */
      },
      'Menus'
    )
  },
  // getChildRoutes(partialNextState, cb) {
  //   require.ensure([], require => {
  //     /*  Webpack - use require callback to define
  //         dependencies for bundling   */
  //     const menu = require('./routes/menu').default
  //     //const newMenu = require('./routes/newMenu').default
  //     /*  Return getComponent   */
  //     cb(null, [menu(store)])
  //   })
  // }
})
