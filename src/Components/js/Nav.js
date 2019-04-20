import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/nav.css'

class MyNav extends Component{
    constructor(props){
      super(props);
      this.page = props.page
    }
    render(){
        if(this.page === "Home"){
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
        }else if(this.page === "projectHome"){
          return(
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="#home">AG</Navbar.Brand>
              <Nav className="justify-content-end" >
                <Nav.Item>
                  <Nav.Link onClick={()=> window.location.href='/'}>Home</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar>
          )
        }
    }
}

export default MyNav;
