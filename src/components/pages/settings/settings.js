import React, { Component } from 'react';
import ReactModal from 'react-modal';
import DefaultTemplate from '../../templates/default';
import TButton from '../../buttons/tbutton/tbutton';
import Gap from '../../gap/gap';
import './settings.scss';
import fire from '../../../config/config';
import createPostPdf from '../../../utils/pdf-manager';
import Loading from '../../../assets/images/spinner.png';
import * as EmailValidator from 'email-validator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';

const USER_DEACTIVE_URL = 'https://us-central1-tertius-ios-firebase.cloudfunctions.net/deactiveUser';

class Settings extends Component {
	constructor(){
		super();
		this.state = {
			emailNotification: false,
			deactive_modal_open: false,
			account_modal_open: false,
			close_icon: false,
			loading_finish: false,
			currentUser: {},
			email_editing: false,
			small: true
		};

		this.onOpenDeactiveModal = this.onOpenDeactiveModal.bind(this);
		this.onCloseDeactiveModal = this.onCloseDeactiveModal.bind(this);
		this.onOpenAccountModal = this.onOpenAccountModal.bind(this);
		this.onCloseAccountModal = this.onCloseAccountModal.bind(this);

		var onSetCurrentUser = this.onSetCurrentUser.bind(this);
		fire.auth().onAuthStateChanged((user) => {
			if (user) {

				fire.database().ref("Posts/" + user.uid + "/" + this.postKey).once("value", function (item){
					onSetCurrentUser(user, false);
				});
			}
		});
	}

	componentWillMount() {
		ReactModal.setAppElement('body');
	}

	onSetCurrentUser(user, isEditting) {
		this.setState({
			currentUser: user,
			loading_finish: true,
			email_editing: isEditting
		});
	}

	onOpenDeactiveModal = () => {
	    this.setState({ deactive_modal_open: true });
	};

	onCloseDeactiveModal = () => {
	    this.setState({ deactive_modal_open: false });
	};

	onOpenAccountModal = () => {
	    this.setState({ account_modal_open: true });
	};
	
	onCloseAccountModal = () => {
	    this.setState({ account_modal_open: false });
	};

	editEmail () {
		this.setState({email_editing: true});
	}

	downloadZip () {
		fire.database().ref("Posts/" + this.state.currentUser.uid + "/").orderByKey().once("value", function (items){
			if(items === undefined){
				return ;
			}
			var zip = new JSZip();
			items.forEach(item => {
				if(item.val().Date !== undefined){
					var post = {};
					post.Key = item.key;
					post.Title = item.val().Title === '' ? "Untitled post": item.val().Title;
					post.Content = item.val().Content;
					post.Comment = item.val().Comment;
					post.Date = item.val().Date;
					if (item.val().Resources !== undefined) {
						post.Publication = item.val().Resources.PubTitle === undefined ? '' : item.val().Resources.PubTitle;
						post.Author = item.val().Resources.Author === undefined ? '' : item.val().Resources.Author;
						post.CoAuthor = item.val().Resources.CoAuthor === undefined ? '' : item.val().Resources.CoAuthor;
						post.PageNumber = item.val().Resources.PageNumber === undefined ? '' : item.val().Resources.PageNumber;
					}
					if (item.val().Tags !== undefined){
						post.Tags = [];
						item.val().Tags.forEach(tag => {
							post.Tags.push(tag);
						});
					}
					
					var filename = "post" + post.Key + '.pdf';
					var pdf = createPostPdf(post, filename);
					zip.file(filename, pdf.output('blob'));
				}
			});

			zip.generateAsync({type:"blob"}).then(function(content) {
				// see FileSaver.js
				saveAs(content, "posts.zip");
			});
		});
	}

	onDelectAccount () {
		if(this.state.currentUser.email !== document.getElementById('contact-email').value.trim()){
			alert('valid email');
			return ;
		}
		fire.database().ref("Posts/" + this.state.currentUser.uid).remove();
		fire.database().ref("User/" + this.state.currentUser.uid).remove();
		fire.auth().signOut().then(function() {
			
		}).catch(function(error) {
			// An error happened.
		});
	}

	onDeactiveAccount() {
		axios({
			url: USER_DEACTIVE_URL,
			method: 'post',
			data: {
				user_id: this.state.currentUser.uid,
			}
		}).then(data => {
			fire.auth().signOut()
		}).catch(error => {
			console.log(error);
		})
	}

	onEditEmailCancel() {
		this.setState({email_editing: false});
	}

