import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import IconButton from 'material-ui/IconButton';
import SvgIconAddShoppingCart from "material-ui/svg-icons/action/add-shopping-cart";
import SvgIconAddCircle from "material-ui/svg-icons/content/add-circle";
import SvgIconRemoveCircle from "material-ui/svg-icons/content/remove-circle";
import TextField from 'material-ui/TextField';

export default class AddToCartButton extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
        this.state ={
            count: 0,
            id:'',
            name:'',
            date:'',
            price: 0
            //inputValue:''
        }
    }

    static propTypes ={
        incrementCount: PropTypes.func,
        decrementCount: PropTypes.func,
        qty: PropTypes.func

    }

    counter = () => {

    }

    incrementCount = (event) => {
        //this.props.qty(event)
        this.setState({
            count: this.state.count + this.props.product.minimumQty
        });
        this.setState({
            id: this.props.product.productId
        });
        this.setState({
            name: this.props.product.name
        })
        this.setState({
            date: this.props.date
        })
        console.log('this.props.product.minimumQty', this.props.product.minimumQty)
        this.setState({
            price: this.props.product.price
        })
       
    }

    decrementCount = (event) => {
        if (this.state.count!==0){
            this.setState({
                count: this.state.count - this.props.product.minimumQty
            });
        }
        this.setState({
            id: this.props.product.productId
        });
        this.setState({
            name: this.props.product.name 
        })
        this.setState({
            date: this.props.date
        })
        this.setState({
            price: this.props.product.price
        })
        console.log('this.props.product.minimumQty', this.props.product.minimumQty)
        //this.props.qty(event)
    }

    handleChange = (e) => {
        this.setState({ count: e.target.value });
    }


    render() {
        const { count,price } = this.state
        const { product, date } = this.props
        //console.log('count::', count, ':', product)


        return (
            <div className="counter">
                {
                    <IconButton secondary={true} onClick={this.decrementCount} disabled={(count <= 0)}>
                        <SvgIconRemoveCircle />
                    </IconButton>
                }

                {/* <IconButton data-date={date} data-price={product.price} name={product.name} value={count} id={product.id} onClick={this.props.qty} disabled={(count === 0 )}>
                    <SvgIconRemoveCircle />
                </IconButton> */}
                
                {/* <input type="number" id={this.state.id} data-date={date} name={this.state.name} value={count} onChange={this.handleChange} onBlur={this.props.qty} /> */}
                {count} {product.uom}.
                
                {/* <IconButton data-date={date} data-price={this.state.price} name={this.state.name} value={count} id={this.state.id} onClick={this.props.qty} disabled={(count >= product.quantity)}>
                    <SvgIconAddCircle />
                </IconButton> */}
                
                {
                    <IconButton secondary={true}  onClick={this.incrementCount} disabled={(count >= product.quantity)}>
                        <SvgIconAddCircle />
                    </IconButton>
                }

                {
                    <IconButton data-date={date} data-price={this.state.price} name={this.state.name} value={count} id={this.state.id} onClick={this.props.qty} disabled={(count > product.quantity)}>
                        <SvgIconAddShoppingCart />
                    </IconButton>
                }
            </div>
        )
    }
}