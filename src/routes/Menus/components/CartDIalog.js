import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { map } from 'lodash'
import classes from './CartDialog.scss'
import { ADD_TO_CART_FORM_NAME } from 'constants'
import Cart from './Cart'
import ProductsList from './ProductsList'
import ProductItemClass from './ProductItemClass'



export const CartDialog = ({
    open,
    onRequestCloseMenu,
    handleSubmit,
    onSubmit,
    menus,
    orderDates,
    total,
    addToCart,
    count,
    increment,
    decrement,
    showCart
}) => (
    <Dialog
        //autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        title="Cart"
        open={open}
        contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestCloseMenu} />,
                <FlatButton label="Submit" primary onTouchTap={onSubmit} />
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
                                    />
                                ))}
                            
                        </ProductsList>
                    ))}
                {orderDates && 
                //orderDates.map((orders, date) => (     
                   //map(orders, (item, id) => ( 
                    <Cart
                    orderDates={orderDates}
                        //total={total}
                        //date={date}
                    onCheckoutClicked={() => checkout(orderDates)}
                          /> 
                    // ))
                   // ))
                }
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
