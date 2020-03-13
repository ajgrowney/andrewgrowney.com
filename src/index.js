import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomepageView from './Views/Homepage';
import InThePen from './Views/inThePen';
import MarchMadness from './Views/marchMadness';
import ProjectHome from './Views/projects';
import * as serviceWorker from './serviceWorker';
import { BracketApp } from './Components/MarchMadness/js';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={HomepageView} />
            <Route path="/inThePen" component={InThePen} />
            <Route path="/projects" component={ProjectHome} />
            <Route path="/mm2020/espn" component={(props) => <BracketApp type="espn" {...props} />} />
            <Route path="/mm2020/custom" component={(props) => <BracketApp type="custom" {...props} />} />
            <Route path="/mm2020" component={(props) => <MarchMadness page="welcome" {...props} />} />
        </Switch>
    </Router>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();