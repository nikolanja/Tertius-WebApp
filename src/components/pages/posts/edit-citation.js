import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import Gap from '../../gap/gap';
import TButton from '../../buttons/tbutton/tbutton';
import './post.scss';

import fire from '../../../config/config';

export default class EditCitation extends Component {
	constructor(props) {
        super(props);
        this.state = {
			post: JSON.parse(window.localStorage.getItem('single-post'))
        }
	}

	saveCitation () {
		var userid = this.state.post.Userid;
		var postkey = this.state.post.Key;

		var updates = {};
		updates["Posts/" + userid + "/" + postkey + "/Resources/PubTitle"] = document.getElementById('pubtitle').value;
		updates["Posts/" + userid + "/" + postkey + "/Resources/Author"] = document.getElementById('author').value;
		updates["Posts/" + userid + "/" + postkey + "/Resources/CoAuthor"] = document.getElementById('coauthor').value;
		updates["Posts/" + userid + "/" + postkey + "/Resources/PageNumber"] = document.getElementById('pagenumber').value;
		fire.database().ref().update(updates);
		window.location.href = '/post?key=' + postkey;
	}

	calcelCitation () {
		window.history.back();
	}

	render () {
		return (
			<DefaultTemplate headerType="edit-type">
				<div className="page-container edit-citation" align="left">
					<Gap hei="3" />
					<div className="content">

						<div className="citation">
							<input type="text" id="pubtitle" defaultValue={this.state.post.Publication} placeholder="Publication"/>
						</div>

						<div className="citation">
							<input type="text" id="author" defaultValue={this.state.post.Author} placeholder="Author"/>
						</div>

						<div className="citation">
							<input type="text" id="coauthor" defaultValue={this.state.post.CoAuthor} placeholder="Co-author"/>
						</div>

						<div className="citation">
							<input type="text" id="pagenumber" defaultValue={this.state.post.PageNumber} placeholder="PageNumber"/>
						</div>

						<div className="actions">
							<TButton btntype="btnframe btn-green" rpad="18" lpad="18" clickEvent={this.saveCitation.bind(this)}>Save</TButton>
							<TButton btntype="btnnoframe btn-gray" rpad="16" lpad="16" clickEvent={this.calcelCitation.bind(this)}>Cancel</TButton>
						</div>
					</div>
				</div>
			</DefaultTemplate>
		);
	}
}