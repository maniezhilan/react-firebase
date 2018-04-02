import React, { Component } from 'react'
import PropTypes, { bool } from 'prop-types'
import { map, get, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  populatedDataToJS,
  pathToJS,
  dataToJS,
  isLoaded
} from 'react-redux-firebase'
import { MENU_PATH, ADD_TO_CART, CHECKOUT_REQUEST, CHECKOUT_FAILURE } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import { List, ListItem } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import classes from './MenusContainer.scss'
import DatePicker from 'material-ui/DatePicker';
import NewMenuForm from '../routes/Menu/components/NewMenuForm/NewMenuForm'
import Product from '../../Home/components/Product'
import AutoComplete from 'material-ui/AutoComplete';
import { TextField } from 'redux-form-material-ui'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Delete from 'material-ui/svg-icons/action/delete'
import FlatButton from 'material-ui/FlatButton';
import SvgIconAddShoppingCart from "material-ui/svg-icons/action/add-shopping-cart";
import CartDialog from "../components/CartDIalog"



const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 390,
    //height: 450,
    overflowY: 'auto',
    //overflowX: 'auto'
  },
  gridTile: {
    cursor: 'pointer'
  },
  
  flatButton: {
    right: '120px'
  },

  weeklyMenu: {
    width: 400
  }

};

@firebaseConnect([
    { path: 'menus', queryParams: ['orderByKey', 'limitToLast=7'] }, // 10 most recent
    { path: 'products', queryParams: ['orderByKey', 'limitToLast=100'] },
    { path: 'orders', queryParams: ['orderByKey', 'limitToLast=7'] }
])
@connect(({ firebase }, { params }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
  menus: dataToJS(firebase, 'menus'),
  products: dataToJS(firebase, 'products'),
  orders: dataToJS(firebase, 'orders')
}))
export default class Menus extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      error: null,
      menu: Object.assign({}, this.props.menu),
      date: Object.assign({}, this.props.date),
      dailyMenus: [{ productId:'',name: '', quantity: 0, searchText: '', price:0, img: '', uom: ''}],
      dailyOrders: [{ productId: '', name: '', quantity: 0, price: 0}],
      orderDates: [],
      showMenuForm: false,
      selectedProducts: Object.assign([], this.props.selectedProducts),
      open: false,
      edit: false,
      openCart: false,
      addedIds: [],
      quantityByDateId: new Map(),
      count:0,
      item: [{ productId: '', name: '', quantity: 0, price: 0 }],
      myCart : new Map(),
      totalPrice: 0

    }
    this.handleRemoveDailyMenu = this.handleRemoveDailyMenu.bind(this)
    this.handleDailyMenuNameChange = this.handleDailyMenuNameChange.bind(this)
    this.saveMenu = this.saveMenu.bind(this)
    this.editMenu = this.editMenu.bind(this)
    this.openCart = this.openCart.bind(this)
    this.onRequestCloseMenu = this.onRequestCloseMenu.bind(this)
  }

  static propTypes = {
    products: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ]),
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

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };


  //https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
  formatDate = (date) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options)
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

  handleDateChange = (event, date) => {
    this.setState({
      date: date
    });
  };


  handleDailyMenuNameChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, productId: evt.id, name: evt.text, searchText: evt.text,
         price: this.getProductPriceById(evt.id),
         img: this.getProductImgById(evt.id),
         uom: this.getProductUom(evt.id)
        };
    });
    this.setState({dailyMenus: newDailyMenus});
  }

  handleDailyMenuQtyChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, quantity: evt.target.value};
    });
    this.setState({ dailyMenus: newDailyMenus });
  }



  handleAddDailyMenu = () => {
    this.setState({ dailyMenus: this.state.dailyMenus.concat([{ productId: '', name: '', quantity: 0, searchText: '', price: 0, img:'', uom:'' }]) });
  }

  handleRemoveDailyMenu = (idx) => () => {
    let newDailyMenus = this.state.dailyMenus.filter((s, sidx) => idx !== sidx)
    console.log('--handleRemoveDailyMenu--', newDailyMenus)
    this.setState({ dailyMenus: newDailyMenus });
  }

  dataSourceConfig = {
    text: 'text',
    value: 'id',
  };

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
  };

  handleNewRequest = () => {
    this.setState({
      searchText: '',
    });
  };



  createMenu = () => {
    this.setState({ showMenuForm: !this.state.showMenuForm })
    let productDataSource = []
    map(this.props.products, (product, id) => (
      productDataSource.push(product)
    ))
    this.setState({ selectedProducts: productDataSource })
  }

  editMenu = (date) => {
    this.setState({ edit: !this.state.edit })
    this.setState({ showMenuForm: !this.state.showMenuForm })
    this.setState({ date: date})
    let productDataSource = []
    map(this.props.products, (product, id) => (
      productDataSource.push(product)
    ))
    this.setState({ selectedProducts: productDataSource })
    console.log(this.props.menus, '---', this.props.menus[date])
    this.setState({ dailyMenus: this.props.menus[date]})

  }

  deleteMenu = (date) => {
    console.log('--delete--',date)
    return this.props.firebase.remove(`/menus/${date}`).catch(err => {
      console.error('Error updating daily menu: ', err) // eslint-disable-line no-console
      this.setState({ error: 'Error updating daily menu' })
      return Promise.reject(err)
    })
  }

  createProductDatasource =() => {
    let productDataSource = []
    map(this.props.products, (product, id) => (
      productDataSource.push(product)
    ))
    return productDataSource
  }

  updateMenu = () => {
    this.setState({ edit: !this.state.edit })
    this.setState({ showMenuForm: !this.state.showMenuForm })
    let day = this.state.date
    this.state.menu = this.state.dailyMenus
    console.log('---updateMenu--Daily', this.state.dailyMenus);
    console.log('---updateMenu--fullmenu', this.state.menu);
    return this.props.firebase.set(`/menus/${day}`, this.state.menu).catch(err => {
      console.error('Error updating daily menu: ', err) // eslint-disable-line no-console
      this.setState({ error: 'Error updating daily menu' })
      return Promise.reject(err)
    })
    
  }

  saveMenu = () => {
    this.setState({ showMenuForm: !this.state.showMenuForm })
    let day = this.state.date
    if(!this.state.edit){
      day = this.formatDate(this.state.date)
    }
    if (this.props.menus && day in this.props.menus && !this.state.edit){
      this.setState({open:!this.state.open})
      return this.setState({ error: '`Menu exists for ${day}`' })
    }
    this.state.menu = this.state.dailyMenus
    
    //const { firebase: { pushWithMeta } } = this.props
    // push new project with updatedBy and updatedAt
    return this.props.firebase.set(`/menus/${day}`, this.state.menu).catch(err => {
      console.error('Error Creating daily menu: ', err) // eslint-disable-line no-console
      this.setState({ error: 'Error Creating daily menu' })
      return Promise.reject(err)
    })
    
  }

