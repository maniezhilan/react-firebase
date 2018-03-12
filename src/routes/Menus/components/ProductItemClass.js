import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Product from './Product'
import AddToCartButton from './AddToCartButton'
import { TextField } from 'redux-form-material-ui'




export default class ProductItemClass extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            dailyOrders: [{ productId: '', name: '', quantity: 0 }],
            orderDates: []
        }
    }

    static propTypes = {
        product: PropTypes.shape({
            name: PropTypes.string.isRequired,
            //price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired
        }).isRequired
        
    }

    //TODO: parent comp need to get these states to show in cart
    orders = (event) => {
        //console.log(event.currentTarget)
        let date = event.currentTarget.getAttribute('data-date')
            // this.setState(prevState => ({
            //     orderDates: [...prevState.orderDates, date]
            // }))
        let newDailyOrders = { productId: event.currentTarget.id, name: event.currentTarget.name, quantity: parseInt(event.currentTarget.value) }
            // this.setState({
            //      dailyOrders: newDailyOrders
            //  })
        //console.log(date, newDailyOrders)
        this.props.showCart(date,newDailyOrders)     
    }

    render() {
        const { product, date, showCart } = this.props
        
        return (
            <div className="counter">
                <Product
                    title={product.name}
                    price={product.price}
                    quantity={product.quantity}

                />
                {product.quantity > 0 ? <AddToCartButton qty={this.orders} product={product} date={date}
                     type="button"
                 /> : 'Sold Out'
                 }
            </div>
        )
    }
}