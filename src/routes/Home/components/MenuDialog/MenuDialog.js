import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { CREATE_MENU_FORM_NAME } from 'constants'

import classes from './MenuDialog.scss'

export const MenuDialog = ({
  open,
    handleEdit,
    product,
    onChange,
    onRequestClose,
    submit
}) => (

        <Dialog
            title="Menu"
            open={open}
            product={product}
            onRequestClose={onRequestClose}
            contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
                <FlatButton label="Update" primary onTouchTap={submit} />
            ]}>
            <form onSubmit={handleEdit} className={classes.inputs}>
                <span>Menu for the week</span>
                <span>Date</span>
                <span>
                    {product.text}
                </span>
                <span>Quantity</span>
                <span></span>
            </form>
        </Dialog>
    )

MenuDialog.propTypes = {
    open: PropTypes.bool,
    onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func, // added by redux-form
    submit: PropTypes.func, // added by redux-form
    product: PropTypes.object.isRequired
}


export default reduxForm({
    form: CREATE_MENU_FORM_NAME
})(MenuDialog)
