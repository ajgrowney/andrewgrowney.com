import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Views/Home';
import InThePen from './Views/inThePen';
import ProjectHome from './Views/projects'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/inThePen" component={InThePen} />
            <Route path="/projects" component={ProjectHome} />

        </Switch>
    </Router>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();