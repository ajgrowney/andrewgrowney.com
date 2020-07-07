import React from 'react'
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import '../css/about.css'
import 'bootstrap/dist/css/bootstrap.css'

function SkillsCard(props){
    const { skill } = props;
    return (
        <Card className="skillsCard" style={{ "text-align": "center" }}>
            <Card.Header> {skill.icon}<br />{skill.domain}</Card.Header>
            <Card.Body> {skill.list.join(', ')} </Card.Body>
        </Card>
    )
}

function AboutSection(props){
    const aboutText = props.aboutText || ""
    const skills = props.skills || []
    const skillsCardComponents = skills.map((skill) => <SkillsCard skill={skill} />)
    return (
        <div className="aboutContainer">
            <div className="aboutTextContainer"> {aboutText} </div>
            <CardGroup className="skillsCardsContainer">
                {skillsCardComponents}
            </CardGroup>
        </div>
    )
}

export default AboutSection;