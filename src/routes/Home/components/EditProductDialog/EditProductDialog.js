import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { EDIT_PRODUCT_FORM_NAME } from 'constants'

import classes from './EditProductDialog.scss'



export const EditProductDialog = ({
  open,
  onRequestClose,
  submit,
  handleSubmit,
  product
}) => (
  
  <Dialog
    title="Edit Product"
    open={open}
    product={product}
    onRequestClose={onRequestClose}
    contentClassName={classes.container}
    actions={[
      <FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
      <FlatButton label="Create" primary onTouchTap={submit} />
    ]}>
    <form onSubmit={handleSubmit} className={classes.inputs}>
        <TextField
        value={product.text}
        floatingLabelText="Name"
        validate={[required]}
      />
        <TextField
          value={product.description}
          floatingLabelText="Description"
          validate={[required]}
        />
        <TextField
          value={product.price}
          floatingLabelText="Price"
          validate={[required]}
        />
    </form>
  </Dialog>
)

EditProductDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  //onRequestClose: PropTypes.func.isRequired,
  //onSubmit: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func.isRequired, // added by redux-form
  submit: PropTypes.func.isRequired, // added by redux-form
  product: PropTypes.object.isRequired
}


export default reduxForm({
  form: EDIT_PRODUCT_FORM_NAME
})(EditProductDialog)
