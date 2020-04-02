import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import Nav from '../Components/js/Nav'
import project_data from '../Data/Homepage/projectData'
import './css/projectPage.css'
import { Header, Sections } from '../Components/Homepage/js'
const featured_index = 4

class NormalProject extends Component {
  constructor(props) {
    super(props)
    this.project = props.project
  }

  render = () =>
    <div id={"project_"+this.project.id.toString()} className="projectContainer">
      <h3>{this.project.title}</h3>
      <h6>{this.project.time}</h6>
      <hr />
      {this.project.languages.join(', ')}
    </div>
}

class ProjectSearchBar extends Component {
    render(){
      return(
        <Navbar>
          <Navbar.Brand>Projects</Navbar.Brand>
          <Form inline className="projectNavbar">
            <Form.Control placeholder='Search'></Form.Control>
            <Button variant="outline-primary">Submit</Button>
          </Form>
        </Navbar>
      )
    }
}

class ProjectHome extends Component {
  constructor(props) {
    super(props);
    this.AllProjects = project_data
    this.FeaturedProject = project_data.find((proj) => proj.id === featured_index)

    this.pageLinks = [
      { text: "Current Projects", element: "currentproj_id" },
      { text: "Previous Projects", element: "previousproj_id" }
    ]
    this.headerContent = {
      titleContent: [
          <div className="featuredProjectHeader">
            <h4>Featured Project:</h4>
            <h2>{this.FeaturedProject.title}</h2>
          </div>
      ],
      subtitleContent: [
        <div className="featuredProjectDescription">
          {this.FeaturedProject.description}
        </div>
      ],
      imageContent: this.FeaturedProject.images
    }
    this.sections = [
      { id: "currentproj_id", title: "Current Projects", content: <div> {this.AllProjects.filter(x => x.time.includes("Present")).map(p => <NormalProject project={p} />)} </div> },
      { id: "previousproj_id", title: "Previous Projects", content: <div>{this.AllProjects.filter(x => !x.time.includes("Present")).map(p => <NormalProject project={p} />)}</div> }
    ]
  }


  render = () => {

    return (
      <div className="root">
        <Nav page="projectHome" pageLinks={this.pageLinks} />
        <Header content={this.headerContent} />
        {/* <ProjectSearchBar /> */}
        <Sections sectionsList={this.sections} />
        <hr />
        

      </div>
    )
  }
}

export default ProjectHome;
