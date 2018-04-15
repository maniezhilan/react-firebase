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



const customContentStyle = {
    width: '100%',
    maxWidth: 'none',
};


export const CartDialog = ({
    open,
    onRequestCloseMenu,
    onRequestCloseCart,
    onSubmit,
    menus,
    orderDates,
    addToCart,
    count,
    showCart,
    submit,
    cartCount,
    showCartContent,
    checkoutCart,
    myCart,
    cartTotal,
    totalPrice
}) => (
    <Dialog
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        title="Cart"
        open={open}
        contentClassName={classes.container}
            contentStyle={customContentStyle}
            actions={[
                <FlatButton hoverColor="white" label="Cancel" secondary onTouchTap={onRequestCloseCart} />,
                // <RaisedButton label="Checkout" primary={true} onTouchTap={submit} />
            ]}>
            <form onSubmit={onSubmit} className={classes.inputs}>
            
                {menus &&
                    map(menus, (product, date) => (    
                    <ProductsList title="Products" name={date} key={date}>
                            
                                {map(product,(item,id) => (
                            <ProductItemClass 
                                    key={id}
                                    date={date}
                                    product={item}
                                    showCart ={showCart}
                                    showCartContent={showCartContent}
                                    checkoutCart={checkoutCart}
                                    cartTotal={cartTotal}
                                    />
                                ))}
                            
                        </ProductsList>
                    ))}
                  <CartClass 
                    count={cartCount}
                    myCart={myCart}
                    totalPrice={totalPrice}
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
