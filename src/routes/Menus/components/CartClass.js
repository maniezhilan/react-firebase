import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Product from './Product'
import { ADD_TO_CART } from 'constants'
import { map } from 'lodash'
import RaisedButton from 'material-ui/RaisedButton';

export default class CartClass extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
    }


    

    render() {
        const { count } = this.props
        return (
            <div className="counter">
               {/* <button type="button" >View cart: {count}</button> */}
                <RaisedButton secondary label={`View cart: ${count}`} primary={true}/>
            </div>
        )
    }
}

// const Cart = ({ date, orderDates, total, onCheckoutClicked }) => {
//     const hasOrders = orderDates.length > 0
//     const nodes = hasOrders ? (
//         orderDates.map(product =>
//             map(product, (item, id) => ( 
//             // <Product
//             //     title={product.name}
//             //         //price={product.price}
//             //     quantity={product.quantity}
//             //     key={product.productId}
//             // />
//             <span>{item}</span>
//             ))
//         )
//     ) : (
//             <em></em>
//         )

//     return (
//         <div>
            
//             <div>{nodes}</div>
            
//             <button onClick={onCheckoutClicked}
//                 disabled={hasOrders ? '' : 'disabled'}>
//                 Checkout
//       </button>
//         </div>
//     )
// }

// Cart.propTypes = {
//     orders: PropTypes.object,
//     total: PropTypes.string,
//     onCheckoutClicked: PropTypes.func
// }

// export default Cart
