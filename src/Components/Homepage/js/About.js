import React, { Component } from 'react'
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'
import skills from '../../../Data/Homepage/skillsData'
import '../css/about.css'
import 'bootstrap/dist/css/bootstrap.css'

// aboutText: Thoughts of being a Software Engineer 
let aboutText = "Working towards the title critical thinker before Software Engineer. I work on projects to help out friends, push my skills and abilities, expand my horizons, and have a lot of fun. " +
    "After starting my career as a Software Engineer, I try to work with quality design and documentation at the forefront of each project I work on. " +
    "My main software passion is creating technology for music artists and producers. As I have encountered different problems, I have had to pick up new languages, learn new technologies, and study everything from data structures to algorithms to quantum mechanics. My experience has given me skills in, but not limited to these."

// skillsCards: Cards to display skills in each stack of software 
let skillsCards = [
    {
        header: "Backend",
        icon: <FaCog className="skillsIcon" size="4em" />,
        list: skills["backend"]
    },
    {
        header: "Data Science",
        icon: <FaDatabase className="skillsIcon" size="4em" />,
        list: skills["data_science"]
    },
    {
        header: "Frontend",
        icon: <FaCode className="skillsIcon" size="4em" />,
        list: skills["frontend"]
    }
]

class About extends Component {
    render() {
        return (
            <div className="aboutContainer">
                <div className="aboutTextContainer"> {aboutText} </div>
                <CardGroup className="skillsCardsContainer">
                    {skillsCards.map((skill) =>
                        <Card className="skillsCard" style={{ "text-align": "center" }}>
                            <Card.Header> {skill.icon}<br />{skill.header}</Card.Header>
                            <Card.Body> {skill.list.join(', ')} </Card.Body>
                        </Card>
                    )}
                </CardGroup>
            </div>
        )
    }
}

export default About;