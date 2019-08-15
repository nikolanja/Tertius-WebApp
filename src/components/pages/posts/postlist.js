import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import TButton from '../../buttons/tbutton/tbutton';
import Gap from '../../gap/gap';
import PostItem from '../../postitem/postitem';
import Loading from '../../../assets/images/spinner.png';
import './post.scss';

import fire from '../../../config/config';

export default class PostList extends Component {
	
	constructor(props){
		super();

		this.state = {
			posts: undefined,
			postLimit: 10, 
			loading_finish: false
		}

		const queryString = require('query-string');
		const parsed = queryString.parse(props.location.search);
		this.postpagetype = parsed.type;
		this.search = parsed.search;
		this.postlist = [];
		var getPostList = this.getPostList.bind(this);
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				fire.database().ref("Posts/" + user.uid + "/").orderByKey().once("value", function (items){
					getPostList(items);
				});
			}
		});
	}

	addPostList(post){
		this.postlist.unshift(post);
	}

	getPostList(plist){
		plist.forEach(item => {
			if(item.val().Date !== undefined){
				var post = {};
				post.Key = item.key;
				post.Title = item.val().Title === '' ? "Untitled post": item.val().Title;
				post.Content = item.val().Content;
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

				if (this.postpagetype === undefined) {
					this.addPostList(post);
				}
				else if (this.postpagetype === "tag-filter") {
					if (post.Tags !== undefined) {
						if (post.Tags.indexOf(this.search) >= 0){
							this.addPostList(post);
						}
					}
				} else {
					if ( this.postpagetype === 'search-filter' ) {
						if ((post.Title !== undefined && post.Title.toLowerCase().search(this.search.toLowerCase()) >= 0) ||
							(post.Content !== undefined && post.Content.toLowerCase().search(this.search.toLowerCase()) >= 0)) {
							this.addPostList(post);
						}
					} else if ( this.postpagetype === 'title-filter' ) {
						if (post.Publication !== undefined && post.Publication.search(this.search) >= 0) {
							this.addPostList(post);
						}
					} else if (this.postpagetype === 'author-filter') {
						let stringArray = this.search.split(", ")
						
						if (stringArray.length > 1) {
							if ((post.Author !== undefined && post.Author.search(stringArray[0]) >= 0) ||
							   (post.CoAuthor !== undefined && post.CoAuthor.search(stringArray[1]) >= 0)) {
								this.addPostList(post);
							}
						} else {
							if (post.Author !== undefined && post.Author.search(stringArray[0]) >= 0) {
								this.addPostList(post);
							}
						}
					} else if (this.postpagetype === 'date-filter') {
						if (post.Date !== undefined && post.Date.search(this.search) >= 0) {
							this.addPostList(post);
						}
					}
				}
			}
		});

		this.setState({posts: this.postlist});
		this.setState({loading_finish: true});
	}

	onLoadMore () {
		this.setState({postLimit: this.state.postLimit + 10});
	}

	renderTodos () {
        return this.state.posts.slice(0, this.state.postLimit).map((post, index)=>{
            return(
                <PostItem data={post} key={index}></PostItem>
            );
        });
	}
	
	onSearch(event){
		if(event.keyCode === 13){
			if(document.getElementById('search').value === ''){
				alert('Please input search string.');
			}else {
				window.location.href = "/posts?type=search-filter&search=" + document.getElementById('search').value;
			}
		}
	}

	render() {
		return (
			<DefaultTemplate>
				<div className="page-container post-list" align="left">
					<div className="content postlist">
						{
							this.postpagetype === 'tag-filter' ? (
								<div className="filter-header">
									<span className="fh-title">tagged in</span>
									<Gap hei="35" />
									<div className="tag">{this.search}</div>
									<Gap hei="41" />
									<div className="filter-line"></div>
									<Gap hei="35" />
								</div>
							) : (null)
						}
						{
							this.postpagetype === 'search-filter' ? (
								<div className="filter-header">
									<span className="fh-title">search</span>
									<Gap hei="42" />
									<input type="text" id='search' defaultValue={this.search} onKeyUp={this.onSearch.bind(this)} />
									<Gap hei="4" />
									<div className="filter-line"></div>
									<Gap hei="35" />
								</div>
							) : (null)
						}
						{
							this.postpagetype === 'date-filter' ? (
								<div className="filter-header">
									<span className="fh-title">sort by</span>
									<Gap hei="35" />
									<span className="filter-content">{this.search}</span>
									<Gap hei="37" />
									<div className="filter-line"></div>
									<Gap hei="35" />
								</div>
							) : (null)
						}
						{
							this.postpagetype === 'title-filter' ? (
								<div className="filter-header">
									<span className="fh-title">sort by</span>
									<Gap hei="35" />
									<span className="filter-content">{this.search}</span>
									<Gap hei="37" />
									<div className="filter-line"></div>
									<Gap hei="35" />
								</div>
							) : (null)
						}
						{
							this.postpagetype === 'author-filter' ? (
								<div className="filter-header">
									<span className="fh-title">sort by</span>
									<Gap hei="35" />
									<span className="filter-content">{this.search}</span>
									<Gap hei="37" />
									<div className="filter-line"></div>
									<Gap hei="35" />
								</div>
							) : (null)
						}
						<Gap hei="3" />
						{
							(this.state.posts === undefined && this.state.loading_finish === false) ? (
								<div className="loading-container" align="center"><img src={Loading} className="loading" alt=""/></div>
							) : (
								<div>
									{
										(this.state.posts === undefined || this.state.posts.length === 0) ? (
											<div className="search-result"><span>No results found.</span></div>
										) : this.renderTodos() 
									}
									{
										(this.state.posts === undefined || this.state.posts.length === 0) ? (
											null
										) : (
											this.state.posts.length === 0 || this.state.postLimit >= this.state.posts.length) ? (null) : (
											<div className="action" align="center">
												<TButton btntype="btnframe btn-green" rpad="22" lpad="22" clickEvent={this.onLoadMore.bind(this)}>Load more</TButton>
											</div>
										)
									}
								</div>
							)
						}
					</div>
				</div>
			</DefaultTemplate>
		);
	}
}