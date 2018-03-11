import React from 'react'
import PropTypes from 'prop-types'
import Product from './Product'
import AddToCartButton from './AddToCartButton'
import { TextField } from 'redux-form-material-ui'

// let qty=0;
// let id=''
// function UpdateCount(event){
//     qty = event.target.value
//     console.log(qty,'---',event.target.id)
//     id = event.target.id
//     return event.target.value
// }



const ProductItem = ({ product, handleToUpdate}) => (
    <div style={{ marginBottom: 20 }}>
        <Product
            title={product.name}
            price={product.price}
            quantity={product.quantity} 
            />
        {product.quantity > 0 ? <AddToCartButton qty={UpdateCount} product={product}
            type="button"
             /> : 'Sold Out'
        }
    </div>
)

ProductItem.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        //price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired
    }).isRequired,
    //onAddToCartClicked: PropTypes.func.isRequired
    handleToUpdate: PropTypes.func.isRequired
}

export default ProductItem
