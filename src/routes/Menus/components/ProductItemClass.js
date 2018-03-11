import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Product from './Product'
import AddToCartButton from './AddToCartButton'
import { TextField } from 'redux-form-material-ui'




export default class ProductItemClass extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            dailyOrders: [{ productId: '', name: '', quantity: 0 }],
            orderDates: []
        }
    }

    static propTypes = {
        product: PropTypes.shape({
            name: PropTypes.string.isRequired,
            //price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired
        }).isRequired
        
    }

    //TODO: parent comp need to get these states to show in cart
    orders = (event) => {
        let date = event.target.getAttribute('data-date')
            this.setState(prevState => ({
                orderDates: [...prevState.orderDates, date]
            }))
             let newDailyOrders = { productId: event.target.id, name: event.target.name, quantity: event.target.value }
            this.setState({
                 dailyOrders: newDailyOrders
             })
        this.props.showCart = this.state.dailyOrders
    }

    render() {
        const { product, date, showCart } = this.props
        
        return (
            <div className="counter">
                <Product
                    title={product.name}
                    price={product.price}
                    quantity={product.quantity}

                />
                {product.quantity > 0 ? <AddToCartButton qty={this.orders} product={product} date={date}
                     type="button"
                 /> : 'Sold Out'
                 }
            </div>
        )
    }

    // render() {
    //     //const { count } = this.state
    //     const { product, orders } = this.props

    //     return 
    //     (
    //         <div style={{ marginBottom: 20 }}>
    //             <Product
    //                 title={product.name}
    //                 price={product.price}
    //                 quantity={product.quantity}
    //             />
    //             {/* {product.quantity > 0 ? <AddToCartButton qty={orders} product={product}
    //                 type="button"
    //             /> : 'Sold Out'
    //             } */}
    //         </div>
    //     )

    // }    
}

// let qty=0;
// let id=''
// function UpdateCount(event){
//     qty = event.target.value
//     console.log(qty,'---',event.target.id)
//     id = event.target.id
//     return event.target.value
// }



// const ProductItem = ({ product, handleToUpdate}) => (

    
    
//     <div style={{ marginBottom: 20 }}>
//         <Product
//             title={product.name}
//             price={product.price}
//             quantity={product.quantity} 
            
//             />
        
        
//         {product.quantity > 0 ? <AddToCartButton qty={UpdateCount} product={product}
//             type="button"
//              /> : 'Sold Out'
//         }
//     </div>
// )

// ProductItem.propTypes = {
//     product: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         //price: PropTypes.number.isRequired,
//         quantity: PropTypes.number.isRequired
//     }).isRequired,
//     //onAddToCartClicked: PropTypes.func.isRequired
//     handleToUpdate: PropTypes.func.isRequired
// }

//export default ProductItemClass
