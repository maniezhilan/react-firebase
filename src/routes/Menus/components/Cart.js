import React from 'react'
import PropTypes from 'prop-types'
import Product from './Product'
import { ADD_TO_CART } from 'constants'
import { map } from 'lodash'


const Cart = ({ date, orderDates, total, onCheckoutClicked }) => {
    const hasOrders = orderDates.length > 0
    const nodes = hasOrders ? (
        orderDates.map(product =>
            map(product, (item, id) => ( 
            <Product
                    title={product[item].name}
                    //price={product.price}
                    quantity={product[item].quantity}
                    key={product[item].productId}
            />
            ))
        )
    ) : (
            <em></em>
        )

    return (
        <div>
            
            <div>{nodes}</div>
            
            <button onClick={onCheckoutClicked}
                disabled={hasOrders ? '' : 'disabled'}>
                Checkout
      </button>
        </div>
    )
}

Cart.propTypes = {
    orders: PropTypes.object,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}

export default Cart
