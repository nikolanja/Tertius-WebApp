import React, { Component } from 'react';
import fire,{ defaultUrl } from '../../../config/config';
import logo from '../../../assets/images/sign-logo.png';
import './payment.scss'
import Gap from '../../gap/gap';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loading from '../../../assets/images/spinner.png';

// const STRIPE_PK = 'pk_test_HrJXvIAltsEAm2iKpmVacAuy';
const SUBSCRIPTION_URL = 'https://us-central1-tertius-ios-firebase.cloudfunctions.net/createSubscribe';

class Payment extends Component {

	constructor(props){
		super();
		this.state = {
			is_signed: true,
			is_subscribe: true,
			subscribe_type: 'yearly',
			subscribeFinish: false
		};

		this.currentUser = {};
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				fire.database().ref("User/" + user.uid).once("value", function(item){
					const signedUser = item.val();
					const currentTime = Date.now();
					this.currentUser = signedUser
					if(signedUser.ExpiredAt < currentTime){
						this.setState({is_subscribe: true});
					}else {
						this.setState({is_subscribe: false});
					}
				}.bind(this));
			} else {
				this.setState({is_signed: false});
			}
		});
	}

	componentDidMount () {
		var payform = require('payform');

		const ccnumber = ReactDOM.findDOMNode(this.refs.ccnumber);
		const expired = ReactDOM.findDOMNode(this.refs.expired)
		const scode = ReactDOM.findDOMNode(this.refs.scode)

		payform.cardNumberInput(ccnumber);
		payform.expiryInput(expired);
		payform.cvcInput(scode);
	}

	async onStartMembership () {
		const ccnumber = ReactDOM.findDOMNode(this.refs.ccnumber);
		const expired = ReactDOM.findDOMNode(this.refs.expired)
		const scode = ReactDOM.findDOMNode(this.refs.scode)
		const error = ReactDOM.findDOMNode(this.refs.error)
		const error_message = ReactDOM.findDOMNode(this.refs.error_message)

		var payform = require('payform');

		if(ccnumber.value.trim() === ''){
			error.innerHTML="Please enter card number."
			error_message.classList.remove('hide');
			ccnumber.focus();
			return ;
		}

		if(payform.validateCardNumber(ccnumber.value.trim()) === false){
			error.innerHTML="Invalid card number."
			error_message.classList.remove('hide');
			ccnumber.focus();
			return ;
		}

		if(expired.value.trim() === ''){
			error.innerHTML="Please enter expiry"
			error_message.classList.remove('hide');
			expired.focus();
			return ;
		}

		const expiry = payform.parseCardExpiry(expired.value.trim());
		if(expiry === undefined || expiry.month === undefined || expiry.year === undefined || payform.validateCardExpiry(expiry.month, expiry.year) === false){
			error.innerHTML="Invalid expiry."
			error_message.classList.remove('hide');
			expired.focus();
			return ;
		}

		if(scode.value.trim() === ''){
			error.innerHTML="Please enter security code"
			error_message.classList.remove('hide');
			scode.focus();
			return ;
		}

		if(payform.validateCardCVC(scode.value.trim()) === false){
			error.innerHTML="Invalid security code."
			error_message.classList.remove('hide');
			scode.focus();
			return ;
		}

		error_message.classList.add('hide');

		var loadingFrame = ReactDOM.findDOMNode(this.refs.loading);
		loadingFrame.classList.remove("hide");
		ReactDOM.findDOMNode(this.refs.btnStart).disabled = true

		axios({
			url: SUBSCRIPTION_URL,
			method: 'post',
			data: {
				user_id: this.currentUser.userID,
				card_no: ccnumber.value,
				card_expiry_month: expiry.month,
				card_expiry_year: expiry.year,
				card_cvc: scode.value,
				subscribe_type: this.state.subscribe_type
			}
		}).then(data => {
			loadingFrame.classList.add("hide");
			ReactDOM.findDOMNode(this.refs.btnStart).disabled = false
			this.setState({subscribeFinish: true});
		}).catch(error => {
			loadingFrame.classList.add("hide");
			ReactDOM.findDOMNode(this.refs.btnStart).disabled = false
			error.innerHTML="Error occurred and subscribe is failed."
			error_message.classList.remove('hide');
			console.log(error);
		})
	}

	onCardNumberChange(e) {
		var payform = require('payform');
		const ccnumber = ReactDOM.findDOMNode(this.refs.ccnumber);
		const cardtype = payform.parseCardType(ccnumber.value);

		switch(cardtype){
			case 'visa':
				this.setClasstoCCNumberIcon('fa-cc-visa');
				break;
			case 'mastercard':
				this.setClasstoCCNumberIcon('fa-cc-mastercard');
				break;
			case 'amex':
				this.setClasstoCCNumberIcon('fa-cc-amex');
				break;
			case 'dinersclub':
				this.setClasstoCCNumberIcon('fa-cc-diners-club');
				break;
			case 'discover':
				this.setClasstoCCNumberIcon('fa-cc-discover');
				break;
			case 'unionpay':
				this.setClasstoCCNumberIcon('fa-cc-visa');
				break;
			case 'jcb':
				this.setClasstoCCNumberIcon('fa-cc-jcb');
				break;
			default: 
				this.setClasstoCCNumberIcon('fa-credit-card');
				break;
		}
	}

	setClasstoCCNumberIcon(styleClass){
		const ccicon = ReactDOM.findDOMNode(this.refs.ccicon);
		ccicon.className = "";
		ccicon.classList.add('fa');
		ccicon.classList.add(styleClass);
	}

	onSubscriptionType(type){
		this.setState({subscribe_type: type});
	}

  	render() {
		if (this.state.subscribeFinish){
			return (
				<Redirect to="/posts" />
			)
		}

	  	else if(this.state.is_signed && this.state.is_subscribe){
			return (
				<div className="subscribe" align="center">
					<div className="subscribe-content">
						<div className="logo"><img src={logo} alt="logo" /></div>
						
						<Gap hei="20" />
						
						<span className="title">Become a member<br /></span>
						<span className="desc">You’ve reached the end of your free trial.<br />Upgrade for unlimited access, cancel anytime.</span>
						
						<Gap hei="50" />
						
						<div className="plan">
							<span className="title">plan</span>
							<div className="content">
								<label className="container"> $50/year(save $10)
									<input type="radio" defaultChecked="checked" name="radio" onClick={() => this.onSubscriptionType('yearly')}/>
									<span className="checkmark"></span>
								</label>
								<label className="container"> $5/month
									<input type="radio" name="radio" onClick={() => this.onSubscriptionType('monthly')}/>
									<span className="checkmark"></span>
								</label>
							</div>
						</div>

						<div className="payment">
							
							<span className="title">payment</span>
							<div className="content">
								
								<div className="payment-title" align="center">
									<span>Pay with card</span>
								</div>

								<div className="card-info">
									<div className="credit-card-number">
										<span>Credit card number</span><br/>
										<input ref="ccnumber" type="tel" name="ccnumber" placeholder="XXXX XXXX XXXX XXXX" onKeyUp={this.onCardNumberChange.bind(this)} />
										<div className="card-icon">
											<i className="fa fa-credit-card" ref="ccicon"></i>
										</div>
									</div>

									<div className="exp-sec">
										<div className="expiration">
											<span>Expiration</span><br/>
											<input id="expiration" ref="expired" type="tel" placeholder="MM/YY" />
										</div>

										<div className="security-code">
											<span>Security code</span><br/>
											<input id="sec" ref="scode" type="tel" placeholder="XXX" />
										</div>
									</div>
								</div>

								<div className="membership-desc">
									<p>By clicking “Start my membership,” you agree to our <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>. Your payment method will be charged a recurring fee of $50/year or $5/month, depending on your choice, unless you decide to cancel. No refunds for memberships canceled between billing cycles.</p>
								</div>

								<div className="error-message hide" align="center" ref="error_message">
									<span ref="error"></span>
								</div>

								<div className="loading-container hide" ref="loading" align="center"><img src={Loading} className="loading" alt=""/></div>

								<div className="action" align="center">
									<button type="button" onClick={this.onStartMembership.bind(this)} ref="btnStart">Start my membership</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
	  } else if (this.state.is_signed === false){
		  return (
			  <Redirect to={defaultUrl} />
		  );
	  } else if (this.state.is_subscribe === false){
		return (
			<Redirect to="/posts" />
		)
	  }
  }
}

export default Payment;