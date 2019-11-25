import React, { Component } from 'react';
import ReactGA from 'react-ga';
import MyNav from '../Components/js/Nav';
import { Intro , Sections } from '../Components/Homepage/js/'

import './css/homepage.css';

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
                <MyNav page="Home"/>
                <Intro />
                <Sections />
            </div>
        )
    }
}

export default Home;
