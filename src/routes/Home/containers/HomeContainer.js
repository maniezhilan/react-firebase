import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'lodash'
import Theme from 'theme'
import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS
} from 'react-redux-firebase'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import { List } from 'material-ui/List'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import DatePicker from 'material-ui/DatePicker';
import Product from '../components/Product'
import NewProductPanel from '../components/NewProductPanel'
import EditProductDialog from '../components/EditProductDialog'
import MenuDialog from '../components/MenuDialog'
import classes from './HomeContainer.scss'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import { pick } from 'lodash'
import Delete from 'material-ui/svg-icons/action/delete'
import { formatDate, getDateRange} from '../../../utils/dateUtil'

@firebaseConnect([
  { path: 'products', queryParams: ['orderByKey','limitToLast=100']},
  { path: 'menus', queryParams: ['orderByKey', 'limitToLast=20'] },
  { path: 'orders', queryParams: ['orderByKey', 'limitToLast=20'] }
])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
  products: dataToJS(firebase, 'products'),
  menus: dataToJS(firebase, 'menus'),
  orders: dataToJS(firebase, 'orders'),
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
    
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onSelectClick: PropTypes.func,
    account: PropTypes.object,
  }

  constructor(props,context){
    super(props,context)
    this.state = {
      error: null,
      showMenuModal:false,
      editProductModal: false,
      product: Object.assign({}, this.props.product),
      menu: Object.assign({}, this.props.menu),
      startDate: null,
      endDate:null,
      selectedProducts: Object.assign([], this.props.selectedProducts),
      searchText: '',
      name: '',
      quantity: '',
      dailyMenus: [{ name: '', quantity: '' }],
    }
    this.updateProduct = this.updateProduct.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.saveMenu = this.saveMenu.bind(this)
    this.createMenu = this.createMenu.bind(this)
    this.onRequestClose = this.onRequestClose.bind(this)
    this.onRequestCloseMenu = this.onRequestCloseMenu.bind(this)
}

  handleNameChange = (evt) => {
    this.setState({ name: evt.target.value });
  }

  handleQtyChange = (evt) => {
    this.setState({ quantity: evt.target.value });
  }

  handleDailyMenuNameChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, name: evt.target.value };
    });

    this.setState({ dailyMenus: newDailyMenus });
    console.log('Namecahnge',this.state.dailyMenus)
  }

  handleDailyMenuQtyChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, quantity: evt.target.value };
    });

    this.setState({ dailyMenus: newDailyMenus });
    console.log('qtychange',this.state.dailyMenus)
  }



  handleAddDailyMenu = () => {
    this.setState({ dailyMenus: this.state.dailyMenus.concat([{ name: '', quantity: '', price:0, uom:'', minimumQty: 0 }]) });
  }

  handleRemoveDailyMenu = (idx) => () => {
    this.setState({ dailyMenus: this.state.dailyMenus.filter((s, sidx) => idx !== sidx) });
    console.log('Remove--',this.state.dailyMenus)
  }

  handleStartDateChange = (event, startDate) => {
    this.setState({
      startDate: startDate
    });
  };

  handleEndDateChange = (event, endDate) => {
    this.setState({
      endDate: endDate
    });
  };

  onRequestClose = () => {
    this.setState({ editProductModal:!this.state.editProductModal})
  }

  onRequestCloseMenu = () => {
    this.setState({ showMenuModal: !this.state.showMenuModal })
  }

  selectProduct = (product, id) => {
    const { firebase, auth } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Create Done' })
    }
    product.key = id
    this.setState({ selectedProducts: [...this.state.selectedProducts, product] })
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

  handleEdit = () => {
    this.setState({ editProductModal: !this.state.editProductModal })
    const { firebase: { updateWithMeta } } = this.props
    // push new project with updatedBy and updatedAt
    return this.props.firebase.updateWithMeta(`/products/${this.state.product.id}`, this.state.product).catch(err => {
      console.error('Error updating product: ', err) // eslint-disable-line no-console
      this.setState({ error: 'Error updating product' })
      return Promise.reject(err)
    })
    
  }

  updateProduct(event) {
    const field = event.target.name;
    let product = Object.assign({}, this.state.product);
    product[field] = event.target.value;
    return this.setState({ product: product });
  }

  displayProduct = (product,id) => {
    const { firebase, auth } = this.props
    if (!auth || !auth.uid) {
      return this.setState({ error: 'You must be Logged into Toggle Done' })
    }
    this.setState({ editProductModal: !this.state.editProductModal })
    product.id = id
    product.key = id
    this.setState({ product: product })
  }

  createMenu = () =>{
    this.setState({showMenuModal: !this.state.showMenuModal})
    let menu = this.state.menu
    menu.startDate = this.state.startDate
    menu.endDate = this.state.endDate
    menu.selectedProducts = this.state.selectedProducts
    menu.dates = this.getDateRange(menu.startDate, menu.endDate)
  }

  dataSourceConfig = {
    text: 'text',
    value: 'id',
  };

  saveMenu = () => {
    console.log('saveMenu called');
    this.setState({ showMenuModal: !this.state.showMenuModal })
    const { menus, auth, firebase } = this.props
    if (!auth || !auth.uid || !auth.rolename === 'admin') {
      return this.setState({ error: 'You must be Logged into Add' })
    }
    this.props.firebase.pushWithMeta('/menus',this.state.menu)
  }

  render() {
    const { products, orders, account } = this.props
    const { error, editProductModal, showMenuModal, product, selectedProducts } = this.state

    return (
      <div
        className={classes.bg}
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
          <div className={classes.centered}>
             <h1>Customer Name & Logo</h1>
          </div>
        </div>
        <div className={classes.products}>

          {
            account && account.rolename === 'admin' && !editProductModal &&
            <div>
              <NewProductPanel onNewClick={this.handleAdd} disabled={false} />
              <Table>
                <TableHeader adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Description</TableHeaderColumn>
                    <TableHeaderColumn>Price</TableHeaderColumn>
                    <TableHeaderColumn>Unit</TableHeaderColumn>
                    <TableHeaderColumn>Minimum</TableHeaderColumn>
                    <TableHeaderColumn>Edit</TableHeaderColumn>
                    <TableHeaderColumn>Delete</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {products &&
                    map(products, (product, id) => (
                      <TableRow>
                        <TableRowColumn>{product.name}</TableRowColumn>
                        <TableRowColumn>{product.description}</TableRowColumn>
                        <TableRowColumn>$ {product.price}</TableRowColumn>
                        <TableRowColumn>{product.uom}</TableRowColumn>
                        <TableRowColumn>{product.minimumQty}</TableRowColumn>
                        <TableRowColumn>
                        <FlatButton label="Edit" secondary={true} onClick={() => this.displayProduct(product, product._key || id)}>

                        </FlatButton>
                        </TableRowColumn>
                        <TableRowColumn>
                        <Delete onClick={() => {if (confirm(`Delete the product ${product.name} ?`)) this.deleteProduct(product._key || id)}}/>
                        </TableRowColumn>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          }
          {editProductModal && (
            <EditProductDialog
              open={editProductModal}
              product={this.state.product}
              onSubmit={this.handleEdit}
              onChange={this.updateProduct}
              onRequestClose={this.onRequestClose}
            />

          )}
          
        </div>
      </div>
    )
  }
}
