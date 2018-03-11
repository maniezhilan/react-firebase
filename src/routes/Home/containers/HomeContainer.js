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
import DatePicker from 'material-ui/DatePicker';
import Product from '../components/Product'
import NewProductPanel from '../components/NewProductPanel'
import EditProductDialog from '../components/EditProductDialog'
import MenuDialog from '../components/MenuDialog'
import classes from './HomeContainer.scss'
import RaisedButton from 'material-ui/RaisedButton'
import { pick } from 'lodash'


// const populates = [{ child: 'owner', root: 'users', keyProp: 'uid' }]

@firebaseConnect([
  // 'todos' // sync full list of todos
  // { path: 'todos', type: 'once' } // for loading once instead of binding
  { path: 'products', queryParams: ['orderByKey', 'limitToLast=5'] }, // 10 most recent
  { path: 'menus', queryParams: ['orderByKey', 'limitToLast=5'] } // 10 most recent
  // { path: 'todos', populates } // populate
  // { path: 'todos', storeAs: 'myTodos' } // store elsewhere in redux
])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
  products: dataToJS(firebase, 'products'),
  menus: dataToJS(firebase, 'menus'),
  
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
    //this.handleDailyMenuNameChange = this.handleDailyMenuNameChange.bind(this)
    //this.handleDailyMenuQtyChange = this.handleDailyMenuQtyChange.bind(this)
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
    this.setState({ dailyMenus: this.state.dailyMenus.concat([{ name: '', quantity: '' }]) });
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
    //construct the menu
    let menu = this.state.menu
    menu.startDate = this.state.startDate
    menu.endDate = this.state.endDate
    menu.selectedProducts = this.state.selectedProducts
    menu.dates = this.getDateRange(menu.startDate, menu.endDate)
    console.log(menu.selectedProducts);
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

  //https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
  formatDate = (date) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US",options)
  }

  
  //https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates/15882220
  getDateRange = (startDate, endDate) => {

    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }  

      let addFn = Date.prototype.addDays;
      let interval = 1;

      var retVal = [];
      var current = new Date(startDate);

      while (current <= endDate) {
        retVal.push(this.formatDate(new Date(current)))
        current = addFn.call(current, interval);
      }
    return retVal;
  }
  

  render() {
    const { products } = this.props
    const { error } = this.state
    const { account} = this.props
    const { editProductModal } = this.state
    const { showMenuModal } = this.state
    const { product } = this.state
    const { selectedProducts } = this.state

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
              product={this.state.product}
              onSubmit={this.handleEdit}
              onChange={this.updateProduct}
              onRequestClose={this.onRequestClose}
            />
            
          )}

          {showMenuModal && (
            <MenuDialog
              open={showMenuModal}
              onSubmit={this.saveMenu}
              onChange={this.updateProduct}
              onRequestCloseMenu={this.onRequestCloseMenu}
              menu={this.state.menu}
              formatDate={this.formatDate}
              dataSource={this.state.selectedProducts}
              dataSourceConfig={this.dataSourceConfig}
              searchText={this.state.searchText}
              handleAddDailyMenu={this.handleAddDailyMenu} 
              handleRemoveDailyMenu={this.handleRemoveDailyMenu}
              handleDailyMenuQtyChange={this.handleDailyMenuQtyChange}
              handleDailyMenuNameChange={this.handleDailyMenuNameChange}    
              dailyMenu={this.state.dailyMenus}        
            />

          )}

          {account && account.rolename === 'admin' && !editProductModal &&
            <NewProductPanel onNewClick={this.handleAdd} disabled={false} /> 
        }
         
          <Paper className={classes.paper}>
              <Subheader>Products</Subheader>
              {/* <DatePicker
                hintText="Start Date"
                value={this.state.startDate}
              onChange={this.handleStartDateChange}
              formatDate={this.formatDate}
              />
            <DatePicker
              hintText="End Date"
              value={this.state.endDate}
              onChange={this.handleEndDateChange}
              formatDate={this.formatDate}
            /> */}
              <List className={classes.list}>
                {products &&
                  map(products, (product, id) => (
                    <Product
                      key={id}
                      id={id}
                      product={product}
                      account={account}
                      onSelectClick={this.selectProduct}
                      onDeleteClick={this.deleteProduct}
                      onEditClick={this.displayProduct}
                    />
                  ))}
              </List>
            {/* <RaisedButton label="Create Menu" primary={true}
              onClick={this.createMenu}      
            /> */}
            </Paper>
        
        </div>
      </div>
    )
  }
}
