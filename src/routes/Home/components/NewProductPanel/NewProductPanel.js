import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Subheader from 'material-ui/Subheader'
import classes from './NewProductPanel.scss'



export default class NewProductPanel extends Component {

  constructor() {
    super()
    this.state = { id: null, disabled: false, editProductModal: false}
  }

  static propTypes = {
    onNewClick: PropTypes.func,
    disabled: PropTypes.bool,
  }


  handleAdd = () => {
    const { newProduct } = this.refs
    const { name, description, price, uom, minimumQty} = this.state
    this.props.onNewClick({ name, description, price, uom, minimumQty})
    this.refs.newProductText.getInputNode().value = ''
    this.refs.newProductPrice.getInputNode().value = ''
    this.refs.newProductDescription.getInputNode().value = ''
    this.refs.newProductUom.getInputNode().value = ''
    this.refs.newProductMinimumQty.getInputNode().value = ''
  }


  render() {
    const { product, disabled} = this.state
    return (
      
      <Paper className={classes.container}>
        <Subheader>New Product</Subheader>
        <div className={classes.inputSection}>
          <TextField
            floatingLabelText="New Product Name"
            ref="newProductText"
            onChange={({ target }) => this.setState({ name: target.value })}
          />
          <TextField
            floatingLabelText="New Product Description"
            ref="newProductDescription"
            onChange={({ target }) => this.setState({ description: target.value })}
          />
          <TextField
            floatingLabelText="New Product Price"
            ref="newProductPrice"
            onChange={({ target }) => this.setState({ price: parseFloat(target.value) || 0})}
          />
          <TextField
            floatingLabelText="Units of measurement"
            ref="newProductUom"
            onChange={({ target }) => this.setState({ uom: target.value || '' })}
          />
          <TextField
            floatingLabelText="minimumQty"
            ref="newProductMinimumQty"
            onChange={({ target }) => this.setState({ minimumQty: parseFloat(target.value) || 0 })}
          />
          
          <IconButton
            onClick={() => this.handleAdd()}
                  disabled={disabled}
                  tooltipPosition="top-center"
                  tooltip={disabled ? 'Login To Add Product' : 'Add Product'}>
                  <ContentAdd />
          </IconButton>
          
        </div>
      </Paper>
    )
  }
}
