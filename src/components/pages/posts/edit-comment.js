import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import Gap from '../../gap/gap';
import TButton from '../../buttons/tbutton/tbutton';
import autosize from "autosize";
import './post.scss';

import fire from '../../../config/config';


class EditComment extends Component {

	constructor(props){
		super(props)

		this.state = {
			post: JSON.parse(window.localStorage.getItem('single-post'))
		}
	}
	
	componentDidMount() {
	    this.textarea.focus();
		autosize(this.textarea);
	}

	saveComment () {
		var userid = this.state.post.Userid;
		var postkey = this.state.post.Key;

		var updates = {};
		updates["Posts/" + userid + "/" + postkey + "/Comment"] = document.getElementById('post-comment').value;
		fire.database().ref().update(updates);
		window.location.href = '/post?key=' + postkey;
	}

	cancelComment () {
		window.history.back();
	}
	
	render () {
		return (
			<DefaultTemplate headerType="edit-type">
				<div className="page-container edit-comment" align="left">
					<Gap hei="3" />
					<div className="content">
						<textarea id="post-comment" defaultValue={this.state.post.Comment} ref={c => (this.textarea = c)}/>
						<div className="actions">
							<TButton btntype="btnframe btn-green" rpad="18" lpad="18" clickEvent={this.saveComment.bind(this)}>Save</TButton>
							<TButton btntype="btnnoframe btn-gray" rpad="16" lpad="16" clickEvent={this.cancelComment.bind(this)}>Cancel</TButton>
						</div>
					</div>
				</div>
			</DefaultTemplate>
		);
	}
}

export default EditComment
