import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';

import GlobalContext from './GlobalContext';

import LoginPage from './views/Login/Login';
import SignupPage from './views/Signup/Signup';
import AllProducts from './views/AllProducts/AllProducts';
import Cart from './views/Cart/Cart';
import Order from './views/Order/Order';
import Product from './views/Product/Product';
import MobileNav from './components/MobileNav/MobileNav';

class App extends Component {

  state = {
    userId : null,
    token: null,
    tokenExp: null,
    email: null,
    isLogin: false,
    cart: [],
    identification: null,
    isMobile: false,
    showMobileNav: false
  }

  login = (userId, email, identification, token, tokenExp) => {
    this.setState({
      userId: userId,
      token:token,
      identification: identification,
      email: email,
      isLogin: true
    }, () => {
      const user = {
        userId: userId,
        token: token,
        tokenExp: tokenExp,
        identification: identification,
        email: email,
        startTime: new Date().getTime()
      }
      localStorage.setItem('ecom', JSON.stringify(user));
      console.log('user login...')
    });
  }

  logout = () => {
    this.setState({
      userId : null,
      token: null,
      tokenExp: null,
      email: null,
      isLogin: false,
      cart: []
    });
    localStorage.removeItem('ecom');
  }

  changeCartHandler = (args, selectCount) => {
    let arr = [...this.state.cart];
    let index = -1;
    arr = arr.map((item, i) => {
      if (item._id === args._id) {
        index = i;
        item.selectCount = selectCount;
      }
      return item;
    });
    if (selectCount === 0) {
      arr.splice(index, 1);
    }
    if (index === -1) {
      arr.push({
        ...args,
        selectCount:selectCount
      });
    }
    
    this.setState({
      cart: arr
    }, () => (console.log(this.state.cart)));
  }

  clearCartHandler = () => {
    this.setState({
      cart: []
    });
  }


  showMobileNavHandler = () => {
    this.setState({
      showMobileNav: !this.state.showMobileNav
    });
  }

  checkMobileHandler = () => {
    let isMobile = (window.innerWidth <= 600);
    if (isMobile !== this.state.isMobile) {
        this.setState({isMobile: isMobile});
    }
  }

  componentDidMount () {
    if (window) {
      this.setState({isMobile: (window.innerWidth <= 600)});
      window.addEventListener('resize', this.checkMobileHandler);

      // check if valid token
      const user = JSON.parse(localStorage.getItem('ecom'));
      if (user && ((new Date().getTime()) - user.startTime) < user.tokenExp * 60 * 60 * 1000) {
        this.login(user.userId, user.email, user.identification, user.token, user.tokenExp);
      }
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.checkMobileHandler);
    }
  }

  render() {
    return (

      <BrowserRouter>
        <GlobalContext.Provider value={{
          token: this.state.token, 
          userId: this.state.userId, 
          email: this.state.email,
          tokenExp: this.state.tokenExp,
          login: this.login, 
          logout: this.logout,
          isLogin: this.state.isLogin,
          cart: [...this.state.cart],
          changeCartHandler: this.changeCartHandler,
          identification: this.state.identification,
          clearCartHandler: this.clearCartHandler
        }}>
          <Navigation isMobile={this.state.isMobile} showMobileNavHandler={this.showMobileNavHandler} />
          {this.state.showMobileNav && this.state.isMobile &&
            <MobileNav showMobileNavHandler={this.showMobileNavHandler} />
          }
          <Switch>
            <Route path='/all-products' component={AllProducts} />
            {(!this.state.isLogin || this.state.identification === 0)&& <Route path='/my-cart' component={Cart} />}
            {this.state.isLogin && <Route path='/my-orders' component={Order} />}
            {(this.state.isLogin && this.state.identification === 1) && <Route path='/my-products' component={Product} />}
            {!this.state.isLogin && <Route path='/login' component={LoginPage} />}
            {!this.state.isLogin && <Route path='/signup' component={SignupPage} />}
            <Redirect from='*' to='/all-products' exact />
          </Switch>
        </GlobalContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
