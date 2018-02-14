import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map, get } from 'lodash'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  populatedDataToJS,
  pathToJS,
  dataToJS,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import { MENU_PATH } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton';
import classes from './MenusContainer.scss'




@firebaseConnect([
    { path: 'menus', queryParams: ['orderByKey', 'limitToLast=5'] }, // 10 most recent
])
@connect(({ firebase }, { params }) => ({
  auth: pathToJS(firebase, 'auth'),
  menus: dataToJS(firebase, 'menus'),
}))
export default class Menus extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    menus: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ]),
    firebase: PropTypes.shape({
      set: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      database: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    }),
    auth: PropTypes.shape({
      uid: PropTypes.string,
      email: PropTypes.string
    })
  }

  

  // newSubmit = newMenu => {
  //   const { firebase: { pushWithMeta } } = this.props
  //   // push new Menu with createdBy and createdAt
  //   return pushWithMeta('menus', newMenu)
  //     //.then(() => this.setState({ newMenuModal: false }))
  //     .catch(err => {
  //       // TODO: Show Snackbar
  //       console.error("error creating new Menu", err) // eslint-disable-line
  //     })
  // }

  // deleteMenu = key => this.props.firebase.remove(`menus/${key}`)

  

  // getDeleteVisible = key => {
  //   const { auth, unpopulatedMenus } = this.props
  //   return (
  //     !isEmpty(this.props.auth) &&
  //     get(unpopulatedMenus, `${key}.createdBy`) === auth.uid
  //   )
  // }

  createMenu = () => {
    window.location ='/menus/newMenu' 
  }

  render() {
    const { menus, auth } = this.props

    if (!isLoaded(menus, auth)) {
      return <LoadingSpinner />
    }

    // Menu Route is being loaded
    if (this.props.children) {
      // pass all props to children routes
      return React.cloneElement(this.props.children, this.props)
    }

    return (
      <div className={classes.container}>
        
        <div className={classes.tiles}>

          <Paper className={classes.menu}>
            <Subheader>Menus</Subheader>
            Menus...
            //TODO: 1. Create Menu
            <RaisedButton label="Create Menu" primary={true}
              onClick={this.createMenu}
            />
          </Paper>  
         
        </div>
      </div>
    )
  }
}
