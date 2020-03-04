import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/nav.css'

// SectionLinks: Sections of the page and their html element id to navigate to
let SectionLinks = [
  { text: "About", element: "about_id" },
  { text: "Work", element: "work_id" },
  { text: "Projects", element: "project_id" },
  { text: "Contact", element: "contact_id" }
]

class MyNav extends Component {
  constructor(props) {
    super(props);
    this.page = props.page
  }
  render() {
    if (this.page === "Home") {
      return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">AG</Navbar.Brand>
          <Nav className="justify-content-end" >
            {SectionLinks.map((link) =>
              <Nav.Item key={link.text}>
                <Nav.Link key={link.text} className="navLink" onClick={() => document.getElementById(link.element).scrollIntoView({ behavior: "smooth" })} >
                  {link.text}
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar>
      )
    } else if (this.page === "projectHome") {
      return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">AG</Navbar.Brand>
          <Nav className="justify-content-end" >
            <Nav.Item>
              <Nav.Link onClick={() => window.location.href = '/'}>Home</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      )
    }
  }
}

export default MyNav;
