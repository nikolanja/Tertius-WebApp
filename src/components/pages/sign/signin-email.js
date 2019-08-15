import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './sign.scss';

import fire, { defaultSignedUrl } from '../../../config/config';

class SigninEmail extends Component {

    constructor(){
		super();
		this.state = {
            signed: false, 
            welcome: false
        };

        if (fire.auth().isSignInWithEmailLink(window.location.href)){
            
            var email = window.localStorage.getItem('emailForSignIn');
    
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }

            email = email.trim();

            fire.auth().signInWithEmailLink(email, window.location.href)
            .then(function(result) {
                window.localStorage.removeItem('emailForSignIn');
            }).catch(function(error) {
                console.error(error);
            });
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

    render () {
        if (this.state.signed && this.state.welcome === false)
        {
            return <Redirect to={defaultSignedUrl} />
        }
        
        if (this.state.signed && this.state.welcome === true){
            return <Redirect to="/welcome" />
        }

        return (<div className="kk"></div>)
    }
}

export default SigninEmail