keyExists = (orders, key) => {
  for (let [i, order] of Object.entries(orders)) {
    if (order.productId === key) {
      return true
      break
    }
  }
}

updateOrder = (orders, item) => {
  for (let [i, order] of Object.entries(orders)) {
    if (order.productId === item.productId) {
      order.quantity = item.quantity
      break
    }
  }
}

checkoutCart = (date, item) => {
  let myCart = this.state.myCart
  if (myCart.has(date)) {
    let orders = myCart.get(date)
    //check if key exists
    if (orders.length !== undefined) {
      if (this.keyExists(orders, item.productId)) {
        this.updateOrder(orders, item)
      } else {
        //Add to existing date
        let newVal = orders.concat(item)
        myCart.set(date, newVal)
      }
    }
    //console.log(date, '---print cart ---', myCart.get(date))
  } else {
    myCart.set(date, [item])
  }
  this.setState({myCart: myCart})
}

//Useful method to sum values of properties
sumByProps = (items, prop) => {
    return items.reduce(function (a, b) {
      return a + b[prop];
  }, 0);
}

sumValues = (items) => {
  return items.reduce(function (a, b) {
    return a + b;
  }, 0);
}

splitString = (stringToSplit, separator) => {
  //console.log('stringToSplit.split---', stringToSplit.split('-')[2]);
  return stringToSplit.split('-')[2]
}

