import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form'
import { map } from 'lodash'
import classes from './CartDialog.scss'
import { ADD_TO_CART_FORM_NAME } from 'constants'
import CartClass from './CartClass'
import ProductsList from './ProductsList'
import ProductItemClass from './ProductItemClass'

let myCart = new Map();

function checkoutCart(date,item){
    console.log(date,item)
    if (myCart.has(date)){
        let val = myCart.get(date)
        console.log('val ---', val)  
        let newVal = val.concat(item)
        console.log('val concat---', newVal)  
        myCart.set(date, newVal)  
        console.log(date,'---print cart ---', myCart.get(date))  
    }else{
        myCart.set(date,[item])
    }
}

export const CartDialog = ({
    open,
    onRequestCloseMenu,
    onSubmit,
    menus,
    orderDates,
    total,
    addToCart,
    count,
    increment,
    decrement,
    showCart,
    forceUpdate,
    submit,
    cartCount,
    showCartContent
}) => (
    <Dialog
        //autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        title="Cart"
        open={open}
        contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestCloseMenu} />,
                // <RaisedButton label="Checkout" primary={true} onTouchTap={submit} />
            ]}>
            <form onSubmit={onSubmit} className={classes.inputs}>
            
                {menus &&
                    map(menus, (product, date) => (    
                    <ProductsList title="Products" name={date}>
                            
                                {map(product,(item,id) => (
                            <ProductItemClass 
                                    key={id}
                                    date={date}
                                    product={item}
                                    showCart ={showCart}
                                    forceUpdate={forceUpdate}
                                    showCartContent={showCartContent}
                                    checkoutCart={checkoutCart}
                                    />
                                ))}
                            
                        </ProductsList>
                    ))}
                  <CartClass 
                    count={cartCount}
                    myCart={myCart}
                  />  
            </form>  
           </Dialog>   
)

CartDialog.PropTypes = {
    open: PropTypes.bool,
    onRequestCloseMenu: PropTypes.bool,
    onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func, // added by redux-form
    submit: PropTypes.func, // added by redux-form
    handleToUpdate: PropTypes.func
}

export default reduxForm({
    form: ADD_TO_CART_FORM_NAME
})(CartDialog)
