import React, { Component } from 'react';
import TButton from '../../buttons/tbutton/tbutton';
import PageFooter from '../../footer/page-footer';
import Gap from '../../gap/gap';
import TIcon from '../../icon-svg/icon-svg';

//  load images //////
import logo from '../../../assets/images/home-logo.png';
import hero from '../../../assets/images/hero.png';
import appstorebadge from '../../../assets/images/app-store-badge.png';
import fire, { defaultSignedUrl } from '../../../config/config';
import './home.scss';

class Home extends Component {

  constructor () {
		super();
		this.state = {
      signed: false,
      small: false,
		}
	}

	componentWillMount () {
		fire.auth().onAuthStateChanged(user => {
			if (user) {
			  this.setState({
				  signed: true
			  });
			} else {
			  this.setState({
				  signed: false
			  });
			}
		});
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

  signin () {
    window.location.href = "/signin";
  }

  start () {
    window.location.href = "/start";
  }

  getStarted () {
    // window.location.href = defaultSignedUrl;
  }

  myArchive() {
    window.location.href = defaultSignedUrl;
  }

  onTryFree() {
    window.location.href = "/start";
  }

  render() {
    return (
      <div className="main-container main-back home-screen" align="center">
        <div className="content-container">
          <div className="header">
              <div className="header-logo" align="left">
                <img src={logo} className="logo" alt="logo"/>
              </div>
              <div className="header-action" align="right">
              {
                this.state.signed ? ( null ) : (
                  <TButton btntype="btnnoframe btn-black" lpad="20" rpad="20" clickEvent={this.signin.bind(this)}>Sign in</TButton>
                )
              }
              {
                this.state.signed ? ( 
                  <TButton btntype="btnframe btn-green" lpad="23" rpad="24" clickEvent={this.myArchive.bind(this)}>My archive</TButton>
                 ) : (
                  <TButton btntype="btnframe btn-green" lpad="23" rpad="24" clickEvent={this.start.bind(this)}>Get Started</TButton>
                )
              }
              </div>
          </div>
          
          <div className="cover-section" align="center">
            <div className="subscription" align="left">
              <div className="subscription-title">Capture your favorite literary moments</div>
              <div className="subscription-content">
                <p>Become a Tertius member for <span>$5/month</span> or <span>$50/year</span> to capture and organize the best excerpts from the books you read.</p>
                <div className="btn-try">
                  <button type="button" onClick={this.onTryFree.bind(this)}>Try it free for a month</button>
                </div>
              </div>
            </div>
            <div className="home-logo">
              <img src={hero} className="hero-img" alt="hero" />
            </div>
            <div className="vertical-line"></div>
          </div>
        </div>

        <div className="about-section">
          <div className="content-container">
            <div className="about-box" align="left">
              <div className="content">
                <span className="title"> about</span>
                <Gap hei="27"></Gap>
                <p>When a good book whispers, “remember this” Tertius helps you capture, collect and organize a noteworthy excerpt, assign authorship, cite page numbers, and use tags to create relationships between posts.</p>
                <a href="https://itunes.apple.com/us/app/tertius-read-capture-grow/id1441909218?ls=1&mt=8" target="_blank" rel="noopener noreferrer">
                  <img src={appstorebadge} className="btn-app-store" alt="App Store" />
                </a>
              </div>
            </div>
            <div className="special-box" align="left">
              <div className="content">
                <div className="special-content">
                  <div className="special-item teachers">
                    <div className="sp-icon">
                      <TIcon icon="edit-3" wid="27" hei="24" fcolor="#aa9c84"/>
                    </div>
                    <div className="content">
                      <span>Writers</span>
                      <p>Track who wrote what where and recall it in an instant without thumbing thru page after page. </p>
                    </div>
                  </div>
                  <div className="line"></div>

                  <div className="special-item writers">
                    <div className="sp-icon">
                      <TIcon icon="mic" wid="27" hei="24" fcolor="#aa9c84"/>
                    </div>
                    <div className="content">
                      <span>Teachers</span>
                      <p>Curate content for a future sermon, lecture or talk while you’re reading and fresh ideas are flowing.</p>
                    </div>
                  </div>

                  <div className="line"></div>
                  <div className="special-item academics">
                    <div className="sp-icon">
                      <TIcon icon="study" wid="27" hei="24" fcolor="#aa9c84"/>
                    </div>
                    <div className="content">
                      <span>Learners</span>
                      <p>Experience the satisfaction of having access to the information you’ve deemed to be most meaningful.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PageFooter></PageFooter>
      </div>
    );
  }
}

export default Home;