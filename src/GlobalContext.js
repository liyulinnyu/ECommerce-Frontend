import React from 'react';

export default React.createContext({
    userId: null,
    email: null,
    token: null,
    tokenExp: null,
    isLogin: false,
    identification: null,
    login: () => {},
    logout: () => {},
    cart: [],
    changeCartHandler: () => {}
});