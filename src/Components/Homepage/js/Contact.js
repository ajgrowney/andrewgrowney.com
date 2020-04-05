import React from 'react'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/contact.css'

let sendEmail = (email) => {
    window.location = "mailto:"+email+"?subject=How's It Going?!"
}


function Contact(props){
    
    const { email } = props
    const emailButtonText = props.emailButtonText || "Email Me"
    const socialData = props.socialData
    const socialLinks = socialData.map((social) => <a href={social.href}> <img src={social.src} alt={social.alt} /> </a>)

    return (
        <div className="contactContainer">
            <Button id="emailButton" onClick={() => sendEmail(email)}>
                { emailButtonText }
            </Button>
            <br />
            If you want to keep up-to-date with what is going on, make sure to check in regularly!
            <br />
            <br />
            <div className="socialMedia">
                {socialLinks}
            </div>
        </div>
    )
}

export default Contact;
