import React, {PureComponent} from 'react';
import classes from './Order.module.css';
import GlobalContext from '../../GlobalContext';
import { withRouter } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import Loading from '../../components/Loading/Loading';

class Order extends PureComponent {
    state = {
        orders: 0,
        identification: this.context.identification,
        totalNum: 0
    }

    static contextType = GlobalContext;

    getOrders = (pageNum) => {
        const requestBody = {
            query: `
                query getOrder($id: String!, $limit: Int!, $offset: Int!){
                    order(userId: $id, limit:$limit, offset: $offset) {
                        total,
                        orders {
                            _id,
                            date,
                            customer {
                                email
                            },
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
                }
            `,
            variables: {
                id: this.context.userId,
                limit: 5,
                offset: pageNum*5
            }
        }

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => res.json())
        .then(res => {
            this.setState({
                orders: res.data.order.orders,
                totalNum: res.data.order.total
            });
        }).catch(err => console.log(err));
    }

    componentDidMount() {
        this.getOrders(0);
    }

    pageChangeHander = (data) => {
        this.getOrders(data.selected);
    }
    

    render() {
        return (
            <div className={classes.orderContainer}>
                <div className={classes.title}>
                    <span>My Orders:({this.state.totalNum})</span>
                    {this.state.orders.length > 0 && this.state.identification === 0 &&
                        <span className={classes.titleContinue}
                        onClick={()=>(this.props.history.push('/all-products'))}>
                        Go shopping</span>}
                </div>
                {this.state.orders === 0 &&
                        <Loading />
                    }
                {this.state.orders.length === 0 && 
                    <div className={classes.emptyAlert}>
                        <p>You don't have any orders</p>
                        {this.state.identification === 0 && <span onClick={()=>(this.props.history.push('/all-products'))}>Let's buy something ~</span>}
                    </div>
                }
                {this.state.orders.length > 0 && 
                    this.state.orders.map((order, index) => {
                        let totalPrice = 0;
                        return <div key={order._id}>
                            <div className={classes.orderHeader}>
                                <span>{order.date}</span>
                                <span>Tracking Number: {order._id}</span>
                            </div>
                            <div className={classes.orderContent}>
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Name</td>
                                            <td>Count</td>
                                            <td>Description</td>
                                            <td>{this.state.identification === 0 ? 'Seller':'Customer'}</td>
                                            <td>Unit Price</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.products.map(product => {
                                            totalPrice += (product.price * product.count);
                                            return (
                                                <tr key={product._id}>
                                                    <td className={classes.tdCenter}>{product.name}</td>
                                                    <td className={classes.tdCenter}>{product.count}</td>
                                                    <td>{product.description}</td>
                                                    <td className={classes.tdCenter}>{this.state.identification === 0 ? product.owner.email : order.customer.email}</td>
                                                    <td className={classes.tdCenter}>{product.price}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Total Price: {totalPrice}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                })}

                {this.state.orders.length > 0 && <div className={classes.paginateContainer}>
                        <ReactPaginate
                            
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalNum / 5)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.pageChangeHander}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                    </div>
                }
            </div>
        )
    }

}

export default withRouter(Order);
