import React, {Component} from 'react';
import classes from './AllProducts.module.css';
import GlobalContext from '../../GlobalContext';
import Loading from '../../components/Loading/Loading';
import ReactPaginate from 'react-paginate';

class AllProducts extends Component {
    state = {
        products: [],
        totalNum: 0,
        mouseHover: []
    }

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.allCounts = [];
    }

    getProductsHandler = (pageNum = 0) => {
        const requestBody = {
            query: `
                query getProducts($limit: Int!, $offset: Int!){
                    product(limit: $limit, offset: $offset) {
                        total,
                        products {
                            _id,
                            owner {
                                _id,
                                email,
                                identification
                            }
                            name,
                            price,
                            count,
                            description 
                        }
                    }
                }
            `,
            variables: {
                limit: 6,
                offset: pageNum * 6
            }
        }
        fetch('/graphql', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(requestBody)
        }).then(res => res.json()).then(res => {
            console.log(res);
            this.setState({
                totalNum: res.data.product.total,
                products: res.data.product.products.slice()
            });
        }).catch(err=>console.log(err));
    }

    componentDidMount() {
        this.getProductsHandler(0);
    }

    changePageHandler = (data) => {
        this.getProductsHandler(data.selected);
        if (window) {
            window.document.querySelector('nav').scrollIntoView();
        }
    }

    addProductHandler = (args, index, e) => {
        if (this.allCounts[index].value === '0') {
            alert('please select the count');
            return;
        }
        if (this.context.identification !== 0 && this.context.isLogin) {
            alert(`You don't have permission to buy products`);
            return;
        }
        alert('success');
         
        this.context.changeCartHandler(args, parseInt(this.allCounts[index].value));
        
    }

    mouseHoverHandler = (index, e) => {
        let arr = [];
        arr[index] = 1;
        this.setState({
            mouseHover: arr
        });
    }

    mouseLeaveHandler = (index, e) => {
        let arr = this.state.mouseHover;
        arr[index] = undefined;
        this.setState({
            mouseHover: arr
        });
    }

    render() {
        return (
            <div>
                <div className={classes.backMock}></div>
                <div className={classes.products}>
                    {this.state.products.length === 0 &&
                        <Loading />
                    }
                    {this.state.products.length > 0 && this.state.products.map((item, index) => {
                        if (item.count === 0) {
                            // don't show the product which count is 0
                            return null;
                        }
                        return (
                            <div key={item._id} className={classes.productContainer}
                                onMouseOver={this.mouseHoverHandler.bind(this, index)}
                                onMouseOut={this.mouseLeaveHandler.bind(this, index)}
                                >
                                <span className={
                                    this.state.mouseHover[index] === 1 ? classes.fullName : classes.productName}>
                                    {item.name}
                                </span>
                                <span className={classes.productDescription}>{item.description}</span>
                                <span className={classes.productOwner}>owner: {item.owner.email.slice(0,3) + 'xxx'}</span>
                                <label htmlFor='count-select'>count: </label>
                                <select defaultValue='0' id='count-select' ref={(count)=>(this.allCounts[index] = count)}>
                                    {[...Array(item.count+1)].map((x, i) => {
                                        return (
                                            <option key={i} value={i}>{i}</option>
                                        )
                                    })}
                                </select>
                                <span className={classes.productPrice}>${item.price}</span>
                                <button className={classes.addToCard} 
                                    onClick={
                                        this.addProductHandler.bind(this, item, index)
                                    }>
                                    Add To Cart
                                </button>
                            </div>
                        )
                    })}
                </div>
                
                {this.state.products.length > 0 && <div className={classes.paginateContainer}>
                        <ReactPaginate
                            
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalNum / 6)}
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

export default AllProducts;
