import React, { Component } from 'react'
import PropTypes, { bool } from 'prop-types'
import { map, get, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import classes from './OrdersContainer.scss'
import ProductsList from '../../../routes/Menus/components/ProductsList'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import DatePicker from 'material-ui/DatePicker';
import Product from '../../../routes/Home/components/Product'

import {
    firebaseConnect,
    populatedDataToJS,
    pathToJS,
    dataToJS,
    isLoaded
} from 'react-redux-firebase'

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
export default class Orders extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            error: null
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
        orders: PropTypes.oneOfType([
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


    render() {

        const { orders, account} = this.props
        //console.log(orders)

        return (
            <div className={classes.container}>

                <div className={classes.tiles}>

                    <Paper className={classes.paper}>
                        <Subheader>Orders</Subheader>
                        {orders &&
                            map(orders, (products, user) => (
                            //<ProductsList title="Products" name={user} key={user}>
                            <List className={classes.list}>    
                                    {map(products, (product, date) => (
                                    <div key={date}><h4>{date} </h4> 
                                        { map(product, (item, id) => (
                                            < Product 
                                                key={id}
                                                id={id}
                                                product={item}
                                            />
                                        ))}
                                    </div>  
                                    ))}

                                </List>
                            ))}
                    </Paper>
                </div>
             </div>          
        )
    }    
}
