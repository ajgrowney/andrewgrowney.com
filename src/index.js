import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ProjectPageView, ProjectHomeView, HomepageView, BlogHomeView, BlogPageView } from './Views'
import * as serviceWorker from './serviceWorker';
import NotFoundView from './Views/NotFoundView';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={HomepageView} />
            {/* <Route path="/inThePen" component={InThePen} /> */}
            <Route path="/projects" component={ProjectHomeView} />
            <Route exact path="/blogs" component={BlogHomeView} />
            <Route path="/projects/:projectId" component={ProjectPageView} />
            <Route path="/blogs/:blogId" component={BlogPageView} />
            <Route component={NotFoundView} />
        </Switch>
    </Router>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();