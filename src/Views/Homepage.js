import React, { Component } from 'react';
import ReactGA from 'react-ga';
import MyNav from '../Components/js/Nav';
import { About, Contact, Header, Projects, Sections, Work } from '../Components/Homepage/js/'
import pro_pic from '../Images/pro_pic.jpg'
import './css/homepage.css';

function initializeReactGA() {
    ReactGA.pageview('/homepage');
}

class Home extends Component {
    constructor(props) {
        super(props);
        initializeReactGA()
    }

    render() {

        let pageLinks = [
            { text: "About", element: "about_id" },
            { text: "Work", element: "work_id" },
            { text: "Projects", element: "project_id" },
            { text: "Contact", element: "contact_id" }
        ]
        let headerContent = {
            titleContent: [
                <h3>Hello World! My name is</h3>,
                <h1>Andrew Growney</h1>
            ],
            subtitleContent: [
                "I am a Software Engineer on the Platform Team for Atonix Digital in Denver, CO and recent graduate from the University of Kansas.",
                <br />,
                "With a passion for people, faith, music, coffee, college basketball, and software design, feel free to reach out about anything or everything!"
            ],
            imageContent: [pro_pic]
        }
        let sectionsList = [
            { title: "About", content: <About />, id: "about_id" },
            { title: "Work", content: <Work />, id: "work_id" },
            { title: "Projects", content: <Projects />, id: "project_id" },
            { title: "Let's Chat", content: <Contact />, id: "contact_id" }
        ]
        return (
            <div id="app_container">
                <MyNav page="Home" pageLinks={pageLinks} />
                <Header content={headerContent} />
                <Sections sectionsList={sectionsList} />
            </div>
        )
    }
}

export default Home;
