import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import '../css/projects.css'
import 'bootstrap/dist/css/bootstrap.css'

function ProjectCard(props){
    const { project } = props;
    return(
        <Card className="projectCardContainer">
            <div className="projectCardHeader">
                <Card.Title className="projectTitle">{project.title}</Card.Title>
                <Card.Subtitle className="projectSubtitle">{project.time}</Card.Subtitle>
            </div>
            <Card.Body className="projectCardSummaryContainer">
                {project.summary}
                <br /><br />
                {(project.visibility === "public") ?
                    <Button className={"viewProjectButton"}
                        onClick={() => window.location.href = project.url}
                    >
                    View Project Details
                    </Button>
                    :
                    <Button className={"viewProjectButton"}
                        onClick={() => window.location = "mailto:ajgrowney@gmail.com?subject=Access request for project "+project.title}
                    >
                        Request Project Details
                    </Button>
                }
                <hr />
                {project.languages.join(', ')}
            </Card.Body>
        </Card>
        )
}


function ProjectColumn(props){
    const projectColumn = props.column
    const projectCardComponents = projectColumn.map((project) => <ProjectCard key={project.id} project={project} />)

    return(
        <CardGroup className="projectCardColumn">
            {projectCardComponents}
        </CardGroup>
    )
}

function ProjectsSection(props){
    let projects_per_column = props.projectPerColumn || 3
    let projects = props.projects || []
    const project_cols = [];
    
    while(projects.length > 0){
        project_cols.push(projects.splice(0, projects_per_column))
    }
    let projectColumnComponents = project_cols.map((c, idx) =>  <ProjectColumn key={idx} column={c}/>)

    return(
        <div className="projectColumnContainer">
            {projectColumnComponents}
        </div>
    )
    
}

export default ProjectsSection;
