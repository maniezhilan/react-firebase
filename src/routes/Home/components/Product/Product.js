import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './Product.scss'
import { withStyles } from 'material-ui/styles';
import { ListItem} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Delete from 'material-ui/svg-icons/action/delete'
import Update from 'material-ui/svg-icons/action/update'
import Icon from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { isObject } from 'lodash'



export default class Product extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      product: Object.assign({}, this.props.product)
      }
     
    }

  static propTypes = {
    product: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onSelectClick: PropTypes.func,
    account: PropTypes.object,
  }

 


  

  render() {
    const { product, id, onSelectClick, onDeleteClick, onEditClick, account, editProductModal } = this.props
    return (
      <div className={classes.container}>
      
        <ListItem
          // leftIcon={ account && account.rolename === 'admin' &&  
          //   <Checkbox
          //     defaultChecked={product.done}
          //   onCheck={() => onSelectClick(product, product._key || id)}
          //   />
          // }
          
          // rightIcon={ account && account.rolename === 'admin' &&
          //   <Delete onClick={() => onDeleteClick(product._key || id)} />
          // }

          rightIconButton={
            account && account.rolename === 'admin' &&
            
            <FlatButton label="Edit" secondary={true} onClick={() => onEditClick(product,product._key || id)}>
              
            </FlatButton>
            
          }
         
            
          secondaryText={
            <p>

              <span className="Product-Text">{product.name}  Price for 1 $: {product.price}</span>
              <br />
              
              <span className="Product-Price">Ordered Qty: {product.quantity} {product.uom}</span>
              <br />
            </p>
          }
          secondaryTextLines={2}
          
        />
        
      </div>
    )
  }
}
