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
import DatePicker from 'material-ui/DatePicker';
import NewMenuForm from '../routes/Menu/components/NewMenuForm/NewMenuForm'
import Product from '../../Home/components/Product'


@firebaseConnect([
    { path: 'menus', queryParams: ['orderByKey', 'limitToLast=5'] }, // 10 most recent
    { path: 'products', queryParams: ['orderByKey', 'limitToLast=5'] }
])
@connect(({ firebase }, { params }) => ({
  auth: pathToJS(firebase, 'auth'),
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
      searchText: '',
      date: Object.assign({}, this.props.date),
      name: '',
      quantity: '',
      dailyMenus: [{ name: '', quantity: '' }],
      showMenuForm: false,
      selectedProducts: Object.assign([], this.props.selectedProducts)
    }
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

  handleNameChange = (evt) => {
    this.setState({ name: evt.target.value });
  }

  handleQtyChange = (evt) => {
    this.setState({ quantity: evt.target.value });
  }

  handleDailyMenuNameChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, name: evt.text };
    });
    this.setState({ dailyMenus: newDailyMenus });
  }

  handleDailyMenuQtyChange = (idx) => (evt) => {
    const newDailyMenus = this.state.dailyMenus.map((dailyMenu, sidx) => {
      if (idx !== sidx) return dailyMenu;
      return { ...dailyMenu, quantity: evt.target.value };
    });

    this.setState({ dailyMenus: newDailyMenus });
  }



  handleAddDailyMenu = () => {
    this.setState({ dailyMenus: this.state.dailyMenus.concat([{ name: '', quantity: '' }]) });
  }

  handleRemoveDailyMenu = (idx) => () => {
    this.setState({ dailyMenus: this.state.dailyMenus.filter((s, sidx) => idx !== sidx) });
  }

  dataSourceConfig = {
    text: 'text',
    value: 'id',
  };



  createMenu = () => {
    this.setState({ showMenuForm: !this.state.showMenuForm })
    let menu = this.state.menu
    let day = this.state.date
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
    let day = this.state.date
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
    const { products } = this.props
    const { menus, auth } = this.props
    const { showMenuForm } = this.state
    // if (!isLoaded(menus, auth)) {
    //   return <LoadingSpinner />
    // }

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
            
            <DatePicker
              hintText="Select Date"
              value={this.state.date}
              onChange={this.handleDateChange}
              //formatDate={this.formatDate}
            />
            <RaisedButton label="Create Menu" primary={true}
              onClick={this.createMenu}/>

            {showMenuForm && (
              <NewMenuForm
                onSubmit={this.saveMenu}
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
            
          </Paper>  
         
        </div>
      </div>
    )
  }
}
