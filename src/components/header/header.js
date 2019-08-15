import React, { Component } from 'react';
import logo from '../../assets/images/sign-logo.png';
import TIcon from '../icon-svg/icon-svg';
import './header.scss';

import fire, { defaultUrl, defaultSignedUrl } from '../../config/config';

export default class PageHeader extends Component {

	constructor(){
		super();
		this.state = {
			showMenu: false,
			signed: false
		};

		this.showMenu = this.showMenu.bind(this);
    	this.closeMenu = this.closeMenu.bind(this);
	}
	
	showMenu(event) {
	    event.preventDefault();
	    
	    this.setState({ showMenu: true }, () => {
	    	document.addEventListener('click', this.closeMenu);
	    });
	}

	closeMenu() {
	    this.setState({ showMenu: false }, () => {
	    	document.removeEventListener('click', this.closeMenu);
	    });
	}

	onSignOut () {
		fire.auth().signOut().then(function() {
			
		}).catch(function(error) {
			// An error happened.
		});
	}

	setSignedState(val){
		this.setState({signed: val});
	}

	componentWillMount() {
		var setSignedState = this.setSignedState.bind(this);
		fire.auth().onAuthStateChanged(function(user) {
			if (user) {
				setSignedState(true);
				// User is signed in.
			} else {
				// No user is signed in.
				setSignedState(false);
				var url = window.location.pathname;
				if(url !== '/privacy' && url !== '/terms'){
					window.localStorage.removeItem('signEmail');
					window.location.href = defaultUrl;
				}
				this.setState({signed: false});				
			}
		});
	}

	render() {
	  	return (
	    	<div className="header-back" align="center">
	    		<div className="content-container">
	    			<div className="logo" align="left">
	    				<a href={defaultSignedUrl}><img src={logo} alt="" /></a>
	    			</div>
					{ 
						this.state.signed ? (
							<div className="header-action" align="right">
								<div className="actions">
									<TIcon cl="btn-icon" icon="user" wid="30" hei="30" fcolor="#757575" onIconClick={this.showMenu}/>
									{
										this.state.showMenu ? (
											<div className="sub-menu">
												<ul className="user-menu">
													<li><a href="/welcome"><div>Welcome</div></a></li>
													<li><a href="/settings"><div>Settings</div></a></li>
													<li><a href="https://help.tertius.app" target="_blank" rel="noopener noreferrer"><div>Help</div></a></li>
													<li><div onClick={this.onSignOut.bind(this)}>Sign out</div></li>
												</ul>
											</div>
										) : ( null )
									}
								</div>
								{
									this.props.headerType !== 'edit-type' ? (
										<div className="actions">
											<a href="/filter"><TIcon cl={this.props.pageType === 'filter' ? "btn-icon-active" :"btn-icon"} icon="filter" wid="32" hei="30" fcolor="#757575"/></a>
										</div>
									) : ( null )
								}
								{
									this.props.headerType !== 'edit-type' ? (
										<div className="actions">
											<a href="/search"><TIcon cl={this.props.pageType === 'search' ? "btn-icon-active" :"btn-icon"} icon="search" wid="30" hei="30" fcolor="#757575"/></a>
										</div>
									) : ( null )
								}
							</div>
						) : ( null )
					}
	    		</div>
	    	</div>
	    );
	}
}