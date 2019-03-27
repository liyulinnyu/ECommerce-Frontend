import React, {useRef} from 'react';
import classes from './Mock.module.css';

const Mock = (props) => {

    const product_name_El = useRef();
    const product_des_El = useRef();
    const product_price_El = useRef();
    const product_count_El = useRef();

    const passValueToUpdate = () => {
        props.confrimUpdate( 
            props.product._id,
            product_name_El.current.value,
            product_des_El.current.value,
            product_price_El.current.value,
            product_count_El.current.value
        );
    }

    return (
        <div className={classes.mock}>
            
            <div className={classes.container}>
                <span className={classes.title}>
                    {props.product._id === '' ? 'Create' : 'Update'}
                </span>
                <span className={classes.name}>
                    {props.update ? 
                    <React.Fragment>
                        <label htmlFor='mock-product-name'>Product Name:</label>
                        <input type='text'
                            ref={product_name_El} 
                            defaultValue={props.product.name} 
                            id='mock-product-name'/>
                    </React.Fragment>   
                        : props.product.name}
                </span>
                <div className={classes.description}>
                    {props.update ? 
                    <React.Fragment>
                        <label htmlFor='mock-product-description'>Product Description:</label>
                        <textarea ref={product_des_El} defaultValue={props.product.description} id='mock-product-description'/>
                    </React.Fragment>
                        : props.product.description}
                </div>
                <span className={classes.price}>
                    {props.update ? 
                    <React.Fragment>
                        <label htmlFor='mock-product-price'>Product Price:</label>
                        <input ref={product_price_El} type='text' defaultValue={props.product.price} id='mock-product-price'/> 
                    </React.Fragment>  
                        : props.product.price}
                </span>
                <span className={classes.count}>
                    {props.update ? 
                    <React.Fragment>
                        <label htmlFor='mock-product-count'>Product Count:</label>
                        <input ref={product_count_El} type='number' min={1} defaultValue={props.product.count} id='mock-product-count'/> 
                    </React.Fragment>  
                        : props.product.count}
                </span>
                <span className={classes.buttons}>
                    {props.update && 
                        <button className={classes.cancel} onClick={props.cancel}>Cancel</button>
                    }
                    {props.update && props.product._id !== '' && 
                        <button className={classes.delete} onClick={props.delete.bind(this, props.product._id)}>Delete</button>
                    }
                    <button className={classes.confrimButton} 
                        onClick={props.update ? 
                            passValueToUpdate 
                            : props.cancel}>Confirm</button>
                </span>
            </div>
        </div>
    )
}

export default Mock;