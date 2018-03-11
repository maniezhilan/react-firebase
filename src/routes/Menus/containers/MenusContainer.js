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
    width: 500,
    height: 450,
    overflowY: 'auto',
    
  },
  gridTile: {
    cursor: 'pointer'
  }
};

@firebaseConnect([
    { path: 'menus', queryParams: ['orderByKey', 'limitToLast=7'] }, // 10 most recent
    { path: 'products', queryParams: ['orderByKey', 'limitToLast=5'] },
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
      dailyMenus: [{ productId:'',name: '', quantity: 0, searchText: ''}],
      dailyOrders: [{ productId: '', name: '', quantity: 0}],
      orderDates: Object.assign([], this.props.orderDates),
      showMenuForm: false,
      selectedProducts: Object.assign([], this.props.selectedProducts),
      open: false,
      edit: false,
      openCart: false,
      addedIds: [],
      quantityById: {},
      count:0

    }
    this.handleRemoveDailyMenu = this.handleRemoveDailyMenu.bind(this)
    this.handleDailyMenuNameChange = this.handleDailyMenuNameChange.bind(this)
    this.saveMenu = this.saveMenu.bind(this)
    this.editMenu = this.editMenu.bind(this)
    this.addToCart = this.addToCart.bind(this)
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

  increment =() => {
    console.log('--increment---',this.state.count)
    this.setState({
      count: this.state.count +1 
    })
  }

  decrement = () => {
    console.log('--decrement---', this.state.count)
    if (this.state.count !== 0) {
      this.setState({
        count: this.state.count - 1
      })
    }
  }

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
      return { ...dailyMenu, productId: evt.id, name: evt.text, searchText: evt.text};
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
    this.setState({ dailyMenus: this.state.dailyMenus.concat([{ productId: '', name: '', quantity: 0, searchText: '' }]) });
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
//TODO: Add default units of measure in products
  // addToCart = (date,item,qty) => {
  //   const newDailyOrders = this.state.dailyOrders.map((dailyOrder, sidx) => {
  //     //if (idx !== sidx) return dailyOrder;
  //     return { ...dailyOrder, productId: item.productId, name: item.name, quantity: qty };
  //   });
    
  //   this.setState({ dailyOrders: newDailyOrders });
  //   this.state.orders = this.state.dailyOrders
  //   console.log(this.state.orders) 
  //   return this.props.firebase.set(`/orders/${this.props.account.username}/${date}`, this.state.orders).catch(err => {
  //     console.error('Error Creating daily menu: ', err) // eslint-disable-line no-console
  //     this.setState({ error: 'Error Creating daily menu' })
  //     return Promise.reject(err)
  //   })
  // }

  openCart = () => {
    this.setState({ openCart: !this.state.openCart }) 
    console.log('openCart----',this.state.openCart)
  }
  onRequestCloseMenu = () => {
    this.setState({ openCart: !this.state.openCart }) 
    console.log('closeCart----', this.state.openCart)
  }

  addedIds = (productId) => {
    return [...this.state.addedIds, productId]
  }

  quantityById = (productId) => {
    return {
      ...this.state.quantityById,
      [productId]: (this.state.quantityById[productId] || 0) + 1
    }

  }

  getQuantity = (productId) =>
    this.state.quantityById[productId] || 0


  getAddedIds = () => this.state.addedIds

  saveCart = (date, item) => {
    console.log(date, '--', item);
  }

  addToCart = (date,item) => {
    console.log(date,'--',item);
    //this.setState({ addedIds: [...this.state.addedIds, item.productId]})
   

    //this.setState({ quantityById: quantityById})

    //TODO: 
    //1.create date array
    // if(date in this.state.orderDates){
    //   this.setState({ dailyOrders: [...this.state.dailyOrders, { productId: item.productId, name: item.name, quantity: 1}]})
    //   this.state.orderDates[date] = this.state.dailyOrders
    //   console.log('1----', this.state.orderDates)
    // }else{
    //   const newDailyOrders = this.state.dailyOrders.map((dailyOrder, sidx) => {
    //     return { ...dailyOrder, productId: item.productId, name: item.name, quantity: 1 };
    //   });
    //   this.state.orderDates.push(date)
    //   this.state.orderDates[date] = newDailyOrders
    //   console.log('2----', this.state.orderDates)
    // }
      
    //2.check if date exists, then add items to array
    //3.Remove product from Menu
    //4.assign this array to user
    //5.save in firebase 
  
    
  }



  
  render() {
    
    const { menus, auth, account, products, orders, handleSubmit } = this.props
    const { showMenuForm, searchText, dailyMenus, open, edit, date, openCart, onRequestCloseMenu, orderDates, count } = this.state
    
    // Menu Route is being loaded
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
               <div> 
              <List className={classes.list}>   
              {menus &&
                map(menus, (date, id) => (
                  <ListItem key={id}
                    
                    rightIcon={ account && account.rolename === 'admin' &&
                    <Delete onClick="" />
                    }

                    secondaryText={
                      <p>
                        <span className="">{id}</span>
                        <br/>
                      </p>
                    }  

                    rightIconButton={account && account.rolename === 'admin' &&

                      <FlatButton label="Edit" secondary={true} onClick={() => this.editMenu(id)}>

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
                cellHeight={180}
                style={styles.gridList}
                
              >      
                {menus && 
                  map(menus, (date,idx) => (  
                          map(date, (item,id) => ( 
                          <GridTile
                            key={id}
                            title={item.name}
                            subtitle={<span> Qty <b>{(item.quantity === '0') ? 'Sold out' : item.quantity}</b><br/>{idx}</span>}
                            //actionIcon={<IconButton onClick={() => this.addToCart(idx,item,1)}>Order</IconButton>}
                            actionPosition="right"
                            titlePosition="bottom"
                            onClick={this.openCart}
                            style={styles.gridTile}
                          >
                          
                            <img src="http://www.material-ui.com/v0.19.4/images/grid-list/burger-827309_640.jpg" />
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
                        searchText={dailyMenu.searchText}
                        filter={(searchText, key) => (key.indexOf(dailyMenu.searchText) !== -1)}
                      />

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
            menus={menus}
            onSubmit={handleSubmit}
            orderDates={orderDates}
            addToCart={this.addToCart}
            // count={count}
            // increment={this.increment}
            // decrement={this.decrement}
            />
          }  
         
        </div>
      </div>

      
    )
  }
}
