import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/nav.css'

class MyNav extends Component{
    render(){
        return(
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">AG</Navbar.Brand>
                <Nav className="justify-content-end" >
                    <Nav.Item>
                        <Nav.Link className="navLink" onClick={() => document.getElementById('about_id').scrollIntoView({behavior: "smooth"})}>
                            About
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="navLink" onClick={() => document.getElementById('work_id').scrollIntoView({behavior: "smooth"})}>
                            Work
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="navLink" onClick={() => document.getElementById('project_id').scrollIntoView({behavior: "smooth"})}>
                            Projects
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link className="navLink" onClick={() => document.getElementById('contact_id').scrollIntoView({behavior: "smooth"})}>
                            Contact
                        </Nav.Link>
                    </Nav.Item>

                </Nav>
            </Navbar>
        )
    }
}

export default MyNav;