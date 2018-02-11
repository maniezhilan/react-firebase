import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { CREATE_MENU_FORM_NAME } from 'constants'
import { map } from 'lodash'
import classes from './MenuDialog.scss'
import Subheader from 'material-ui/Subheader'
import { List } from 'material-ui/List'

export const MenuDialog = ({
  open,
    handleEdit,
    products,
    onChange,
    onRequestCloseMenu,
    submit,
    menu
}) => (

        <Dialog
            title="Menu"
            open={open}
            products={products}
            onRequestCloseMenu={onRequestCloseMenu}
            contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestCloseMenu} />,
                <FlatButton label="Submit" primary onTouchTap={submit} />
            ]}>
            <form >
               
                <Subheader> Week:  {menu.startDate.toString()}  - {menu.endDate.toString()} </Subheader>
                <List className={classes.list}>
                {products &&
                    map(products, (product, id) => (
                    <span key={product.key}>
                        {product.text}
                    </span>
                    )
                )
                }
                </List>
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
    products: PropTypes.array
}


export default reduxForm({
    form: CREATE_MENU_FORM_NAME
})(MenuDialog)
