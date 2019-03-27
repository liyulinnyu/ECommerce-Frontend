import React, {PureComponent} from 'react';
import classes from './Cart.module.css';
import GlobalContext from '../../GlobalContext';
import { withRouter } from "react-router-dom";

class Cart extends PureComponent {

    state = {
        totalPrice: 0,
        orderFinished: false,
        thisOrder: null
    }

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.allCounts = [];
        
    }

    changeSelectHandler = (args, index, e) => {
        
        this.context.changeCartHandler(args, parseInt(this.allCounts[index].value));

        // change totalPrice
        this.calculateTotalPrice();
    }


    calculateTotalPrice = () => {
        let total = 0;
        this.context.cart.forEach(item => {
            total += item.selectCount * item.price;
        })
        this.setState({
            totalPrice: total
        });
    }

    componentWillMount() {
        this.calculateTotalPrice();
    }


    createOneOrder = (e) => {
        if (!this.context.isLogin) {
            alert('Please login first');
            this.props.history.push('/login');
            return;
        }
        e.target.style.cssText = 'background-color:#ddd; border:1px solid #ddd; cursor: not-allowed';
        e.target.disabled = 'disabled';

        
        let orders = null;
        orders = this.context.cart.map((item, i) => {
            return {
                productId: item._id + "",
                seller: item.owner._id + "",
                count: item.selectCount
            };
        });
        const requestBody = {
            query: `
                mutation oneOrder($userId: String!, $products: [OrderProduct!]) {
                    createOrder(orderInput:{customer:$userId}, orderProduct:$products){
                        _id,
                        date,
                        products{
                            _id,
                            name,
                            price,
                            count,
                            description,
                            owner {
                                email
                            }
                        }
                    }
                }
            `,
            variables: {
                userId: this.context.userId,
                products: orders
            }
        };
        fetch('/graphql', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            },
            method: 'POST',
            body: JSON.stringify(requestBody)
        }).then(res => res.json())
        .then(res => {
            // res
            setTimeout(() => {
                this.context.clearCartHandler();

                this.setState({
                    orderFinished: true,
                    thisOrder: {
                        date: res.data.createOrder.date,
                        _id: res.data.createOrder._id,
                        products: res.data.createOrder.products
                    }
                });

            }, 1000);
            
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <div className={classes.cartContainer}>
                <div className={classes.title}>
                    <span className={this.state.orderFinished ? classes.greenText : ''}>
                        {this.state.orderFinished ? 'Congratulations, Order Finished!' : 'My Cart:'}
                    </span>
                    {(this.context.cart.length > 0 || this.state.orderFinished) && 
                        <span className={classes.titleContinue}
                        onClick={()=>(this.props.history.push('/all-products'))}>
                        Continue shopping</span>}
                </div>
                {!this.state.orderFinished && this.context.cart.length === 0 && 
                    <div className={classes.emptyAlert}>
                        <p>You haven't bought anything</p>
                        <span onClick={()=>(this.props.history.push('/all-products'))}>Let's buy something ~</span>
                    </div>
                }
                {this.state.orderFinished && 
                    <div className={classes.finishOrderContainer}>
                        <span onClick={()=>(this.props.history.push('/my-orders'))}>
                            Check all orders
                        </span>
                        <div>
                            <span>{this.state.thisOrder.date}</span>
                            <span>Tracking Number: {this.state.thisOrder._id}</span>
                        </div>
                    </div>
                }
                {(this.context.cart.length > 0 || this.state.orderFinished) && 
                    <table className={classes.table}>
                    <thead>
                        <tr>
                            {!this.state.orderFinished && <td>#</td>}
                            <td>Product</td>
                            <td>Description</td>
                            <td>Price</td>
                            <td>Count</td>
                        </tr>
                    </thead>
                    <tbody>
                    {(this.context.cart.length > 0 ? this.context.cart : this.state.thisOrder.products).map((item, index) => {
                        return (
                            <tr key={item._id}>
                                {!this.state.orderFinished &&
                                    <td className={classes.tdCenter+' '+classes.deleteButton}>
                                        <button onClick={this.context.changeCartHandler.bind(this, item, 0)}>Delete</button>
                                    </td>
                                }
                                <td className={classes.tdCenter}>{item.name}</td>
                                <td>{item.description}</td>
                                <td className={classes.tdCenter}>{item.price}</td>
                                <td className={classes.tdCenter}>
                                    {this.state.orderFinished ? 
                                        item.count :
                                        <select defaultValue={item.selectCount} 
                                            ref={product => this.allCounts[index] = product}
                                            onChange={this.changeSelectHandler.bind(this, item, index)} >
                                            {[...Array(item.count)].map((x, i) => {
                                                return (
                                                    <option key={i} value={i+1}>{i+1}</option>
                                                )
                                            })}
                                        </select>
                                    }
                                </td>
                                
                            </tr>
                        )
                    })}
                        <tr>
                            <td className={classes.clearBorder}></td>
                            <td className={classes.clearBorder}></td>
                            <td className={classes.clearBorder}></td>
                            <td className={classes.tdCenter}>Total: ${this.state.totalPrice.toFixed(2)}</td>
                            {!this.state.orderFinished && <td className={classes.orderButton}>
                                <button onClick={this.createOneOrder}>Order</button>
                            </td>}
                        </tr>
                    </tbody>
                </table>
                }

                
            </div>
        )
    }

}

export default withRouter(Cart);
