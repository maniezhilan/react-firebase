import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form'
import { map } from 'lodash'
import { ADD_TO_CART_FORM_NAME } from 'constants'
import ProductsList from './ProductsList'
import ProductItemClass from './ProductItemClass'
import classes from './CheckoutDialog.scss'


export const CheckoutDialog = ({
    open,
    onRequestCloseMenu,
    onSubmit,
    myCart,
    submit,
    totalPrice,
}) => (
    <Dialog
        //autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        title="Checkout"
        open={open}
        contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestCloseMenu} />,
                <RaisedButton label="Checkout" primary={true} onTouchTap={submit} />
            ]}>
            <form onSubmit={onSubmit} className={classes.inputs}>
                {myCart && 
                    [...myCart].map(([date, items]) => {
                    return <div key={date} > <h4> {date} </h4> 
                        {
                            items.map((object, i) => <div key={i}> {object.name} - {object.quantity}</div>
                        )}
                     </div> 
                    })
                }  
                Total: $ {totalPrice}
            </form>  
           </Dialog>   
)

CheckoutDialog.PropTypes = {
    open: PropTypes.bool,
    onRequestCloseMenu: PropTypes.bool,
    onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func, // added by redux-form
    submit: PropTypes.func, // added by redux-form
}

export default reduxForm({
    form: ADD_TO_CART_FORM_NAME
})(CheckoutDialog)
