import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./components/pages/home/home";

import Signin from "./components/pages/sign/signin";
import Start from "./components/pages/sign/start";
import EmailSignin from "./components/pages/sign/email-signin";
import SigninEmail from "./components/pages/sign/signin-email";

import EmailSignup from "./components/pages/sign/email-signup";
import SignupEmail from "./components/pages/sign/signup-email";

import Search from "./components/pages/search/search";
import Filter from "./components/pages/filter/filter";

import Payment from "./components/pages/payment/payment";

import PostList from "./components/pages/posts/postlist";
import Post from "./components/pages/posts/post";
import EditTitleExcerpt from "./components/pages/posts/edit-title-excerpt";
import EditTags from "./components/pages/posts/edit-tags";
import EditComment from "./components/pages/posts/edit-comment";
import EditCitation from "./components/pages/posts/edit-citation";
import Settings from "./components/pages/settings/settings";
import Welcome from "./components/pages/welcome";

import TermsOfService from "./components/pages/terms-of-service/terms-of-service";
import PrivacyPolicy from "./components/pages/privacy-policy/privacy-policy";
import './App.scss';

class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path = "/" component = {Home}/>
                    <Route exact path = "/home" component = {Home}/>
                    <Route exact path = "/terms" component = {TermsOfService}/>
                    <Route exact path = "/privacy" component = {PrivacyPolicy}/>

                    <Route exact path = "/signin" component = {Signin}/>
                    <Route exact path = "/start" component = {Start}/>
                    <Route exact path = "/email-signin" component = {EmailSignin}/>
                    <Route exact path = "/signin-email" component = {SigninEmail}/>
                    <Route exact path = "/email-signup" component = {EmailSignup}/>
                    <Route exact path = "/signup-email" component = {SignupEmail}/>

                    <Route exact path = "/payment" component = {Payment}/>

                    <Route exact path = "/search" component = {Search}/>
                    <Route exact path = "/filter" component = {Filter}/>
                    <Route exact path = "/posts" component = {PostList}/>
                    <Route exact path = "/post" component = {Post}/>
                    <Route exact path = "/edit-title-excerpt" component = {EditTitleExcerpt}/>
                    <Route exact path = "/edit-tags" component = {EditTags}/>
                    <Route exact path = "/edit-comment" component = {EditComment}/>
                    <Route exact path = "/edit-citation" component = {EditCitation}/>
                    <Route exact path = "/settings" component = {Settings}/>
                    <Route exact path = "/welcome" component = {Welcome}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
