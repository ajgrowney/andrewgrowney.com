import React, { Component } from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Image from 'react-bootstrap/Image'
import pro_pic from '../../../Images/pro_pic.jpg'
import '../css/Intro.css'
import 'bootstrap/dist/css/bootstrap.css'

class Intro extends Component{
    render(){
        return(
            <Jumbotron bg="dark" id="intro_id" className="jumboIntro">
                <div className="intro_title">
                    <h3>Hello World! My name is</h3>
                    <h1>Andrew Growney</h1>
                </div>
                <div className="intro_subtitle">
                    I am a Software Engineer for Atonix Digital in Denver, CO and recent graduate from the University of Kansas.
                    <br />
                    With a passion for faith, music, coffee, college basketball, and people in general, feel free to reach out about anything or everything! 
                </div>
                <div className="intro_image">
                    <Image className="intro_imageObject" src={pro_pic} alt="profile picture" roundedCircle />
                </div>
            </Jumbotron>
        )
    }
}

export default Intro;