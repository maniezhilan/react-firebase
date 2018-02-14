import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NewMenuForm from '../components/NewMenuForm/NewMenuForm'

import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import classes from './MenuContainer.scss'

// Get Menu path from firebase based on params prop (route params)
@firebaseConnect(({ params }) => [`menus/${params.menuid}`])
// Map state to props
@connect(({ firebase }, { params }) => ({
  menu: dataToJS(firebase, `menus/${params.Menuid}`)
}))
export default class Menu extends Component {
  static propTypes = {
    menu: PropTypes.object,
    params: PropTypes.object.isRequired
  }

  render() {
    const { menu, params } = this.props

    // if (isEmpty(menu)) {
    //   return <div>Menu Container is isEmpty</div>
    // }

    // if (!isLoaded(menu)) {
    //   return <LoadingSpinner />
    // }

    return (
      <div className={classes.container}>
        <h2>Menu Container</h2>
        <NewMenuForm/>
      </div>
    )
  }
}
