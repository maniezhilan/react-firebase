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
            date:''
        }
    }

    static propTypes ={
        incrementCount: PropTypes.func,
        decrementCount: PropTypes.func,
        qty: PropTypes.func

    }

    incrementCount = () => {
        this.setState({
            count: this.state.count + 1
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

    }

    decrementCount = () => {
        if (this.state.count!==0){
            this.setState({
                count: this.state.count - 1
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
    }


    render() {
        const { count } = this.state
        const { product, date } = this.props

        return (
            <div className="counter">
                {
                    <IconButton secondary={true} mini={true} onClick={this.incrementCount} disabled={(count >= product.quantity)}>
                        <SvgIconAddCircle />
                    </IconButton>
                }
                <span> {count} </span>
                {
                    <IconButton secondary={true} mini={true} onClick={this.decrementCount} disabled={(count <= 0)}>
                        <SvgIconRemoveCircle/>
                    </IconButton>
                }
                {
                    <IconButton data-date={date} name={this.state.name} value={count} id={this.state.id} onClick={this.props.qty} disabled={(count === 0 || count > product.quantity)}>
                        <SvgIconAddShoppingCart/>
                    </IconButton>
                }
            </div>
        )
    }
}