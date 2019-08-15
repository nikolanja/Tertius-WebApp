import React, { Component } from 'react';
import ReactModal from 'react-modal';
import DefaultTemplate from '../../templates/default';
import TIcon from '../../icon-svg/icon-svg';
import Gap from '../../gap/gap';
import './post.scss';
import Loading from '../../../assets/images/spinner.png';

import fire from '../../../config/config';
import createPostPdf from '../../../utils/pdf-manager';
import { Redirect } from 'react-router-dom';

class Tag extends Component {
	onTagDetail (tagname) {
		window.location.href="/posts?type=tag-filter&search=" + tagname;
	}

	render () {
		return (
			<div className='tag' onClick={this.onTagDetail.bind(this, this.props.children)}>{this.props.children}</div>
		);
	}
}

class Post extends Component {
	constructor(props){
		super();
		this.state = {
			showSettingMenu: false,
			showTrashModalOpen: false,
			post: undefined,
			loading_finish: false,
			is_subscribe: false
		};

		this.showSettingMenu = this.showSettingMenu.bind(this);
    	this.closeSettingMenu = this.closeSettingMenu.bind(this);

    	this.onOpenTrashModal = this.onOpenTrashModal.bind(this);
		this.onCloseTrashModal = this.onCloseTrashModal.bind(this);

		const queryString = require('query-string');
		const parsed = queryString.parse(props.location.search);
		this.postKey = parsed.key;

		this.currentUser = {};
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				fire.database().ref("User/" + user.uid).once("value", function(item){
					const signedUser = item.val();
					const currentTime = Date.now();
					if(signedUser.ExpiredAt < currentTime){
						this.setState({is_subscribe: true});
					}else {
						fire.database().ref("Posts/" + user.uid + "/" + this.postKey).once("value", function (item){
							this.getPost(item, user);
						}.bind(this));
					}
				}.bind(this));
			}
		});
	}

	getPost(item, user){
		this.currentUser = user;
		if (item.val() === null)
		{
			this.setState({loading_finish: true});
			this.setState({post: undefined});
		}else {
			var tmppost = {};
			tmppost.Key = item.key;
			tmppost.Title = item.val().Title === '' ? "Untitled post": item.val().Title;
			tmppost.Content = item.val().Content;
			tmppost.Date = item.val().Date;
			tmppost.Comment = item.val().Comment;
			if (item.val().Resources !== undefined) {
				tmppost.Publication = item.val().Resources.PubTitle === undefined ? '' : item.val().Resources.PubTitle;
				tmppost.Author = item.val().Resources.Author === undefined ? '' : item.val().Resources.Author;
				tmppost.CoAuthor = item.val().Resources.CoAuthor === undefined ? '' : item.val().Resources.CoAuthor;
				tmppost.PageNumber = item.val().Resources.PageNumber === undefined ? '' : item.val().Resources.PageNumber;
			}
			if (item.val().Tags !== undefined){
				tmppost.Tags = [];
				item.val().Tags.forEach(tag => {
					tmppost.Tags.push(tag);
				});
			}
			tmppost.Userid = user.uid;
			this.setState({post: tmppost});
			this.setState({loading_finish: true});

			/////////////////////////////
			document.getElementById('post-content').innerHTML = this.state.post.Content;
			window.localStorage.setItem('single-post', JSON.stringify(this.state.post));
		}
	}

	componentDidMount() {
		ReactModal.setAppElement('body');
	};

	onOpenTrashModal = () => {
	    this.setState({ showTrashModalOpen: true });
	};

	onCloseTrashModal = () => {
	    this.setState({ showTrashModalOpen: false });
	};

	showSettingMenu(event) {
	    event.preventDefault();
	    
	    this.setState({ showSettingMenu: true }, () => {
	    	document.addEventListener('click', this.closeSettingMenu);
	    });
	}

	closeSettingMenu() {
	    this.setState({ showSettingMenu: false }, () => {
	    	document.removeEventListener('click', this.closeSettingMenu);
	    });
	}

	onPostSearch (type, con) {
		window.location.href = "/posts?type=" + type + "&search=" + con;
	}

	onTrashPost () {
		fire.database().ref("Posts/" + this.state.post.Userid + "/" + this.state.post.Key).remove();
		window.location.href = '/posts';
	}

	onExportPdf() {
		var filename = "Post" + this.state.post.Key + ".pdf";
		createPostPdf(this.state.post, filename).save(filename);
	}

	render() {
		return (
			<DefaultTemplate>
				{
					this.state.is_subscribe === false ? (
					<div className="page-container post" align="left">
						<Gap hei="3" />
						{
							this.state.post === undefined && this.state.loading_finish === false ? (
								<div className="loading-container" align="center"><img src={Loading} className="loading" alt=""/></div>
							) : (
								<div className="content">
									{
										this.state.post === undefined && this.state.loading_finish === true ? (null) :(
											<div >
												<div className="post-setting" align="right">
													<TIcon cl="btn-icon" icon="cog" wid="27" hei="27" fcolor="#757575" onIconClick={this.showSettingMenu}/>
													{
														this.state.showSettingMenu ? (
														<div className="sub-menu">
															<ul className="setting-menu">
																<li><a href="/edit-title-excerpt"><div>Edit Title/Excerpt</div></a></li>
																<li><a href="/edit-citation"><div>Edit Citation</div></a></li>
																<li><a href="/edit-tags"><div>Edit Tags</div></a></li>
																<li><a href="/edit-comment"><div>Edit Comment</div></a></li>
																<li><div onClick={this.onExportPdf.bind(this)}>Export to PDF</div></li>
																<li><div onClick={this.onOpenTrashModal} className="trash">Trash</div></li>
															</ul>
														</div>
														) : (
															null
														)
													}
													<ReactModal 
													isOpen={this.state.showTrashModalOpen}
													contentLabel=""
													onRequestClose={this.onCloseTrashModal}
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
															<p>Are you sure you want to permanently delete this post from your archive?</p>
															<Gap hei="14"/>
															<button className="confirm-deactive" onClick={this.onTrashPost.bind(this)}>Trash Post</button>
															<Gap hei="14"/>
															<div className="cancel-deactive" onClick={this.onCloseTrashModal}>Nevermind</div>
														</div>
													</ReactModal>
												</div>
												<div className="citations">
													{
														(this.state.post.Date === undefined || this.state.post.Date.trim() === '') ? (null) : (
															<div className="citation" onClick={this.onPostSearch.bind(this, 'date-filter', this.state.post.Date)}>
																<div className="icon">
																	<TIcon icon="calendar" wid="18" hei="20" fcolor="#757575"/>
																</div>
																<span>{this.state.post.Date.substr(0, this.state.post.Date.indexOf(' at'))}</span>
															</div>
														)
													}
													{
														(this.state.post.Publication === undefined || this.state.post.Publication.trim() === '') ? (null) : (
															<div className="citation" onClick={this.onPostSearch.bind(this, 'title-filter', this.state.post.Publication)}>
																<div className="icon">
																	<TIcon icon="book" wid="18" hei="18" fcolor="#757575"/>
																</div>
																<span>{this.state.post.Publication}</span>
															</div>
														)
													}
													{
														(this.state.post.Author === undefined || this.state.post.Author.trim() === '') ? (null) : (
															<div className="citation" onClick={this.onPostSearch.bind(this, 'author-filter', (this.state.post.CoAuthor === undefined || this.state.post.CoAuthor === '') ? this.state.post.Author : this.state.post.Author + ", " + this.state.post.CoAuthor)}>
																<div className="icon">
																	<TIcon icon="quote" wid="18" hei="20" fcolor="#757575"/>
																</div>
																<span>{(this.state.post.CoAuthor === undefined || this.state.post.CoAuthor === '') ? this.state.post.Author : this.state.post.Author + ", " + this.state.post.CoAuthor}</span>
															</div>		
														)
													}
													{
														(this.state.post.PageNumber === undefined || this.state.post.PageNumber.trim() === '') ? (null) : (
															<div className="citation">
																<div className="icon">
																	<TIcon icon="pushpin2" wid="18" hei="20" fcolor="#757575"/>
																</div>
																<span>{this.state.post.PageNumber}</span>
															</div>
														)
													}
												</div>

												<Gap hei="23" />
												<span className="post-title">{this.state.post.Title}</span>
												<Gap hei="26" />
												<p className="post-content" id="post-content"></p>
												<Gap hei="32" />
												<div className="post-line"></div>
												<div className="tag-list">
													{
														(this.state.post === undefined || this.state.post.Tags === undefined) ? (null) : (
															this.state.post.Tags.map((tag, index) =>
																<Tag key={index}>{tag}</Tag>
															)
														)
													}
												</div>

												<div className="post-line"></div>
												<Gap hei="36" />
												<div className="comment">
													<div className="comment-head">
														<TIcon icon="message-circle" wid="20" hei="20" fcolor="#111111"></TIcon>
														<span>Comments</span>
													</div>
													<Gap hei="29" />
													<p className="comment_p">{this.state.post.Comment}</p>	
												</div>
											</div>
										)
									}
								</div>
							)
						}
						{
							(this.state.post === undefined && this.state.loading_finish === true) ? (
								<div className="search-result"><span>There is no result.</span></div>
							) : (null)
						}
					</div>) : (
						<Redirect to="/payment"/>
					)
				}
			</DefaultTemplate>
		);
	}
}

export default Post