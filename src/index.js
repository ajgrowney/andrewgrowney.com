import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomepageView from './Views/HomepageView';
import BlogHomeView from './Views/BlogHomeView';
import ProjectHomeView from './Views/ProjectPageView';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={HomepageView} />
            {/* <Route path="/inThePen" component={InThePen} /> */}
            <Route path="/projects/:projectId?" component={ProjectHomeView} />
            <Route path="/blogs/:blogId?" component={BlogHomeView} />
        </Switch>
    </Router>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();