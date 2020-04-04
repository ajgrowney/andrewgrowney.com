import React, { Component } from 'react'
import { MdFolderOpen } from 'react-icons/md'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import '../css/projects.css'
import 'bootstrap/dist/css/bootstrap.css'
import Button from 'react-bootstrap/Button';

class ProjectCard extends Component{
    render()
    {
        const card_project = this.props.project;
        return(
            <Card className="projectCardContainer">
                <div className="projectCardHeader">
                    <div>
                        <Card.Title className="projectTitle">{card_project.title}</Card.Title>
                        <Card.Subtitle className="projectSubtitle">{card_project.time}</Card.Subtitle>
                    </div>
                </div>
                <Card.Body className="projectCardSummaryContainer">
                    {card_project.summary}
                    <br /><br />
                    <Button className="viewProjectButton" onClick={() => window.location.href = card_project.url}>View Project Details</Button>
                    <hr />
                    {card_project.languages.join(', ')}
                </Card.Body>
            </Card>
        )
    }
    
}

class ProjectColumn extends Component{
    render()
    {
        const column_projects = this.props.column
        return(
            <CardColumns className="projectCardColumn">
                {column_projects.map((project) => <ProjectCard project={project} />)}
            </CardColumns>
        )
    }
}

class Projects extends Component{
    constructor(props)
    {
        super(props);
        this.projects_per_column = props.projectPerColumn || 3
        this.projects = props.projects || []

    }


    render(){
        const project_cols = [];
        while(this.projects.length > 0){
            project_cols.push(this.projects.splice(0,this.projects_per_column))
        }

        return(
            <div className="projectColumnContainer">
                {project_cols.map((c) =>  <ProjectColumn column={c}/>)}
            </div>
        )
    }
}

export default Projects;
