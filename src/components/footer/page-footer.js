import React, { Component } from 'react';
import './page-footer.scss';

class PageFooter extends Component {
	constructor() {
		super();

		this.state = {
      small: false,
		}
	}
  
  updateDimensions() {
    if(window.innerWidth < 1032) {
      this.setState({ small: true });
    } else {
      this.setState({ small: false });
    }
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    return (
    	<div className="footer-back" align="center">
    		<div className="content-container">
    			<div className="copyright" align={this.state.small ? ("center") : ("left")}>
    				<span>Copyright © 2019 Tertius. {this.state.small ? (<br/>) : (null)}All rights reserved.</span>
    			</div>
    			<div className="footer-action" align={this.state.small ? ("center") : ("right")}>
    				<span><a href="/privacy">Privacy Policy</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="/terms">Terms of Service</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://help.tertius.app" target="_blank" rel="noopener noreferrer">Help</a></span>
    			</div>
    		</div>
    	</div>
    );
  }
}

export default PageFooter;