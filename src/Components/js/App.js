import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ProjectPageView, ProjectHomeView, HomepageView, BlogHomeView, BlogPageView } from '../Views'
import NotFoundView from '../Views/NotFoundView';

const App = () => {
    return (
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
    )
}
export default App