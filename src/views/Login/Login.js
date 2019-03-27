import React, {PureComponent} from 'react';
import classes from './Login.module.css';
import GlobalContext from '../../GlobalContext';

class LoginPage extends PureComponent {

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    static contextType = GlobalContext;

    loginHandler = (e) => {
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (!password.trim()) {
            alert('Password cannot be empty');
            return;
        }

        const emailReg = /^\S+@\S+\.\S+$/;

        const requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId,
                        email,
                        identification,
                        token,
                        tokenExp
                    }
                }
            `
        };

        if (email.trim().match(emailReg)){ 
            fetch('/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(res => {
                return res.json();
            }).then(res => {
                console.log(res);
                if (res.data.login.token) {
                    this.context.login(
                        res.data.login.userId,
                        res.data.login.email,
                        res.data.login.identification,
                        res.data.login.token,
                        res.data.login.tokenExp
                    );
                }
            }).catch(err => {
                console.log(err);
                alert('User does not exist');
            });
        } else {
            alert('Invalid email address');
        }
    }

    render() {
        return (
            <div className={classes.loginContainer}>
                <form onSubmit={this.loginHandler} className={classes.loginForm}>
                    <label htmlFor='email'>Email: </label>
                    <input id='email' type='text' ref={this.emailEl} />
                    <label htmlFor='password'>Password: </label>
                    <input id='password' type='password' ref={this.passwordEl} />
                    <button type='submit'>Login</button>       
                </form>
            </div>
        )
    }
}
    

export default LoginPage;