import React, { Component } from 'react';
import logo from '../../../assets/images/sign-logo.png';
import Gap from '../../gap/gap';
import SignButton from '../../buttons/sign-button/sign-button';
import { Redirect } from 'react-router-dom';
import './sign.scss';

import fire, { defaultSignedUrl, googleProvider } from '../../../config/config';

class Signin extends Component {
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
					signed: false
			  });
			}
		});
	}

  	signinWithGoogle () {
			fire.auth().onAuthStateChanged(function(user) {
				if (user) {
					fire.database().ref('Posts/' + user.uid).once('value', function(snap){
						if(snap.exists()){
							window.location.href = defaultSignedUrl
						}else {
							window.location.href = '/welcome';
						}
					})
					// window.location.href = defaultSignedUrl
				}
			});

			fire.auth().languageCode = 'us';
			fire.auth().signInWithPopup(googleProvider).then(function(result) {
				
			}).catch(function(error) {
				//error occur
				console.log(error);
			});
  	}

  	signinWithEmail () {
  		window.location.href = "/email-signin";
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
						<span className="title">welcome back</span>
						<Gap hei="2"></Gap>
						<p>Sign in to your existing account.</p>
						<Gap hei="3"></Gap>
						<div className="signin-action">
							<SignButton icon="google" clickEvent={this.signinWithGoogle.bind(this)}>Sign in with Google</SignButton>
							<Gap hei="18"></Gap>
							<SignButton icon="email" clickEvent={this.signinWithEmail.bind(this)}>Sign in with email</SignButton>
							<Gap hei="21"></Gap>
							<span>Don’t have an account?&nbsp;<a href="/start">Sign up</a></span>
						</div>
					</div>
				</div>
			</div>
		);
  }
}

export default Signin;