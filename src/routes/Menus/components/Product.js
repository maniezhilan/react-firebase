import React from 'react'
import PropTypes from 'prop-types'




const Product = ({ price, quantity, title, minimumQty, uom}) => {
 
   return ( 
        <div>
           <b>{title}</b>  $:{price} for {minimumQty} {uom}
        </div>
   )
}

Product.propTypes = {
    price: PropTypes.number,
    quantity: PropTypes.number,
    title: PropTypes.string,
    minimumQty: PropTypes.number,
    uom: PropTypes.string
    //increment: PropTypes.func.isRequired,
    //decrement: PropTypes.func.isRequired,
}

export default Product
