import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider';



const Product = ({ price, quantity, description, title, minimumQty, uom}) => {
 
   return ( 
        <div>
           <b>{title}</b> 
           <Divider/>
           {description}
           <Divider />
           <b>Price</b>: $:{price}
           <Divider />
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
