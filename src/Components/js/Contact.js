import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import githubPhoto from '../../Images/github.png'
import linkedinPhoto from '../../Images/linkedin.png'
import hackerrankPhoto from '../../Images/hackerrank-logo.png'

import '../css/contact.css'
import 'bootstrap/dist/css/bootstrap.css'

let sendEmail = () => {
    window.location="mailto:ajgrowney@gmail.com?subject=How's It Going Andrew?"
}

class Contact extends Component{
    render(){
        return(
            <div className="contactContainer">
                <Button id="emailButton" onClick={() => sendEmail()}>
                    Email Me!
                </Button>
                <br />
                If you want to keep up-to-date with what is going on, make sure to check in regularly!
                <br />
                <br />
                <div className="socialMedia">
                    <a href="https://github.com/ajgrowney">
                        <img src={githubPhoto} />
                    </a>
                    <a href="https://www.linkedin.com/in/andrewgrowney/">
                        <img src={linkedinPhoto} />
                    </a>
                    <a href="https://www.hackerrank.com/ajgrowney">
                        <img src={hackerrankPhoto} />
                    </a>
                </div>
            </div>
        )
    }
}

export default Contact;