getProductPrice = (productId, quantity) => {
  console.log(this.props.products, productId, quantity, this.props.products[productId].price * quantity)

  return this.props.products[productId].price * quantity
}

  getProductPriceById = (productId) => {
    //console.log(this.props.products, productId)
    return this.props.products[productId].price || 0
  }

  getProductImgById = (productId) => {
    //console.log(this.props.products, productId)
    return this.props.products[productId].img || ''
  }

  getProductUom = (productId) => {
    return this.props.products[productId].uom || ''
  }

  cartTotal = (date,params) => {
    //TODO: check if totalPrice needs to be '-' or '+' based on quantity more or quanity less  
    let values = Array.from(this.state.myCart.values())
    console.log('cart::',values)
  //console.log('prod::', this.props.products)
  let total = 0;
  values.forEach((item,index) => {
   
    item.forEach((prod) => {
      console.log('--item--totalPrice', prod.productId, prod.quantity)
    //   this.setState({
    //     totalPrice: this.state.totalPrice + this.getProductPrice(prod.productId, prod.quantity)})
    // })
    //this.setState({totalPrice: this.state.totalPrice+ this.getProductPrice(item[index].productId,item[index].quantity)})
      total = total + this.getProductPrice(prod.productId, prod.quantity)
    })
  })
    this.setState({
         totalPrice: total
    })
}


showCartContent = (date, params) => {
  //console.log(date,params);
  let quantityByDateId = this.state.quantityByDateId
  quantityByDateId.set(date + '-' + params.productId, params.quantity)
  this.setState({ quantityByDateId: quantityByDateId})
  //console.log(this.state.quantityByDateId)
  let values = Array.from(this.state.quantityByDateId.values())
  this.setState({ count: this.sumValues(values)})
  // let prices = Array.from(this.state.myCart.values())
  // console.log('cart::', prices)
  // //console.log('prod::', this.props.products)

  // prices.forEach((item, index) => {
  //   console.log('--item--', item)
  //   this.setState({ totalPrice: this.state.totalPrice + this.getProductPrice(item[index].productId, item[index].quantity) })

  // })
  // console.log('totalPrice::', this.state.totalPrice)
}

