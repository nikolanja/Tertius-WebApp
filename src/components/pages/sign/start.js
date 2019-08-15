import React, { Component } from 'react';
import logo from '../../../assets/images/sign-logo.png';
import appstorebadge from '../../../assets/images/app-store-badge.png';
import Gap from '../../gap/gap';
import SignButton from '../../buttons/sign-button/sign-button';
import { Redirect } from 'react-router-dom';
import './sign.scss';

import fire, { defaultSignedUrl, googleProvider } from '../../../config/config';

class Start extends Component {

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

	signupWithGoogle () {
		
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

		fire.auth().languageCode = 'us';
		fire.auth().signInWithPopup(googleProvider).then(function(result) {
			
		}).catch(function(error) {
			
		});
  	}

	signupWithEmail () {
		window.location.href = "/email-signup";
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
						<span className="title">get started</span>
						<Gap hei="2"></Gap>
						<p>Try Tertius free for a month and begin capturing your favorite literary moments.</p>
						<Gap hei="3"></Gap>
						<div className="signin-action">
							<SignButton icon="google" clickEvent={this.signupWithGoogle.bind(this)}>Sign up with Google</SignButton>
							<Gap hei="18"></Gap>
							<SignButton icon="email" clickEvent={this.signupWithEmail.bind(this)}>Sign up with email</SignButton>
							<Gap hei="21"></Gap>
							<span>Already a member?&nbsp;<a href='/signin'>Sign in</a></span>
						</div>
					</div>

					<div className="apple" align="center">
						<a href="https://itunes.apple.com/us/app/tertius-read-capture-grow/id1441909218?ls=1&mt=8" target="_blank" rel="noopener noreferrer">
							<img src={appstorebadge} className="btn-app-store" alt="App Store" />
						</a>
					</div>
				</div>
			</div>
		);
  	}
}

export default Start;