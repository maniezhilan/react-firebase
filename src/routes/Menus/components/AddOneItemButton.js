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
import RaisedButton from 'material-ui/RaisedButton';

export default class AddOneItemButton extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context)
        this.state ={
            count: props.product.minimumQty,
            id:'',
            name:'',
            date:'',
            price: props.product.price
        }
    }

    static propTypes ={
        incrementCount: PropTypes.func,
        decrementCount: PropTypes.func,
        qty: PropTypes.func

    }

    incrementCount = (event) => {
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
        
        this.setState({
            price: this.props.product.price
        })
     
    }

    decrementCount = (event) => {
        if (this.state.count!==1){
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
        
    }

    handleChange = (e) => {
        this.setState({ count: e.target.value });
    }


    render() {
        const { count, price } = this.state
        const { product, date } = this.props

        return (
            
            <div className="counter">
                {
                    <IconButton secondary={true} onClick={this.decrementCount} disabled={(count <= product.minimumQty)}>
                        <SvgIconRemoveCircle />
                    </IconButton>
                }

                 {count}
 
                {
                    <IconButton secondary={true}  onClick={this.incrementCount} disabled={(count >= product.quantity)}>
                        <SvgIconAddCircle />
                    </IconButton>
                }
                <RaisedButton hoverColor="white" label={`Add  ${count}   to cart $ ${(count*price)}`} primary />
            </div>
        )
    }
}