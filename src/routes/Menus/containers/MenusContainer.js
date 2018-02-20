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
      weeklyMenu: [] 
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
      return { ...dailyMenu, quantity: evt.target.value };
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
    let menu = this.state.menu
    let day = this.formatDate(this.state.date)
    menu.dates = []
    menu.dates.push(day)
    menu.dates[day] = this.state.dailyMenus
    let productDataSource = []
    map(this.props.products, (product, id) => (
      productDataSource.push(product)
    ))
    this.setState({ selectedProducts: productDataSource })
    this.setState({menu:menu})
  }

  createProductDatasource =() => {
    let productDataSource = []
    map(this.props.products, (product, id) => (
      productDataSource.push(product)
    ))
    console.log(productDataSource);
    return productDataSource
  }

  saveMenu = () => {
    
    this.setState({ showMenuModal: !this.state.showMenuModal })
    console.log('saveMenu called');
    let menu = this.state.menu
    let day = this.formatDate(this.state.date)
    menu.dates = []
    menu.dates.push(day)
    menu.dates[day] = this.state.dailyMenus

    const { menus, auth, firebase } = this.props
    if (!auth || !auth.uid || !auth.rolename === 'admin') {
      return this.setState({ error: 'You must be Logged into Add' })
    }
    console.log(" menu items", this.state.menu)
    this.props.firebase.pushWithMeta('/menus', this.state.menu)
  }


  render() {
    
    const { menus, auth, account, products } = this.props
    const { showMenuForm, searchText, dailyMenus, weeklyMenu } = this.state
    
    // if (!isLoaded(menus, auth, account)) {
    //   return <LoadingSpinner />
    // }
    console.log(menus)
    let weekly = []
    if(menus){

      for (var key in menus) {
        if (menus.hasOwnProperty(key)) {
          //console.log(key + " -> " + menus[key].dates);
          let dates = menus[key].dates
          for (var date in dates){
            if (dates.hasOwnProperty(date)) {
              //console.log(date + " -> " + dates[date]);
              weekly.push(dates[date]);
            }
          }
        }
      }
    console.log(weekly)
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
            <div style={styles.root}>
              <GridList
                cellHeight={180}
                style={styles.gridList}
              >      
            {weekly && 
              map(weekly, (menu,id) => (  
                          map(menu, (item,date) => ( 
                          <GridTile
                            key={date}
                            title={item.name}
                            subtitle={<span> Qty <b>{item.quantity}</b></span>}
                            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                          >
                            <img src="http://www.material-ui.com/v0.19.4/images/grid-list/burger-827309_640.jpg" />
                          </GridTile>
                         ))
                          
                          
                      
                
              ))} 
              
              </GridList>
              </div>
            {account && account.rolename === 'admin' &&    
            <DatePicker
              hintText="Select Date"
              value={this.state.date}
              onChange={this.handleDateChange}
              formatDate={this.formatDate}
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
                      />

                      <TextField
                        hintText={`Type product #${idx + 1} quantity`}
                        value={dailyMenu.quantity}
                        onChange={this.handleDailyMenuQtyChange(idx)}
                      />
                      <button type="button" onClick={this.handleRemoveDailyMenu(idx)} className="small">-</button>
                    </div>
                  ))}
                  <button type="button" onClick={this.handleAddDailyMenu} className="small">Add</button>
                </List>


                <button type="button" onClick={this.saveMenu} className="small">Save Menu</button>
              </form>
            )}  
          
          </Paper>  
         
        </div>
      </div>
    )
  }
}
