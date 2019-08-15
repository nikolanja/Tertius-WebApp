import React, { Component } from 'react';
import DefaultTemplate from '../../templates/default';
import appstorebadge from '../../../assets/images/app-store-badge.png';
import './index.scss';

class Welcome extends Component {
    render() {
        return (
            <DefaultTemplate>
                <div className="page-container welcome" align="left">
                    <div className="content">
                        <span className="title">Welcome to Tertius</span>
                        <p className="desc">To get started, download <a href=" https://itunes.apple.com/us/app/tertius-read-capture-grow/id1441909218?ls=1&mt=8" target="_blank" rel="noopener noreferrer">Tertius App</a> (for iPhone) to capture, cite, and tag excerpts from your favorite books. Content you publish on the app will automatically sync across all of your devices so you can be productive on the go, or at your desk.<br /><br />Questions? Feedback? To get help, visit <a href="https://help.tertius.app" target="_blank" rel="noopener noreferrer">https://help.tertius.app</a></p>
                        <a href="https://itunes.apple.com/us/app/tertius-read-capture-grow/id1441909218?ls=1&mt=8" target="_blank" rel="noopener noreferrer">
                            <img src={appstorebadge} className="btn-app-store" alt="App Store" />
                        </a>
                    </div>
                </div>
            </DefaultTemplate>
        )
    }
}

export default Welcome;