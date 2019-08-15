import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import Gap from '../../gap/gap';

import './filter.scss';
import fire from '../../../config/config';
import Loading from '../../../assets/images/spinner.png';

export default class Filter extends Component {
	constructor(){
		super();
		this.state = {
			tags: undefined,
			loading_finish: false
		}

		this.taglist = [];
		var getTagList = this.getTagList.bind(this);
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				fire.database().ref("Posts/" + user.uid + "/").orderByKey().once("value", function (items){
					getTagList(items);
				});
			}
		});
	}

	getTagList(plist){
		plist.forEach(item => {
			if (item.val().Tags !== undefined){
				item.val().Tags.forEach(tag => {
					if(this.taglist.indexOf(tag) === -1){
						this.taglist.push(tag);
					}
				});
			}
		});

		this.setState({tags: this.taglist});
		this.setState({loading_finish: true});
	}

	onTagDetail (tag){
		window.location.href = "/posts?type=tag-filter&search=" + tag;
	}

	render () {
		return (
			<DefaultTemplate pageType="filter">
				<div className="page-container page-filter" align="left">
					<Gap hei="3" />
					<div className="content">
					{
						(this.state.tags === undefined && this.state.loading_finish === false) ? (
							<div className="loading-container" align="center"><img src={Loading} className="loading" alt=""/></div>
						) : (
							<div className="tags">
								{
									(this.state.tags === undefined && this.state.loading_finish === true) ? (
										<div className="search-result"><span>There is no tags.</span></div>
									) : this.state.tags.map((tag, index) => (
										<div key={index} className="tag" onClick={this.onTagDetail.bind(this, tag)}>{tag}</div>
									))
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