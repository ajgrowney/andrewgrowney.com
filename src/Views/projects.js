import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import project_data from '../Data/projectData'
import './css/projects.css'
const featured_index = 2

class FeaturedProject extends Component{
    constructor(props){
        super(props)
        console.log(props)
    }
    render = () =>
        <div className="featuredProjectContainer">
            Featured Project: {this.props.project.title}<br />
            <div className="featuredProjectDescription">
                {this.props.project.description}
            </div>
        </div>
}

class ProjectHome extends Component{
    constructor(props){
        super(props);
        console.log(props)
        this.FeaturedProject = project_data[featured_index]
        this.OtherProjects = project_data.filter((proj) => proj !== this.FeaturedProject)
    }

    render = () => {
        return(
            <div>
                <FeaturedProject project={project_data[featured_index]}/>

                <Navbar>
                    <Navbar.Brand>Projects</Navbar.Brand>
                    <Form inline className="float-right">
                        <Form.Control placeholder='Search'></Form.Control>
                        <Button variant="outline-primary">Submit</Button>
                    </Form>
                </Navbar>
                <hr />
                {this.OtherProjects.map(p => <p>{p.title}</p>)}

            </div>
        )
    }
}

export default ProjectHome;