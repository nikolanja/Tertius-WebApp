import React, { Component } from 'react';
import logo from '../../../assets/images/sign-logo.png';
import Gap from '../../gap/gap';
import './sign.scss';
import { Redirect } from 'react-router-dom';
import * as EmailValidator from 'email-validator';

import fire, { defaultSignedUrl } from '../../../config/config';

class EmailSignin extends Component {

	constructor () {
		super();
		this.state = {
			signed: false,
			welcome: false,
			email_validate: 0,
			email_placeholder: 'Your email'
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
					signed: false
				});
			}
		});
	}

  	goBack () {
  		window.history.back();
	}
	
	sendEmailAddress (){
		this.setState({email_validate: 3});
	}

  	signin (e) {
		let email = document.getElementById('email').value;

		if (email === ''){
			this.setState({email_validate: 1, email_placeholder: 'Enter your email address'});
			document.getElementById('email').focus();
			return ;
		}else if(!EmailValidator.validate(email)){
			this.setState({email_validate: 2, email_placeholder: 'Invalid email'});
			document.getElementById('email').focus();
			document.getElementById('email').value = '';
			return ;
		}

		var sendEmailAddress = this.sendEmailAddress.bind(this);

		var actionCodeSettings = {
			url: 'https://tertius.app/signin-email',
			handleCodeInApp: true
		};

		fire.auth().sendSignInLinkToEmail(email, actionCodeSettings)
		.then(function() {

			window.localStorage.setItem('emailForSignIn', email);
			sendEmailAddress();

			fire.auth().onAuthStateChanged(function(user) {
				if (user) {
					fire.database().ref('Posts/' + user.uid).once('value', function(snap){
						if(snap.exists()){
							window.location.href = defaultSignedUrl
						}else {
							window.location.href = '/welcome';
						}
					})
				} else {

				}
			});
			//fire.auth().onAuthStateChanged(authStateObserver);
			//console.log("localStorage is " + window.localStorage.getItem('emailForSignIn'));
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
						<span className="title">sign in with email</span>
						<Gap hei="2"></Gap>
						<p>Enter the email associated with your account and we’ll send a “magic link” to your inbox.</p>
						<Gap hei="3"></Gap>
						<div className="signin-form" align="center">
							{
								(this.state.email_validate === 1 || this.state.email_validate === 2) ? (
									<input type="text" name="email" id="email" placeholder={this.state.email_placeholder} className="invalid"/>
								) : (
									<input type="text" name="email" id="email" placeholder={this.state.email_placeholder}/>
								)
							}
							<Gap hei="40"></Gap>
							<button className="form-action" type="button" onClick={this.signin.bind(this)}>Continue</button>
						</div>
					</div>
					
					<Gap hei="20"></Gap>
					<div className={this.state.email_validate === 3 ? "email-verify" : "hidden"} align="center">
						<span>Please check your email for a link to sign in. You may be asked to re-enter your email after clicking the link.</span>
					</div>
				</div>
				{/* <div className="sign-back" onClick={this.goBack.bind(this)}>
					<img src={goback} alt=""/>
				</div> */}
			</div>
    	);
  	}
}

export default EmailSignin
