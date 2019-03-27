import React, {PureComponent} from 'react';
import classes from './Signup.module.css';
import { withRouter } from "react-router-dom";

class SignupPage extends PureComponent {

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.repasswordEl = React.createRef();
        this.customerEl = React.createRef();
        this.sellerEl = React.createRef();
    }

    signupHandler = (e) => {
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        const repassword = this.repasswordEl.current.value;
        const identification = this.customerEl.current.checked ? 0 : 1;
        console.log(identification);
        if (password !== repassword) {
            alert('re-password does not match password');
            return;
        }

        if (!password.trim()) {
            alert('Password cannot be empty');
            return;
        }

        const emailReg = /^\S+@\S+\.\S+$/;

        const requestBody = {
            query: `
                mutation {
                    createUser(email: "${email}", password: "${password}", identification:${identification}) {
                        email
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
                alert('signup success!');
                this.props.history.push('/login');
            }).catch(err => {
                console.log(err);
            });
        } else {
            alert('Invalid email address');
        }
    }

    render() {
        return (
            <div className={classes.signupContainer}>
                <form onSubmit={this.signupHandler} className={classes.signupForm}>
                    <label htmlFor='email'>Email: </label>
                    <input id='email' type='text' ref={this.emailEl} />
                    <label htmlFor='password'>Password: </label>
                    <input id='password' type='password' ref={this.passwordEl} />
                    <label htmlFor='repassword'>Re-Password: </label>
                    <input id='repassword' type='password' ref={this.repasswordEl} />
                    <div className={classes.radioDiv}>
                        <label htmlFor='customer-radio'>Customer </label>
                        <label htmlFor='seller-radio'>Seller </label>
                        <input type="radio" defaultChecked={true} name='radio' id='customer-radio' ref={this.customerEl} />
                        <input type="radio" name='radio' id='seller-radio' ref={this.sellerEl} />
                    </div>
                    
                    <button type='submit'>Signup</button>       
                </form>
            </div>
        )
    }
}
    

export default withRouter(SignupPage);