import React, {Component} from 'react';
import classes from './Product.module.css';
import GlobalContext from '../../GlobalContext';
import { withRouter } from "react-router-dom";
import Mock from '../../components/Mock/Mock';
import ReactPaginate from 'react-paginate';
import Loading from '../../components/Loading/Loading';

class Product extends Component {
    state = {
        products: 0,
        mock: false,
        updateItem: null,
        totalNum: 0
    }

    static contextType = GlobalContext;

    constructor (props) {
        super(props);
        this.window = null;
    }

    fetchData = (requestBody) => {
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => res.json()).then(res => {
            let arr = this.state.products;
            let thisPro = res.data.updateProduct || res.data.createProduct || (res.data.product && res.data.product.products);

            if (thisPro === undefined) {
                // delete, not update or create
                thisPro = res.data.deleteProduct;
                thisPro.count = 0;
            }

            if (Array.isArray(thisPro)) {
                this.setState({
                    totalNum: res.data.product.total,
                    products: thisPro
                });
                return;
            } 
            let i = 0;
            for (; i < arr.length; i++) {
                if (arr[i]._id === thisPro._id) {
                    if (thisPro.count === 0) {
                        // delete
                        arr.splice(i, 1);
                        break;
                    }
                    // update
                    arr.splice(i, 1, thisPro);
                    break;
                }
            }
            if (i === arr.length) {
                // create
                arr.push(thisPro);
            }
            this.setState({
                products: arr
            });
            alert('success');
            // cancel the mock
            this.cancelUpdateHandler();
            // refresh to the first page
            this.getProductsHandler(0);
            // fake click pagination
            this.window.document.querySelector('.pagination li:first-child > a').click();

        }).catch(err => console.log(err));
    }

    
    getProductsHandler = (pageNum) => {
        const requestBody = {
            query: `
                query getProducts($id: String, $limit: Int!, $offset: Int!) {
                    product(owner: $id, limit:$limit, offset: $offset) {
                        total,
                        products{
                            _id,
                            name,
                            price,
                            count,
                            description
                        }
                    }
                }
            `,
            variables: {
                id: this.context.userId,
                offset: pageNum * 10,
                limit: 10
            }
        };

        this.fetchData(requestBody);
    }

    componentDidMount() {
        this.window = window;
        this.getProductsHandler(0);
    }

    changePageHandler = (data) => {
        this.getProductsHandler(data.selected);
    }

    
    updateHandler = (product, e) => {
        this.setState({
            updateItem: product,
            mock: true
        });
    }

    cancelUpdateHandler = (e) => {
        this.setState({
            updateItem: null,
            mock: false
        });
    }

    confrimUpdateHandler = (_id, name, des, price, count, e) => {
        if (!name || name.trim() === '') {
            alert('Please input product name');
            return;
        }
        let requestBody = null

        const setPro = {
            owner: this.context.userId + "",
            name: name + "",
            price: parseFloat(price),
            count: parseInt(count),
            description: des + ""
        }
        
        if (_id !== '') {
            requestBody = {
                query: `
                    mutation updateProducts($id: String!, $product: ProductInput) {
                        updateProduct(productId: $id, productInput: $product) {
                            _id,
                            name,
                            price,
                            count,
                            description,
                        }
                    }
                `,
                variables: {
                    id: _id + "",
                    product: setPro
                }
            };
        } else {

            requestBody = {
                query: `
                    mutation createOne($product: ProductInput!) {
                        createProduct(productInput: $product) {
                            _id,
                            name,
                            price,
                            count,
                            description,
                        }
                    }
                `,
                variables: {
                    product: setPro
                }
            };

        }
        this.fetchData(requestBody);
    }

    deleteHandler = (_id, e) => {
        if (this.window && this.window.confirm('Confirm delete?')) {
            const requestBody = {
                query: `
                    mutation deleteOne($id: String!, $userId: String!) {
                        deleteProduct(productId: $id, userId: $userId) {
                            _id,
                            name,
                            price,
                            count,
                            description,
                        }
                    }
                `,
                variables: {
                    id: _id,
                    userId: this.context.userId
                }
            };
            this.fetchData(requestBody);
        }
    }

    render() {
        return (
            <div className={classes.productContainer}>
                {this.state.mock && 
                    <Mock 
                        product={this.state.updateItem} 
                        update={true}
                        cancel={this.cancelUpdateHandler} 
                        delete={this.deleteHandler}
                        confrimUpdate={this.confrimUpdateHandler}
                    />
                }
                {this.state.products === 0 &&
                        <Loading />
                    }
                <div className={classes.title}>
                    <span>My Products:</span>
                    <button 
                        onClick={this.updateHandler.bind(this, {
                            _id: "",
                            name: "",
                            description: "",
                            count: 0,
                            price: 0
                        })}>
                        Upload A Product
                    </button>
                </div>
                {this.state.products.length === 0 && 
                    <div className={classes.emptyAlert}>
                        <p>You haven't upload any products</p>
                    </div>
                }
                
                {this.state.products.length > 0 && 
                    <div className={classes.productContent}>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <td>#</td>
                                    <td>Name</td>
                                    <td>Count</td>
                                    <td>Description</td>
                                    <td>Unit Price</td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.products.map(product => {
                                    return (
                                        <tr key={product._id}>
                                            <td className={classes.updateButton}>
                                                <button onClick={this.updateHandler.bind(this, product)}>Update</button>
                                            </td>
                                            <td className={classes.tdCenter}>{product.name}</td>
                                            <td className={classes.tdCenter}>{product.count}</td>
                                            <td>{product.description}</td>
                                            <td className={classes.tdCenter}>{product.price}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                }

                {this.state.products.length > 0 && <div className={classes.paginateContainer}>
                        <ReactPaginate
                            
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalNum / 10)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.changePageHandler}
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

export default withRouter(Product);
