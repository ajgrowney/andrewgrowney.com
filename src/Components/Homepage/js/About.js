import React, { Component } from 'react'
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import {FaCode, FaCog, FaDatabase} from 'react-icons/fa'
import '../css/about.css'
import 'bootstrap/dist/css/bootstrap.css'

let aboutText = "I consider the personal title critical thinker vastly more important than title of Software Engineer. I work on projects to help out friends, push my skills and abilities, expand my horizons, and have a lot of fun. My main software passion is creating technology for music artists and producers. As I have encountered different problems, I have had to pick up new languages, learn new technologies, and study everything from data structures to algorithms to quantum mechanics. My experience has given me skills in, but not limited to these."
let skillsCards = [
    {
        header: "Backend Skills",
        icon: <FaCog className="skillsIcon" size= "4em" />,
        list: [
            "AWS Lambda",
            "C++",
            "C#",
            ".NET Core",
            "AWS API Gateway",
            "REST API Design",
            "AWS S3",
            "AWS Route 53",
            "SQL",
            "Azure DevOps",
            "Azure Pipelines",
            "Google Firebase",
            "Haskell",
            "C",
            "Linux"
        ]
    },
    {
        header: "Data Science",
        icon: <FaDatabase className="skillsIcon" size="4em" />,
        list: [
            "Python",
            "Pandas",
            "Numpy",
            "Scikit Learn",
            "Computer Vision",
            "OpenCV"
        ]
    },
    {
        header: "Frontend Skills",
        icon: <FaCode className="skillsIcon" size="4em" />,
        list:[
            "Javascript (ECMAScript 6)",
            "Node.js",
            "React.js",
            "Bootstrap",
            "HTML5 & CSS3",
            "Electron.js"
        ]
    }
]

class About extends Component{
    render(){
        return(
            <div className="aboutContainer">
                <div className="aboutTextContainer">
                    {aboutText}
                </div>
                <CardGroup className="skillsCardsContainer">
                    {skillsCards.map((sk) =>
                            <Card className="skillsCard"  style={{"text-align": "center"}}>
                                <Card.Header>{sk.icon}<br/>{sk.header}</Card.Header>
                                <Card.Body>
                                    {sk.list.join(', ')}
                                </Card.Body>
                            </Card>
                    )}
                </CardGroup>
            </div>
        )
    }
}

export default About;