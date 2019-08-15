import React, { Component } from 'react';
import TIcon from '../icon-svg/icon-svg';
import Gap from '../gap/gap';
import './postitem.scss';

export default class PostItem extends Component {
	componentDidMount(){
		document.getElementById("postcontent" + this.props.data.Key).innerHTML = this.props.data.Content;
	}

	postDetailView () {
		window.location.href="/post?key=" + this.props.data.Key;
	}

	render () {
		return (
			<div className="post-item">
				<div className="post-item-content">
					<div className="citation">
						<div className="icon">
							<TIcon icon="calendar" wid="18" hei="20" fcolor="#757575"/>
						</div>
						<span>{this.props.data.Date.substr(0, this.props.data.Date.indexOf(' at'))}</span>
					</div>
					<Gap hei="23" />
					<span className="post-title" onClick={this.postDetailView.bind(this)}>{this.props.data.Title}</span>
					<Gap hei="5" />
					<p className="post-content" style={{WebkitBoxOrient: 'vertical'}} id={"postcontent" + this.props.data.Key}></p>
					<Gap hei="11" />
					{
						(this.props.data.Publication !== undefined && this.props.data.Publication.trim() !== '') ? (
						<div className="citation">
							<div className="icon">
								<TIcon icon="book" wid="18" hei="18" fcolor="#757575"/>
							</div>
							<span>{this.props.data.Publication}</span>
						</div>
						) : (null)
					}

					{
						(this.props.data.Author !== undefined && this.props.data.Author.trim() !== '') ? (
							<div className="citation">
								<div className="icon">
									<TIcon icon="quote" wid="18" hei="20" fcolor="#757575"/>
								</div>
								<span>{this.props.data.Author === undefined ? '' : this.props.data.Author}{(this.props.data.CoAuthor === undefined || this.props.data.CoAuthor === '') ? '' : ', ' + this.props.data.CoAuthor}</span>
							</div>
						) : (null)
					}
					
					{
						(this.props.data.PageNumber !== undefined && this.props.data.PageNumber.trim() !== '') ? (
							<div className="citation">
								<div className="icon">
									<TIcon icon="pushpin2" wid="18" hei="20" fcolor="#757575"/>
								</div>
								<span>{this.props.data.PageNumber}</span>
							</div>
						) : ( null )
					}
				</div>

				<Gap hei="34" />
				<div className="post-line"></div>
				<Gap hei="39" />
			</div>
		);
	}
}