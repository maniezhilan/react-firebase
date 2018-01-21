import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './Product.scss'
import { ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Delete from 'material-ui/svg-icons/action/delete'
import { isObject } from 'lodash'

export default class Product extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onDeleteClick: PropTypes.func,
    onCompleteClick: PropTypes.func
  }
  render() {
    const { product, id, onCompleteClick, onDeleteClick } = this.props
    return (
      <div className={classes.container}>
        <ListItem
          leftIcon={
            <Checkbox
              defaultChecked={product.done}
              onCheck={() => onCompleteClick(product, product._key || id)}
            />
          }
          rightIcon={<Delete onClick={() => onDeleteClick(product._key || id)} />}
          secondaryText={
            <p>

              <span className="Product-Text">{product.text}</span>
              <br />
              <span className="Product-Description">{product.description}</span>
              <br />
              <span className="Product-Price">{product.price}</span>
              <br />
            </p>
          }
          secondaryTextLines={2}
        />
      </div>
    )
  }
}
