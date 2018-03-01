import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { map } from 'lodash'
import classes from './CartDialog.scss'
import { ADD_TO_CART_FORM_NAME } from 'constants'

export const CartDialog = ({
    open,
    onRequestCloseMenu,
    saveCart,
    submit,
    menus
}) => (
    <Dialog
        title="Cart"
        open={open}
        contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestCloseMenu} />,
                <FlatButton label="Submit" primary onTouchTap={submit} />
            ]}>
            <form onSubmit={saveCart} className={classes.inputs}>
                {menus &&
                    map(menus, (date, idx) => (
                        map(date, (item, id) => (
                            <li key={id}>{idx}--{item.name} x {item.quantity}</li>
                        ))
                    ))
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
}

export default reduxForm({
    form: ADD_TO_CART_FORM_NAME
})(CartDialog)