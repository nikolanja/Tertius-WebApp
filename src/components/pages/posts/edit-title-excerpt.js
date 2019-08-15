import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import Gap from '../../gap/gap';
import TButton from '../../buttons/tbutton/tbutton';
import fire from '../../../config/config';
import TextareaAutosize from 'react-autosize-textarea';

import './post.scss';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import 'font-awesome/css/font-awesome.css'
import Editor from 'react-medium-editor';

class EditTitleExcerpt extends Component {
	constructor(props) {
		super(props);
		
		var editPost = JSON.parse(window.localStorage.getItem('single-post'));
		
		if (editPost.Content.startsWith('<p>') === false){
			editPost.Content = '<p>' + editPost.Content + '</p>';
		}
		//editPost.Content = editPost.Content.replace(/\n/g, '</p><p>');
        this.state = {
			model : editPost.Content,
			post: editPost
        }
	}

	componentDidMount() {
		this.textarea_title.focus();
		var titlearea = document.getElementById('post-title');
		titlearea.addEventListener('keypress', this.onPreventPressEnter);
	}

	onPreventPressEnter(event) {
		if(event.keyCode === 13) {
			event.preventDefault();
		}
	}

	saveTitleExcerpt () {
		var userid = this.state.post.Userid;
		var postkey = this.state.post.Key;
		var content = this.state.model.replace("<a href=", "<a  target=\"_blank\" rel=\"noopener noreferrer\" href=");

		var updates = {};
		updates["Posts/" + userid + "/" + postkey + "/Title"] = document.getElementById('post-title').value;
		updates["Posts/" + userid + "/" + postkey + "/Content"] = content;
		fire.database().ref().update(updates);
		window.location.href = '/post?key=' + postkey;
	}

	cancelTitleExcerpt () {
		window.history.back();
	}

	handleChange = (text, medium) => {
		this.setState({model: text});
	}

	render () {
		var handleChange = this.handleChange;
		return (
			<DefaultTemplate headerType="edit-type" pageType="edit-title-excerpt-type">
				<div className="page-container edit-title-excerpt" align="left">
					<Gap hei="3" />
					<div className="content">
						<div className="post-actions" align="right">
							<div className="buttons">
								<TButton btntype="btnnoframe btn-gray" rpad="20" lpad="18" clickEvent={this.cancelTitleExcerpt.bind(this)}>Cancel</TButton>
								<TButton btntype="btnframe btn-green" rpad="14" lpad="12" clickEvent={this.saveTitleExcerpt.bind(this)}>Save and close</TButton>
							</div>
						</div>
						<div className="post-title">
							<TextareaAutosize id="post-title" defaultValue={this.state.post.Title} innerRef={c => (this.textarea_title = c)}/>
						</div>
						<div className="post-excerpt">
							<p className="excerpt-para">
								<Editor style={{ outline: 'dotted 1px', padding: 10 }}
									text={this.state.model} 
									onChange={handleChange}
									options={{buttonLabels: 'fontawesome',toolbar: {buttons: ['bold', 'italic', 'anchor', 'h2', 'h3', 'quote']}}}/>
							</p>
						</div>
					</div>
				</div>
			</DefaultTemplate>
		);
	}
}

export default EditTitleExcerpt