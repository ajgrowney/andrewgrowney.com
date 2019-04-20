import React, { Component } from 'react';
import ReactGA from 'react-ga';
import MyNav from '../Components/js/Nav'
import Intro from '../Components/js/Intro'
import Chapters from '../Components/js/Chapters'

import './css/home.css';

function initializeReactGA() {
    ReactGA.pageview('/homepage');
}

class Home extends Component {
    constructor(props){
        super(props);
        initializeReactGA()
    }
    render(){
        return(
            <div id="app_container">
                <MyNav />
                <Intro />
                <Chapters />
            </div>
        )
    }
}

export default Home;