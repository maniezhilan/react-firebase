import React from 'react'
import PropTypes from 'prop-types'

const textStyle={
    textDecoration: 'underline'
}


const ProductsList = ({ name, children}) => (
    <div>
        <h3 style={textStyle}>{name}</h3>
        <div>{children}</div>
    </div>
)

ProductsList.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired
}

export default ProductsList