	onSaveEmail() {
		var newEmail = document.getElementById('change-email').value.trim();

		if(!EmailValidator.validate(newEmail))
			return ;
		
		var onSetCurrentUser = this.onSetCurrentUser.bind(this);
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				user.updateEmail(newEmail).then(function() { 
					console.log("new email is " + user.email);
					onSetCurrentUser(user, false);
				}, function(error) { 
					console.log(error);
				});
			}
		});
	}

	render() {
//		const widthStyle = this.state.small === true ? 'calc(100%-40px)' : '442px';
	  	return (
	  		<DefaultTemplate>
				<div className="page-container settings" align="left">
					<div className="title">
						<span>settings</span>
					</div>
					{
						this.state.loading_finish === true ? (
							<div className="content sections">
								<div className="section">
									<div className="section-title">
										<span>Your email</span>
									</div>
									<Gap hei="25"></Gap>
									{
										this.state.email_editing === false ? (
											<div className="email-row">
												<div className="email-label" align="left">
													<span id="static-email">{this.state.currentUser.email}</span>
												</div>
												<div className="email-btn" align="right">
													<TButton btntype="btnframe btn-gray" lpad="15" rpad="15" clickEvent={this.editEmail.bind(this)}>Edit Email</TButton>
												</div>
											</div>
										) : (
											<div className="email-row">
												<div className="email-label" align="left">
													<input type="text" id="change-email" defaultValue={this.state.currentUser.email}/>
												</div>
												<div className="email-btn" align="right">
													<TButton btntype="btnframe btn-green" lpad="15" rpad="15" clickEvent={this.onSaveEmail.bind(this)}>Save</TButton>
													<TButton btntype="btnnoframe btn-gray" lpad="15" rpad="0" clickEvent={this.onEditEmailCancel.bind(this)}>Cancel</TButton>
												</div>
											</div>
										)
									}
								</div>

								<div className="section">
									<div className="section-title">
										<span>Download archive</span>
									</div>
									<Gap hei="14"></Gap>
									<p>Download a copy of the content you’ve archived on Tertius to a .zip file.</p>
									<Gap hei="19"></Gap>
									<div className="">
										<TButton rpad="18" lpad="18" btntype="btnframe btn-gray" clickEvent={this.downloadZip.bind(this)}>Download .zip</TButton>
									</div>
									<Gap hei="14"></Gap>
								</div>

								<div className="section">
									<div className="section-title">
										<span>Deactivate account</span>
									</div>
									<Gap hei="14"></Gap>
									<p>Deactivating your account will suspend your service within a few minutes. You can sign up again anytime to reactivate your account and restore its content. </p>
									<Gap hei="19"></Gap>
									<div className="link" onClick={this.onOpenDeactiveModal}><span>Deactivate account</span></div>
									<ReactModal isOpen={this.state.deactive_modal_open}
									contentLabel="" onRequestClose={this.onCloseDeactiveModal}
									style={{
										overlay: {
											position: 'fixed',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundColor: 'rgba(243, 236, 223	, 0.9)'
										},
										content: {
											position: 'absolute',
											top: '153px',
											left: 'calc(50% - 221px)',
											width: '442px',
											height: '231px',
											borderRadius: '5px',
											borderColor: '#e7e3db',
											padding: 0,
											background: '#fbf7f0'
										}
									}}
									>
										<div className="deactive-modal" align="center">
											<p>Are you sure you want to deactivate your account?</p>
											<Gap hei="14"/>
											<button className="confirm-deactive" onClick={this.onDeactiveAccount.bind(this)}>Deactivate</button>
											<Gap hei="14"/>
											<div className="cancel-deactive" onClick={this.onCloseDeactiveModal}>Nevermind</div>
										</div>
									</ReactModal>
									<Gap hei="14"></Gap>
								</div>

								<div className="section">
									<div className="section-title">
										<span>Delete account</span>
									</div>
									<Gap hei="14"></Gap>
									<p>Permanently delete your account and all of your content.</p>
									<Gap hei="19"></Gap>
									<div className="link" onClick={this.onOpenAccountModal}><span>Delete account</span></div>
									<ReactModal 
									isOpen={this.state.account_modal_open}
									contentLabel=""
									onRequestClose={this.onCloseAccountModal}
									style={{
										overlay: {
											position: 'fixed',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundColor: 'rgba(243, 236, 223	, 0.9)'
										},
										content: {
											position: 'absolute',
											top: '153px',
											left: 'calc(50% - 221px)',
											width: '442px',
											height: '454px',
											borderRadius: '5px',
											borderColor: '#e7e3db',
											padding: 0,
											background: '#fbf7f0'
										}
									}}
									>
										<div className="account-delete-modal" align="center">
											<p>
												We’re sorry to see you go. Once your account is deleted, all of your content will be lost forever. If you’re not sure about that, we suggest you deactivate or contact support@tertius.app instead.<br/><br/>
												To confirm deletion, type your contact <br/>email below and click ‘Delete account’:
											</p>
											<Gap hei="5"/>
											<input className="contract-email" id="contact-email" type="text" />
											<Gap hei="35"/>
											<button className="confirm-account-delete" onClick={this.onDelectAccount.bind(this)}>Delete account</button>
											<Gap hei="11"/>
											<div className="cancel-account-delete" onClick={this.onCloseAccountModal}>Nevermind</div>
										</div>
									</ReactModal>
									<Gap hei="14"></Gap>
								</div>
							</div>
						) : (
							<div className="loading-container" align="center"><img src={Loading} className="loading" alt=""/></div>
						)
					}
				</div>
			</DefaultTemplate>
	    );
	}
}

export default Settings;