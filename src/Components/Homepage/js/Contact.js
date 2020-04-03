import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import '../css/contact.css'
import 'bootstrap/dist/css/bootstrap.css'

let sendEmail = (email) => {
    window.location = "mailto:"+email+"?subject=How's It Going?!"
}


class Contact extends Component {
    constructor(props)
    {
        super(props);
        this.email = props.email
        this.emailButtonText = props.emailButtonText || "Email Me"
        this.socialData = props.socialData
    }
    render() {
        return (
            <div className="contactContainer">
                <Button id="emailButton" onClick={() => sendEmail(this.email)}>
                    { this.emailButtonText }
                </Button>
                <br />
                If you want to keep up-to-date with what is going on, make sure to check in regularly!
                <br />
                <br />
                <div className="socialMedia">
                    {this.socialData.map((social) =>
                        <a href={social.href}>
                            <img src={social.src} alt={social.alt} />
                        </a>
                    )}
                </div>
            </div>
        )
    }
}

export default Contact;
