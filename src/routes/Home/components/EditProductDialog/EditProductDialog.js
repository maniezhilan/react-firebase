import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { EDIT_PRODUCT_FORM_NAME } from 'constants'

import classes from './EditProductDialog.scss'

export default class EditProductDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {disabled: false, editProductModal: true, product: props.product }
  }

  static propTypes = {
    onEditClick: PropTypes.func,
    disabled: PropTypes.bool,
  }


  handleEdit = (product) => {
    // const { editProduct } = this.refs
    // const { text } = this.state
    // const { description } = this.state
    // const { price } = this.state
    // //this.props.onEditClick({ text, description, price })
    // this.refs.editProductText.getInputNode().value = text
    // this.refs.editProductPrice.getInputNode().value = price
    // this.refs.editProductDescription.getInputNode().value = description

  }


  render() {
    //const { product, disabled, editProductModal, onRequestClose, open, submit, handleEdit } = this.state
    //const { text } = this.state
    //const { description } = this.state
    //const { price } = this.state
    

    return (

    <Dialog
    title="Edit Product"
    open={true}
    product={this.state.product}
    //onRequestClose={onRequestClose}
    contentClassName={classes.container}
    actions={[
     // <FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
      //<FlatButton label="Update" primary onTouchTap={submit} />
    ]}>
      <form  className={classes.inputs}>
          <TextField
            floatingLabelText="Edit Product Text"
            //ref="editProductText"
            value={this.state.product.text}
            onChange={({ target }) => this.setState({ text: target.value })}
      />
        {/* <TextField
          floatingLabelText="Description"
          //validate={[required]}
          name="description"
          value={product.description}
          multiLine={true}
          rows={5}
        />
        <TextField
          floatingLabelText="Price"
          name="price"
          value={product.price}
        /> */}
    </form>
  </Dialog>
)

  }
}


// export const EditProductDialog = ({
//   open,
//   onRequestClose,
//   submit,
//   handleEdit,
//   product,
//   self
// }) => (
  
//   <Dialog
//     title="Edit Product"
//     open={open}
//     product={product}
//     onRequestClose={onRequestClose}
//     contentClassName={classes.container}
//     actions={[
//       <FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
//       <FlatButton label="Update" primary onTouchTap={submit} />
//     ]}>
//       <form onSubmit={handleEdit} className={classes.inputs}>
//         <TextField
//         name="text"
//         value={product.text}
//         floatingLabelText="Name"
//         validate={[required]}
//         onChange={({ target }) => self.setState({ text: target.value })}
//       />
//         <TextField
//           floatingLabelText="Description"
//           validate={[required]}
//           name="description"
//           value={product.description}
//           multiLine={true}
//           rows={5}
//         />
//         <TextField
//           floatingLabelText="Price"
//           name="price"
//           value={product.price}
//         />
//     </form>
//   </Dialog>
// )

EditProductDialog.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  handleSubmit: PropTypes.func, // added by redux-form
  submit: PropTypes.func, // added by redux-form
  product: PropTypes.object.isRequired
}


// export default reduxForm({
//   form: EDIT_PRODUCT_FORM_NAME
// })(EditProductDialog)
