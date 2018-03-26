import React from 'react'
import PropTypes from 'prop-types'




const Product = ({ price, quantity, title}) => {
 
   return ( 
        <div>
           {title} {quantity} {price}
           
        </div>
   )
}

Product.propTypes = {
    price: PropTypes.number,
    quantity: PropTypes.number,
    title: PropTypes.string,
    //increment: PropTypes.func.isRequired,
    //decrement: PropTypes.func.isRequired,
}

export default Product
