import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'lodash'
import Theme from 'theme'
import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS // needed for full list and once
  // orderedToJS, // needed for ordered list
  // populatedDataToJS // needed for populated list
} from 'react-redux-firebase'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import Product from '../components/Product'
import NewProductPanel from '../components/NewProductPanel'
import EditProductDialog from '../components/EditProductDialog'
import classes from './HomeContainer.scss'


// const populates = [{ child: 'owner', root: 'users', keyProp: 'uid' }]

@firebaseConnect([
  // 'todos' // sync full list of todos
  // { path: 'todos', type: 'once' } // for loading once instead of binding
  { path: 'products', queryParams: ['orderByKey', 'limitToLast=5'] } // 10 most recent
  // { path: 'todos', populates } // populate
  // { path: 'todos', storeAs: 'myTodos' } // store elsewhere in redux
])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
  products: dataToJS(firebase, 'products'),
  // todos: orderedToJS(firebase, 'todos') // if looking for array
  // todos: dataToJS(firebase, 'myTodos'), // if using storeAs
  // todos: populatedDataToJS(firebase, 'todos', populates), // if populating
  // todos: orderedToJS(firebase, '/todos') // if using ordering such as orderByChild
}))
export default class Home extends Component {
  static propTypes = {
    products: PropTypes.oneOfType([
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
    }),
    uploadedFiles: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ])
  }

  state = {
    error: null,
    editProductModal: false,
    product: null
  }

  toggleDone = (product, id) => {
    const { firebase, auth } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Toggle Done' })
    }
    //return firebase.set(`/products/${id}/done`, !product.done)
  }

  deleteProduct = id => {
    const { products, auth, firebase } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Delete' })
    }
    
    return firebase.remove(`/products/${id}`).catch(err => {
      console.error('Error removing product: ', err) // eslint-disable-line no-console
      this.setState({ error: 'Error Removing product' })
      return Promise.reject(err)
    })
  }

  handleAdd = newProduct => {
  	const { products, auth, firebase } = this.props
    if (!auth || !auth.uid || !auth.rolename === 'admin') {
      return this.setState({ error: 'You must be Logged into Add' })
    }
    // Attach user if logged in
    if (this.props.auth) {
      newProduct.owner = this.props.auth.uid
    } else {
      newProduct.owner = 'Anonymous'
    }

    if(newProduct.price === undefined) {
    	newProduct.price = '';
    }

    // attach a timestamp
    newProduct.createdAt = this.props.firebase.database.ServerValue.TIMESTAMP
    // using this.props.firebase.pushWithMeta here instead would automatically attach createdBy and createdAt
    return this.props.firebase.push('/products', newProduct)
  }

  handleEdit = product => {
    const { firebase: { updateWithMeta } } = this.props
    // push new project with createdBy and createdAt
    // return this.props.firebase.updateWithMeta(`/products/${product.id}`,product).catch(err => {
    //   console.error('Error updating product: ', err) // eslint-disable-line no-console
    //   this.setState({ error: 'Error updating product' })
    //   return Promise.reject(err)
    // })
  }

  displayProduct = (product, id) => {
    const { firebase, auth } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Toggle Done' })
    }
 
    this.setState({ editProductModal: !this.state.editProductModal})
    this.setState((prevState) => {
      return { product: product }
    });
    console.log('-----', this.state)
  }

  render() {
    const { products } = this.props
    const { error } = this.state
    const { account} = this.props
    const { editProductModal } = this.state
    const { product } = this.state
    
    return (
      <div
        className={classes.container}
        style={{ color: Theme.palette.primary2Color }}>
        {error ? (
          <Snackbar
            open={!!error}
            message={error}
            autoHideDuration={4000}
            onRequestClose={() => this.setState({ error: null })}
          />
        ) : null}
        <div className={classes.info}>
          <span>data loaded from</span>
          <span>
            <a href="https://krabby-2017.firebaseio.com/">Krabby Platform</a>
          </span>
          <span style={{ marginTop: '2rem' }}>
            <strong>Manage your products </strong>
          </span>
        </div>
        <div className={classes.products}>

          {editProductModal && (
            <EditProductDialog
              open={editProductModal}
              product={product}
              onSubmit={this.handleEdit}
              self={this}
            />

            //<EditProductDialog onEditClick={this.handleEdit} disabled={false} /> 
          )}

          

          {account && account.rolename === 'admin' && !editProductModal &&
            <NewProductPanel onNewClick={this.handleAdd} disabled={false} /> 
        }

          {/* {account && account.rolename === 'admin' && isEditing &&
            <NewProductPanel onUpdateClick={this.handleEdit} disabled={false} />
          } */}
          
         
         
          <Paper className={classes.paper}>
              <Subheader>Products</Subheader>
              <List className={classes.list}>
                {products &&
                  map(products, (product, id) => (
                    <Product
                      key={id}
                      id={id}
                      product={product}
                      account={account}
                      onCompleteClick={this.toggleDone}
                      onDeleteClick={this.deleteProduct}
                      onEditClick={this.displayProduct}
                    />
                  ))}
              </List>
            </Paper>
        
        </div>
      </div>
    )
  }
}
