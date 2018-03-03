import React from 'react'
import PropTypes from 'prop-types'
import Product from './Product'

const Cart = ({ date, orders, total, onCheckoutClicked }) => {
    const hasOrders = orders.length > 0
    const nodes = hasOrders ? (
        orders.map(order =>
            <Product
                title={order.name}
                //price={product.price}
                quantity={order.quantity}
                key={order.productId}
            />
        )
    ) : (
            <em>Please add some products to cart.</em>
        )

    return (
        <div>
            <h3>{date}</h3>
            <div>{nodes}</div>
            <p>Total: &#36;{total}</p>
            <button onClick={onCheckoutClicked}
                disabled={hasOrders ? '' : 'disabled'}>
                Checkout
      </button>
        </div>
    )
}

Cart.propTypes = {
    orders: PropTypes.array,
    total: PropTypes.string,
    onCheckoutClicked: PropTypes.func
}

export default Cart
