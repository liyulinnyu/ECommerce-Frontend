import React from 'react';
import classes from './MobileNav.module.css';
import GlobalContext from '../../GlobalContext';
import {NavLink} from 'react-router-dom';


const MobileNav = (props) => (
    <GlobalContext.Consumer>
        {(context) => {

            return (
                <div className={classes.navContainer} onClick={props.showMobileNavHandler}>
                    <ul>
                            <li>
                                <NavLink to='/all-products'>Home</NavLink>
                            </li>
                        {!context.isLogin && 
                                <React.Fragment>
                                    <li>
                                        <NavLink to='/login'>Login</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/signup'>Signup</NavLink>
                                    </li>
                                    
                                    </React.Fragment>
                            }
                        {(!context.isLogin || context.identification === 0) && <li>
                                    <NavLink to='/my-cart'>Cart{context.cart.length > 0 && `(${context.cart.length})`}</NavLink>
                                </li>}
                        
                        {context.isLogin && <React.Fragment>
                                <li>
                                    <NavLink to='/my-orders'>Orders</NavLink>
                                </li>
                                {context.identification === 1 && <li>
                                    <NavLink to='/my-products'>Products</NavLink>
                                </li>}
                            </React.Fragment>}
                        {context.isLogin && 
                            <li>
                                <button className={classes.logoutButton} onClick={context.logout}>Logout</button>    
                            </li>
                        }
                    </ul>
                </div>
            )

        }}
    </GlobalContext.Consumer>

);

export default MobileNav;
