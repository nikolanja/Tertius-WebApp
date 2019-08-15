import React, { Component } from 'react';
import logo from '../../../assets/images/sign-logo.png';
import Gap from '../../gap/gap';
import './sign.scss';
import { Redirect } from 'react-router-dom';

import fire, { defaultSignedUrl } from '../../../config/config';
import * as EmailValidator from 'email-validator';

class EmailSignup extends Component {

	constructor () {
		super();
		this.state = {
			signed: false,
			welcome: false
		}
	}

	componentWillMount () {
		fire.auth().onAuthStateChanged(user => {
			if (user) {
				fire.database().ref('Posts/' + user.uid).once('value', function(snap){
                    if(snap.exists()){
                        this.setState({
                        	signed: true,
                        	welcome: false
                        });
                    }else {
                        this.setState({
                        	signed: true,
                        	welcome: true
                        });
                    }
                }.bind(this))
			} else {
				this.setState({
					signed: false,
					email_validate: 0,
					email_placeholder: 'Your email',
					fullname_validate: 0,
					fullname_placeholder: 'Your full name'
				});
			}
		});
	}

	sendEmailAddress (){
		this.setState({email_validate: 3});
	}

  	goBack () {
  		window.history.back();
  	}

  	signup (e) {
		let fullname = document.getElementById('fullname').value;

		if (fullname === ''){
			this.setState({fullname_validate: 1, fullname_placeholder: 'Enter your full name'});
			document.getElementById('fullname').focus();
			return ;
		}

		let email = document.getElementById('email').value;

		if (email === ''){
			this.setState({email_validate: 1, email_placeholder: 'Enter your email address'});
			document.getElementById('email').focus();
			return ;
		}else if(!EmailValidator.validate(email)){
			this.setState({email_validate: 2, email_placeholder: 'Invalid email'});
			document.getElementById('email').value = '';
			document.getElementById('email').focus();
			return ;
		}

		var sendEmailAddress = this.sendEmailAddress.bind(this);

		var actionCodeSettings = {
			url: 'https://tertius.app/signup-email',
			handleCodeInApp: true
		};

		fire.auth().onAuthStateChanged(function(user) {
			if (user) {
				fire.database().ref('Posts/' + user.uid).once('value', function(snap){
					if(snap.exists()){
						window.location.href = defaultSignedUrl
					}else {
						window.location.href = '/welcome';
					}
				})
			}
		});

		fire.auth().sendSignInLinkToEmail(email, actionCodeSettings)
		.then(function() {
			window.localStorage.setItem('emailForSignIn', email);
			sendEmailAddress();
		}).catch(function(error) {
			console.log(error);
		});
	}

  	render() {
		if (this.state.signed && this.state.welcome === false)
        {
            return <Redirect to={defaultSignedUrl} />
        }
        
        if (this.state.signed && this.state.welcome === true){
            return <Redirect to="/welcome" />
        }

    	return (
			<div className="sign-page" align="center">
				<div className="sign-container">
					<div className="logo" align="center">
						<img src={logo} alt="Tertius logo" />
					</div>

					<div className="main-block" align="center">
						<span className="title">sign up with email</span>
						<Gap hei="2"></Gap>
						<p>Enter your email and we’ll send a “magic link” to your inbox so you can login.</p>
						<Gap hei="3"></Gap>
						<div className="signin-form" align="center">
							{
								(this.state.fullname_validate === 1 || this.state.fullname_validate === 2) ? (
									<input type="text" name="fullname" id="fullname" placeholder={this.state.fullname_placeholder} className="invalid"/>
								) : (
									<input type="text" name="fullname" id="fullname" placeholder={this.state.fullname_placeholder}/>
								)
							}
							<Gap hei="32"></Gap>
							{
								(this.state.email_validate === 1 || this.state.email_validate === 2) ? (
									<input type="text" name="email" id="email" placeholder={this.state.email_placeholder} className="invalid"/>
								) : (
									<input type="text" name="email" id="email" placeholder={this.state.email_placeholder}/>
								)
							}
							<Gap hei="39"></Gap>
							<button className="form-action" type="button" onClick={this.signup.bind(this)}>Create account</button>
						</div>
					</div>

					<Gap hei="20"></Gap>
					<div className={this.state.email_validate === 3 ? "email-verify" : "hidden"} align="center">
						<span>Please check your email for a link to sign up. You may be asked to re-enter your email after clicking the link.</span>
					</div>

					<div className="last-footer" align="center">
						<Gap hei="5"></Gap>
						<span>By creating an account, I accept Tertius’<br/><a href="/terms">Terms of Service.</a></span>
					</div>
				</div>
				{/* <div className="sign-back" onClick={this.goBack.bind(this)}>
					<img src={goback} alt=""/>
				</div> */}
			</div>
    	);
  	}
}

export default EmailSignup;