import React from 'react'
import PropTypes from 'prop-types'


const ProductsList = ({ name, children, showCart }) => (
    <div>
        <h3>{name}</h3>
        <div>{children}</div>
        --{showCart}
    </div>
)

ProductsList.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired
}

export default ProductsList
