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
import { List, ListItem } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
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
};

@firebaseConnect([
    { path: 'menus', queryParams: ['orderByKey', 'limitToLast=7'] }, // 10 most recent
    { path: 'products', queryParams: ['orderByKey', 'limitToLast=5'] }
])
@connect(({ firebase }, { params }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
  menus: dataToJS(firebase, 'menus'),
  products: dataToJS(firebase, 'products')
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
      //searchText: '',
      date: Object.assign({}, this.props.date),
      //name: '',
      //quantity: '',
      dailyMenus: [{ name: '', quantity: 0, searchText: ''}],
      showMenuForm: false,
      selectedProducts: Object.assign([], this.props.selectedProducts),
      weeklyMenu: [],
      open: false

    }
    this.handleRemoveDailyMenu = this.handleRemoveDailyMenu.bind(this)
    this.handleDailyMenuNameChange = this.handleDailyMenuNameChange.bind(this)
    //this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.saveMenu = this.saveMenu.bind(this)
    //this.loadMenus = this.loadMenus.bind(this)
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
    // if (day in this.state.menu){//TODO: Need to verfiy in DB
    //   console.log('inside if --saveMenu--', day)
    //   this.setState({open:!this.state.open})
    //   return this.setState({ error: '`Menu exists for ${day}`' })
    // }

    this.setState({
      date: date
    });
  };

  loadMenus = (weeklyMenu) => {
    let menus = weeklyMenu.filter(function (menu) {
        console.log(menu);
        return menu.dates
      })
    this.setState({ weeklyMenu: menus})
  }

  

  handleDailyMenuNameChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, name: evt.text, searchText: evt.text};
    });
    this.setState({dailyMenus: newDailyMenus});
  }

  handleDailyMenuQtyChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, quantity: evt.target.value};
    });

    this.setState({ dailyMenus: newDailyMenus });
    console.log('handleDailyMenuQtyChange---', this.state.dailyMenus)
  }



  handleAddDailyMenu = () => {
    this.setState({ dailyMenus: this.state.dailyMenus.concat([{ name: '', quantity: 0, searchText: '' }]) });
  }

  handleRemoveDailyMenu = (idx) => () => {
    let newDailyMenus = this.state.dailyMenus.filter((s, sidx) => idx !== sidx)
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

  createProductDatasource =() => {
    let productDataSource = []
    map(this.props.products, (product, id) => (
      productDataSource.push(product)
    ))
    return productDataSource
  }

  checkIfMenuExists = (menus,day) => {
    menus.once('value', function (snapshot) {
      if (snapshot.hasChild(day)) {
        this.setState({ open: !this.state.open })
        return this.setState({ error: '`Menu exists for ${day}`' })
      }
    });
  }

  saveMenu = () => {
    this.setState({ showMenuForm: false })
    let day = this.formatDate(this.state.date)
    // if (day in this.state.menu){//TODO: Need to verfiy in DB
    //   console.log('inside if --saveMenu--', day)
    //   this.setState({open:!this.state.open})
    //   return this.setState({ error: '`Menu exists for ${day}`' })
    // }
    this.state.menu[day] = this.state.dailyMenus
    const { firebase: { updateWithMeta } } = this.props
    // push new project with updatedBy and updatedAt
    return this.props.firebase.update(`/menus/-L5lboFK__WG4oZvehYv`, this.state.menu).catch(err => {
      console.error('Error updating daily menu: ', err) // eslint-disable-line no-console
      this.setState({ error: 'Error updating daily menu' })
      return Promise.reject(err)
    })
    
  }

  menuDaysList = () => {
      let menuDaysList = []
      Object.keys(menus).map(function (keyName, keyIndex) {
      let menu = menus[keyName]
        Object.keys(menu).map(function (keyName, keyIndex) {
          let dates = menu.dates
          Object.keys(dates).map(function (keyName, keyIndex) {
            menuDaysList.push(keyName);   
            return menuDaysList
          })
        })
      })
    
  }


  render() {
    
    const { menus, auth, account, products } = this.props
    const { showMenuForm, searchText, dailyMenus, weeklyMenu, open } = this.state
    let weekly = []
    let days = []
    if(menus){
    Object.keys(menus).forEach(key => {
      let weeklyMenu = menus[key]
      Object.keys(weeklyMenu).forEach(key => {
        days.push(key)
        weekly.push(weeklyMenu[key]);
      });
    });
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
            
            <Subheader>Weekly Menu</Subheader>
            {account && account.rolename === 'admin' && !showMenuForm && 
               <div> 
              <List className={classes.list}>   
              {days &&
                map(days, (date, id) => (
                  <ListItem key={id}>
                  <a href="#" key={id}>{date}</a>
                  </ListItem>
                ))} 
               </List>               
              </div>
            }
            {!account && !showMenuForm &&
            <div style={styles.root}>
              <GridList
                cellHeight={180}
                style={styles.gridList}
              >      
                {weekly && 
                  map(weekly, (date,id) => (  
                          map(date, (item,id) => ( 
                          <GridTile
                            key={id}
                            title={item.name}
                            subtitle={<span> Qty <b>{(item.quantity === '0') ? 'Sold out': item.quantity }</b></span>}
                            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                            actionPosition="left"
                            titlePosition="top"
                            
                            
                          >
                            <img src="http://www.material-ui.com/v0.19.4/images/grid-list/burger-827309_640.jpg" />
                          </GridTile>
                         ))
              ))} 
              
              </GridList>
              </div>
            }
            
                
            
            
            {account && account.rolename === 'admin' &&
              <DatePicker
                hintText="Select Date"
                value={this.state.date}
                onChange={this.handleDateChange}
                formatDate={this.formatDate}
              />
              
            }

            {account && account.rolename === 'admin' && open &&
              <Snackbar
                open={open}
                message={`Menu already exists for ${this.formatDate(this.state.date)}`}
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
              />
            }  
            {account && account.rolename === 'admin' &&
            <RaisedButton label="Create Menu" primary={true}
            onClick={this.createMenu}/>
            } 
            {account && account.rolename === 'admin' && showMenuForm && (
              <form className={classes.inputs}>
                <List className={classes.list}>
                  {dailyMenus.map((dailyMenu, idx) => (
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
                      <RaisedButton label="Delete" secondary={true} onClick={() => { if (confirm('Delete the item?')) { this.handleRemoveDailyMenu(idx) }; }} />
                    </div>
                  ))}
                  <FloatingActionButton mini={true} secondary={true} onClick={this.handleAddDailyMenu}>
                    <ContentAdd />
                  </FloatingActionButton>
                </List>


                <RaisedButton label="Save" primary={true} onClick={this.saveMenu}/>
              </form>
            )}  
            //TODO: 1. Show List of Menu's
            //TODO: 2. Edit Menu
            
            
          </Paper>  
         
        </div>
      </div>
    )
  }
}
