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
    const { text } = this.state
    const { description } = this.state
    const { price } = this.state
    this.props.onNewClick({ text, description, price})
    this.refs.newProductText.getInputNode().value = ''
    this.refs.newProductPrice.getInputNode().value = ''
    this.refs.newProductDescription.getInputNode().value = ''

  }


  render() {
    const { product, disabled, editProductModal} = this.state
    console.log('prod', product, editProductModal)
    return (
      
      <Paper className={classes.container}>
        <Subheader>New Product</Subheader>
        <div className={classes.inputSection}>
          <TextField
            floatingLabelText="New Product Text"
            ref="newProductText"
            value={editProductModal ? product.text : ''}
            onChange={({ target }) => this.setState({ text: target.value })}
          />
          <TextField
            floatingLabelText="New Product Description"
            ref="newProductDescription"
            onChange={({ target }) => this.setState({ description: target.value })}
          />
          <TextField
            floatingLabelText="New Product Price"
            ref="newProductPrice"
            onChange={({ target }) => this.setState({ price: target.value || ''})}
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
