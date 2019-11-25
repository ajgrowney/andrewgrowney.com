import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel'
import Form from 'react-bootstrap/Form'

import Nav from '../Components/js/Nav'
import project_data from '../Data/Homepage/projectData'
import './css/projects.css'
const featured_index = 4

class FeaturedProject extends Component{
    constructor(props){
        super(props)
    }
    render = () =>
        <div className="featuredProjectContainer">
            <div className="featuredProjectHeader">
              <h4>Featured Project:</h4>
              <h2>{this.props.project.title}</h2>
            </div>
            <div className="featuredProjectDescription">
                {this.props.project.description}
            </div>
            <Carousel className="featuredProjectImages">
              {this.props.project.images.map((im) => <div className='carousel-inner'><img className="projectImage" src={im} /></div>)}
            </Carousel>
        </div>
}

class NormalProject extends Component{
    constructor(props){
      super(props)
      this.project = props.project
    }

    render = () =>
      <div className="projectContainer">
        <h3>{this.project.title}</h3>
        <h6>{this.project.time}</h6>
        <hr />
        {this.project.languages.join(', ')}
      </div>
}

class ProjectHome extends Component{
    constructor(props){
        super(props);
        this.project_data = project_data
        this.FeaturedProject = project_data.find((proj) => proj.id === featured_index)
        this.OtherProjects = project_data.filter((proj) => proj.id !== featured_index)
    }


    render = () => {

      return(
            <div className="root">
            <Nav page="projectHome" />
                <FeaturedProject project={this.FeaturedProject}/>

                <Navbar>
                    <Navbar.Brand>Projects</Navbar.Brand>
                    <Form inline className="projectNavbar">
                        <Form.Control placeholder='Search'></Form.Control>
                        <Button variant="outline-primary">Submit</Button>
                    </Form>
                </Navbar>
                <hr />
                {this.OtherProjects.map(p => <NormalProject project={p} />)}

            </div>
        )
    }
}

export default ProjectHome;
