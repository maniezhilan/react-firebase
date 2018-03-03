import React from 'react'
import PropTypes from 'prop-types'

const Product = ({ price, quantity, title }) => (
    <div>
        {title} - {quantity}
    </div>
)

Product.propTypes = {
    price: PropTypes.number,
    quantity: PropTypes.number,
    title: PropTypes.string
}

export default Product
