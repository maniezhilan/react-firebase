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
  static propTypes = {
    product: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onCompleteClick: PropTypes.func,
    account: PropTypes.object
  }
  render() {
    const { product, id, onCompleteClick, onDeleteClick, onEditClick, account } = this.props
    return (
      <div className={classes.container}>
      
        <ListItem
          leftIcon={ account && account.rolename === 'admin' &&  
            <Checkbox
              defaultChecked={product.done}
              onCheck={() => onCompleteClick(product, product._key || id)}
            />
          }
          
          // rightIcon={ account && account.rolename === 'admin' &&
          //   <Delete onClick={() => onDeleteClick(product._key || id)} />
          // }

          rightIconButton={
            account && account.rolename === 'admin' &&
            
            <FlatButton label="Edit" secondary={true} onClick={() => onEditClick(product,product._key || id)} />
            
          }
         
            
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
          //secondaryTextLines={2}
          
        />
        
      </div>
    )
  }
}
