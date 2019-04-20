import React, { Component } from 'react'
import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'
import {FaCode, FaCog, FaDatabase} from 'react-icons/fa'
import '../css/about.css'
import 'bootstrap/dist/css/bootstrap.css'

let aboutText = "Although I am a software engineer, I very much prefer to consider myself a critical thinker. I work on projects to help out friends, push my skills and abilities, expand my horizons, and have a lot of fun. My main software passion is creating technology for music artists and producers. As I have encountered different problems, I have had to pick up new languages, learn new technologies, and study everything from data structures to algorithms to quantum mechanics. My experience has given me skills in, but not limited to these."
let skillsCards = [
    {
        header: "Backend Skills",
        icon: <FaCog className="skillsIcon" size= "4em" />,
        list: [
            "C++",
            "Python",
            "SQL",
            "AWS Lambda",
            "AWS Route 53",
            "AWS S3",
            "Google Firebase",
            "Haskell",
            "C",
            "Node.js",
            "Linux"
        ]
    },
    {
        header: "Frontend Skills",
        icon: <FaCode className="skillsIcon" size="4em" />,
        list:[
            "Javascript (ECMAScript 6)",
            "React.js",
            "Bootstrap",
            "HTML5 & CSS3",
            "Electron.js"
        ]
    },
    {
        header: "Data Science",
        icon: <FaDatabase className="skillsIcon" size="4em" />,
        list: [
            "Pandas",
            "Numpy",
            "Scikit Learn",
            "Computer Vision",
            "OpenCV"
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