import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Navigation.module.css';
import GlobalContext from '../../GlobalContext';

const navigation = props => (
    <GlobalContext.Consumer>
        {(context) => (
            <nav className={classes.nav}>
                <div className={classes.title}>
                    <span>YULIN-Ecommerce</span>   
                </div>
                {props.isMobile && 
                    <div className={classes.mobileNav} onClick={props.showMobileNavHandler}>
                    </div>
                }

                {!props.isMobile && <ul className={classes.ul}>
                         <li>
                            <NavLink to='/all-products'>Home</NavLink>
                        </li>
                    {!context.isLogin && <React.Fragment>
                        <li>
                            <NavLink to='/login'>Login</NavLink>
                        </li>
                        <li>
                            <NavLink to='/signup'>Signup</NavLink>
                        </li>
                    </React.Fragment>}
                    {context.isLogin && <React.Fragment>
                        <li>
                            <NavLink to='/my-orders'>Orders</NavLink>
                        </li>
                        {context.identification === 1 && <li>
                            <NavLink to='/my-products'>Products</NavLink>
                        </li>}
                    </React.Fragment>}
                    {(!context.isLogin || context.identification === 0) && <li>
                        <NavLink to='/my-cart'>Cart{context.cart.length > 0 && `(${context.cart.length})`}</NavLink>
                    </li>}
                    {context.isLogin && 
                        <li>
                            <button className={classes.logoutButton} onClick={context.logout}>Logout</button>    
                        </li>
                    }
                </ul>
                }
            </nav>
        )}
    </GlobalContext.Consumer> 
    
)

export default navigation;