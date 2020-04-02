import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/nav.css'

class MyNav extends Component {
  constructor(props) {
    super(props);
    this.page = props.page
    this.anchorLinks = props.pageLinks
    this.navbarBrand = "AG"
  }
  render() {
      return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">{this.navbarBrand}</Navbar.Brand>
          <Nav className="justify-content-end" >
            {this.anchorLinks.map((link) =>
              <Nav.Item key={link.text}>
                <Nav.Link key={link.text} className="navLink" onClick={() => document.getElementById(link.element).scrollIntoView({ behavior: "smooth" })} >
                  {link.text}
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar>
      )
  }
}

export default MyNav;