saveOrders=() => {
  const { account} = this.props
  let dates = [...this.state.myCart.keys()];
  let menus = this.props.menus
  let updates = {};
  dates.forEach(date => {
    let ordersByDate = this.state.myCart.get(date)
    Object.keys(ordersByDate).forEach(function (key) {
      let updatedItem = menus[date].filter(menu => (menu.productId === ordersByDate[key].productId))
        updatedItem[0].quantity = (updatedItem[0].quantity - ordersByDate[key].quantity)
        updates[`/menus/${date}/${key}`] = updatedItem[0] 
    });
    updates[`/orders/${account.username}/${date}`] = ordersByDate
    this.props.firebase.database().ref().update(updates)      
  });
  this.setState({ openCart: false }) 


}

  openCart = () => {
    this.setState({ openCart: !this.state.openCart }) 
  }
  onRequestCloseMenu = () => {
    this.setState({ openCart: !this.state.openCart }) 
  }

  onRequestCloseCart = () => {
    console.log('onRequestCloseCart');
    this.setState({ openCart: !this.state.openCart })
    this.setState({myCart: new Map()})
    this.cartTotal();
    this.setState({count:0})
    this.setState({totalPrice:0})
  }

  

  
  render() {
    
    const { menus, auth, account, products, orders, handleSubmit } = this.props
    const { showMenuForm, searchText, dailyMenus, open, edit, date, item, openCart, onRequestCloseMenu, orderDates, count } = this.state
    // Menu Route is being loaded
    //console.log('menus', menus)
   
    if (this.props.children) {
      // pass all props to children routes
      return React.cloneElement(this.props.children, this.props)
    }

    return (
      <div className={classes.container}>
        
        <div className={classes.tiles}>

          <Paper className={classes.menu}>
            
            <Subheader>Weekly Menu</Subheader>
            {account && account.rolename === 'admin' && !showMenuForm && 
               <div style={styles.weeklyMenu}> 
              <List className={classes.list}>   
              {menus &&
                map(menus, (date, id) => (
                  <ListItem key={id}
                    
                    rightIcon={ account && account.rolename === 'admin' &&
                      <Delete onClick={() => { if (confirm(`Delete the menu for ${id} ?`)) { this.deleteMenu(id)}; }}/>
                    }

                    secondaryText={
                      <p>
                        <span className="">{id}</span>
                        <br/>
                      </p>
                    }  

                    rightIconButton={account && account.rolename === 'admin' &&

                      <FlatButton style={styles.flatButton} label="Edit" secondary={true} onClick={() => this.editMenu(id)}>

                      </FlatButton>
                    }
                  
                  />

                ))} 
               </List>               
              </div>
            }
            {account && account.rolename !== 'admin' && !showMenuForm && !edit &&
            <div style={styles.root}>
              <GridList
                cellHeight={200}
                padding={1}
                style={styles.gridList}
                cols = {1}
              >      
                {menus && 
                  map(menus, (date,idx) => (  
                          map(date, (item,id) => ( 
                          <GridTile
                            key={id}
                            title={item.name}
                            // subtitle={<span> <b>{(item.quantity === '0') ? 'Sold out' : item.quantity}</b><br/>{idx}</span>}
                            subtitle={<span>{idx}</span>}
                            //actionIcon={<IconButton onClick={() => this.addToCart(idx,item,1)}>Order</IconButton>}
                            //actionPosition="right"
                            titlePosition="bottom"
                            onClick={this.openCart}
                            style={styles.gridTile}
                            titlePosition="top"
                            titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                          >
                          
                      <img src={item.img} />
                          </GridTile>
                         ))
              ))} 
              
              </GridList>
              </div>
            }
            
                
            {account && account.rolename === 'admin' && !edit &&
              <DatePicker
                hintText="Select Date"
                value={this.state.date}
                onChange={this.handleDateChange}
                formatDate={this.formatDate}
              />
            } 
            {account && account.rolename === 'admin' && edit &&
              this.state.date
            }

            {account && account.rolename === 'admin' && open &&
              <Snackbar
                open={open}
                message={`Menu already exists for ${this.formatDate(date)}`}
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
              />
            }  
            {account && account.rolename === 'admin' &&  !edit &&
            <RaisedButton label="Create Menu" primary={true}
            onClick={this.createMenu}/>
            } 
            {account && account.rolename === 'admin' && showMenuForm && (
              <form className={classes.inputs}>
                <List className={classes.list}>
                  {dailyMenus && dailyMenus.map((dailyMenu, idx) => (
                    <div className="dailyMenu" key={idx}>
                      <AutoComplete
                        hintText={`Type product #${idx + 1} name`}
                        dataSource={this.state.selectedProducts}
                        dataSourceConfig={this.dataSourceConfig}
                        openOnFocus={true}
                        onNewRequest={this.handleDailyMenuNameChange(idx)}
                        //filter={AutoComplete.noFilter}
                        searchText={dailyMenu.searchText}
                        filter={(searchText, key) => (key.indexOf(dailyMenu.searchText) !== -1)}
                      />
                      {/* <AutoComplete
                        hintText={`Type product #${idx + 1} name`}
                        searchText={this.state.searchText}
                        onUpdateInput={this.handleUpdateInput}
                        onNewRequest={this.handleNewRequest}
                        dataSource={this.state.selectedProducts}
                        filter={(searchText, key) => (key.indexOf(dailyMenu.searchText) !== -1)}
                        openOnFocus={true}
                      /> */}

                      <TextField
                        hintText={`Type product #${idx + 1} quantity`}
                        value={dailyMenu.quantity}
                        onChange={this.handleDailyMenuQtyChange(idx)}
                        type='number'
                      />
                      {/* <RaisedButton label="Delete" secondary={true} onClick={() => { if (confirm('Delete the item?')) { this.handleRemoveDailyMenu(idx) }; }} /> */}
                      <RaisedButton label="Delete" secondary={true} onClick={this.handleRemoveDailyMenu(idx)} />
                    </div>
                  ))}
                  <FloatingActionButton mini={true} secondary={true} onClick={this.handleAddDailyMenu}>
                    <ContentAdd />
                  </FloatingActionButton>
                </List>


                <RaisedButton label={(this.state.edit) ? 'Update' : 'Save'} primary={true} onClick={(this.state.edit) ? this.updateMenu : this.saveMenu}/>
              </form>
            )}  
          </Paper>

          {openCart &&
            <CartDialog
            open = {openCart}
            onRequestCloseMenu={this.onRequestCloseMenu}
            onRequestCloseCart={this.onRequestCloseCart}
            menus={menus}
            onSubmit={this.saveOrders}
            orderDates={this.state.myCart}
            showCart={this.checkoutCart}
            cartCount={count}
            showCartContent={this.showCartContent}
            checkoutCart={this.checkoutCart}
            myCart={this.state.myCart}
            cartTotal={this.cartTotal}
            totalPrice={this.state.totalPrice}
            />
            
          }  
          
         
        </div>
      </div>

      
    )
  }
}
