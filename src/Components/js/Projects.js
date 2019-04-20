import React, { Component } from 'react'
import { MdFolderOpen } from 'react-icons/md'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import all_projects from '../../Data/projectData'
import '../css/projects.css'
import 'bootstrap/dist/css/bootstrap.css'
import Button from 'react-bootstrap/Button';


class Projects extends Component{

    
    render(){

        const col_size = 3;
        const project_cols = [];
        while(all_projects.length > 0){
            project_cols.push(all_projects.splice(0,col_size))
        }

        return(
            <div>
                {project_cols.map((c) =>
                    <CardColumns className="projectCardColumn">
                        {c.map((p) => 
                            <Card className="projectCardContainer">
                                <div className="projectCardHeader">
                                    <div>
                                        <Card.Title className="projectTitle">{p.title}</Card.Title>
                                        <Card.Subtitle className="projectSubtitle">{p.time}</Card.Subtitle>
                                    </div>
                                    <MdFolderOpen className="projectCardLinkContainer"  onClick={() => window.location.href=p.url} />
                                </div>
                                <Card.Body className="projectCardDescriptionContainer">
                                    {p.description}
                                    <br /><br />
                                    <Button className="viewProjectButton">View Project Details</Button>
                                    <hr />
                                    {p.languages.join(', ')}

                                </Card.Body>
                            </Card>
                        )}
                    </CardColumns>
                )}
            </div>
        )
    }
}

export default Projects;