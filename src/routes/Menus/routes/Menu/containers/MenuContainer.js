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
  constructor(props) {
    super(props);
  }

  static propTypes = {
    menu: PropTypes.object,
    params: PropTypes.object.isRequired
  }



  onSubmit() {

  }


  
  render() {
    const {  params } = this.props
    const { menu } = this.state
    console.log('Menu ----',menu);
    if (isEmpty(menu)) {
      return <div>Menu Container is isEmpty</div>
    }

    if (!isLoaded(menu)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <h2>Menu Container</h2>
       
      </div>
    )
  }
}
