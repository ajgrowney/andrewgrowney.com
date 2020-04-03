import React, { Component } from 'react'
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import '../css/about.css'
import 'bootstrap/dist/css/bootstrap.css'

class SkillsCard extends Component {
    render() {
        const { skill } = this.props;
        return (
            <Card className="skillsCard" style={{ "text-align": "center" }}>
                <Card.Header> {skill.icon}<br />{skill.header}</Card.Header>
                <Card.Body> {skill.list.join(', ')} </Card.Body>
            </Card>
        )
    }
}

class About extends Component {
    constructor(props) {
        super(props);
        this.aboutText = props.aboutText || ""
        this.skills = props.skills || []
    }

    render() {
        return (
            <div className="aboutContainer">
                <div className="aboutTextContainer"> {this.aboutText} </div>
                <CardGroup className="skillsCardsContainer">
                    {this.skills.map((skill) => <SkillsCard skill={skill} />)}
                </CardGroup>
            </div>
        )
    }
}

export default About;