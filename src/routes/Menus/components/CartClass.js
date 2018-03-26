import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Product from './Product'
import { ADD_TO_CART } from 'constants'
import { map } from 'lodash'
import RaisedButton from 'material-ui/RaisedButton';
import CheckoutDialog from "../components/CheckoutDialog"

export default class CartClass extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            openCart: false,
        }
    }


    openCart = () => {
        this.setState({ openCart: !this.state.openCart })
    }
    onRequestCloseMenu = () => {
        this.setState({ openCart: !this.state.openCart })
    }

    

    render() {
        const { count, myCart, totalPrice  } = this.props
        console.log('totalPrice::',totalPrice)
        const { openCart } = this.state
        return (
            <div className="counter">
               {/* <button type="button" >View cart: {count}</button> */}
                <RaisedButton secondary label={`Cart Items: ${count} : Total: $ ${totalPrice} `} primary={true} onTouchTap={this.openCart}/>

                {openCart && 
                    <CheckoutDialog
                    open={openCart}
                    onRequestCloseMenu={this.onRequestCloseMenu}
                    myCart={myCart}
                    totalPrice={totalPrice}
                    />

                }
            </div>
        )
    }
}

