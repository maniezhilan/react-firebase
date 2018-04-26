import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form'
import { map } from 'lodash'
import classes from './AddToCartDialog.scss'
import { ADD_TO_CART_FORM_NAME } from 'constants'
import Product from './Product'
import AddOneItemButton from './AddOneItemButton'
import Divider from 'material-ui/Divider';

const customContentStyle = {
    width: '100%',
    maxWidth: 'none',
};

let closeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px' };

export const AddToCartDialog = ({
    open,
    onRequestCloseMenu,
    onRequestCloseCart,
    onSubmit,
    date,
    product
}) => (
    <Dialog
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        title={
            <div>
                
                <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} hoverColor="white" onTouchTap={onRequestCloseCart} />
            </div>
        }
        open={open}
        contentClassName={classes.container}
        contentStyle={customContentStyle}
        >
            
            <form onSubmit={onSubmit} className={classes.inputs}>
                {/* <img class="img" src="https://duyt4h9nfnj50.cloudfront.net/sku/fb75a356fe77e1d71a101f764033c7ea" /> */}

                <Product
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    quantity={product.quantity}
                    minimumQty={product.minimumQty}
                    uom={product.uom}
                />
                
                {product.quantity > 0 ? <AddOneItemButton product={product} date={date}
                    type="button"
                /> : 'Sold Out'
                }
                
                
            </form>  
           </Dialog>   
)

AddToCartDialog.PropTypes = {
    open: PropTypes.bool,
    onRequestCloseMenu: PropTypes.bool,
    onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func, // added by redux-form
    submit: PropTypes.func, // added by redux-form
    handleToUpdate: PropTypes.func
}

export default reduxForm({
    form: ADD_TO_CART_FORM_NAME
})(AddToCartDialog)
