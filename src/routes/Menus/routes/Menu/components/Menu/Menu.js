import React from 'react'
import PropTypes from 'prop-types'
import classes from './Menu.scss'

export const Menu = ({ menus, params: { menuid } }) => (
  <div className={classes.container}>
    {menus[menuid] ? (
      <div>
        <h2>Menu Container</h2>
        <pre>{JSON.stringify(menus[menuid])}</pre>
      </div>
    ) : (
      <div className={classes.empty}>
        <span>Menu Not Found--</span>
      </div>
    )}
  </div>
)

Menu.propTypes = {
  menus: PropTypes.object,
  params: PropTypes.object
}

export default Menu
