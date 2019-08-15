import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import Gap from '../../gap/gap';
import TIcon from '../../icon-svg/icon-svg';
import TButton from '../../buttons/tbutton/tbutton';
import './post.scss';

import fire from '../../../config/config';

export default class EditTags extends Component {
	constructor(){
		super();
		this.tags = JSON.parse(window.localStorage.getItem('single-post')).Tags
		if (this.tags === undefined){
			this.tags = [];
		}

		this.state = {
			tags: JSON.parse(window.localStorage.getItem('single-post')).Tags
		};

		this.post = JSON.parse(window.localStorage.getItem('single-post'))
	}

	componentDidMount(){
		this.nameInput.focus();
	}

	componentDidUpdate() {
		this.nameInput.focus();
	}

	deleteTags(no) {
		this.tags.splice(no, 1);
		this.setState({tags: this.tags});
	}

	addTags() {
		var tagname = document.getElementById('add_tag').value.trim();
		if (tagname === ''){
			document.getElementById('add_tag').value = '';
			return ;
		}
		this.tags.push(tagname);
		this.setState({tags: this.tags});
		document.getElementById('add_tag').value = '';
	}

	inputedTags(event){
		if (event.keyCode === 13 || event.keyCode === 9) {
			this.addTags();
	    }
	}

	saveTags () {
		var userid = this.post.Userid;
		var postkey = this.post.Key;

		fire.database().ref("Posts/" + userid + "/" + postkey + "/Tags").remove();
		var updates = {};
		console.log(this.state.tags);
		var st = true;
		for (var i = 0; i < this.state.tags.length; i++){
			st = false;
			updates["Posts/" + userid + "/" + postkey + "/Tags/" + i] = this.state.tags[i];
		}
		if(st === true) alert('updates data is null.');
		console.log(updates);
		fire.database().ref().update(updates)
		window.location.href = '/post?key=' + postkey;
	}

	cancelTags () {
		window.history.back();
	}

	render () {
		return (
			<DefaultTemplate headerType="edit-type">
				<div className="page-container edit-tags" align="left">
					<Gap hei="5" />
					<div className="content">
						<div className="tags">
							{
								this.state.tags === undefined ? (null) : (
								this.state.tags.map((tag, index) => (
									<div className="tag" key={index}>
										<span>{tag}</span>
										<div className="btn-close" onClick={this.deleteTags.bind(this, index)}>
											<TIcon cl="btn-icon" icon="x" wid="12" hei="12" fcolor="#757575"/>
										</div>
									</div>
								)))
							}
							<input id="add_tag" className="input_tag" type="text" placeholder="Add a tag..." onBlur={this.addTags.bind(this)} onKeyUp={this.inputedTags.bind(this)} defaultValue={this.state.add_tag} ref={(input) => { this.nameInput = input; }}/>
						</div>
						<div className="actions">
							<TButton btntype="btnframe btn-green" rpad="20" lpad="18" clickEvent={this.saveTags.bind(this)}>Save</TButton>
							<TButton btntype="btnnoframe btn-gray" rpad="16" lpad="16" clickEvent={this.cancelTags.bind(this)}>Cancel</TButton>
						</div>
					</div>
				</div>
			</DefaultTemplate>
		);
	}
}