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
  submit,
  handleEdit,
  product,
  onChange,
  
}) => (
  
  <Dialog
    title="Edit Product"
    open={open}
    product={product}
    //onRequestClose={onRequestClose}
    contentClassName={classes.container}
    actions={[
      //<FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
      <FlatButton label="Update" primary onTouchTap={submit} />
    ]}>
      <form onSubmit={handleEdit} className={classes.inputs}>
        <span>--{product.id}</span>
        <TextField
        name="text"
        value={product.text}
        floatingLabelText="Name"
        onChange={onChange}
      />
        <TextField
          floatingLabelText="Description"
          name="description"
          value={product.description}
          multiLine={true}
          rows={5}
        />
        <TextField
          floatingLabelText="Price"
          name="price"
          value={product.price}
        />
    </form>
  </Dialog>
)

EditProductDialog.propTypes = {
  open: PropTypes.bool,
  //onRequestClose: PropTypes.func,
  onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func, // added by redux-form
  submit: PropTypes.func, // added by redux-form
  product: PropTypes.object.isRequired
}


export default reduxForm({
  form: EDIT_PRODUCT_FORM_NAME
})(EditProductDialog)
