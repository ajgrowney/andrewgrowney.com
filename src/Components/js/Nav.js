import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'gatsby'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/nav.css'

function GetNavsToDisplay(nav_sets)
{
  return nav_sets.map(navSet => {
    if(navSet.type === "Dropdown")
    {
      return(
        <NavDropdown key={navSet.title} title={navSet.title} className={(navSet.active)? "active": ""}>{
          navSet.links.map((link) =>
              <NavDropdown.Item key={link.text}
                className={"navLink"}
                onClick={() => document.getElementById(link.element).scrollIntoView({ behavior: "smooth" })}
              >
                {link.text}
              </NavDropdown.Item>
          )}
        </NavDropdown>
      )
    } else if (navSet.type === "SingleLink") {
      return(
        <Nav.Item key={navSet.title} className={(navSet.active) ? "active": ""}>
            <Link to={navSet.pageRef} key={navSet.title} className="nav-link" href={navSet.pageRef}>
              {navSet.title}
            </Link>
        </Nav.Item>
      )
    } else {
      return(<Nav.Item />)
    }
  });
}

function MyNav(props){

    let navContent = props.navContent
    let navbarBrand = "AG"
    let displayNavs = GetNavsToDisplay(navContent);
    return (
      <Navbar bg="dark" variant="dark" style={{height: "7dvh"}}>
        <Navbar.Brand href="/">{navbarBrand}</Navbar.Brand>
        <Nav className="justify-content-end" >
          {displayNavs}
        </Nav>
      </Navbar>
    )
  
}

export default MyNav;
