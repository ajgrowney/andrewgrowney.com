import React from 'react'
import ReactGA from 'react-ga';
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Section } from '../Components/Homepage/js'
import Summary from '../Components/js/SummaryView'
import project_data from '../Data/projectData'
import './css/projectPage.css'

function initializeReactGA() {
  ReactGA.initialize('UA-136977966-1')
  ReactGA.pageview('/projectPage');
}


function NormalProject(props) {
  const project = props.project
  return (
    <div id={"project_" + project.id.toString()} className="projectContainer">
      <h3>{project.title}</h3>
      <h6>{project.time}</h6>
      <p>{(project.description) ? (project.description) : (project.summary) } </p>
      <hr />
      {project.languages.join(', ')}
    </div>
  )
}

function ProjectSearchBar() {
  return (
    <Navbar>
      <Navbar.Brand>Projects</Navbar.Brand>
      <Form inline className="projectNavbar">
        <Form.Control placeholder='Search'></Form.Control>
        <Button variant="outline-primary">Submit</Button>
      </Form>
    </Navbar>
  )
}

function ProjectHome(props) {
  console.log(props)
  initializeReactGA()
  const allProjects = project_data
  const featuredIndex = props.featuredIndex || 4
  const featuredProject = project_data.find((proj) => proj.id === featuredIndex)

  const pageLinks = [
    { type: "SingleLink", title: "Home", pageRef: "/" },
    { type: "Dropdown", title: "Projects", active: true,
      links: [
        { text: "Current Projects", element: "currentproj_id" },
        { text: "Previous Projects", element: "previousproj_id" }
      ]
    }
  ]
  const headerContent = {
    titleContent: [
      <div key={"featured title"} className="featuredProjectHeader">
        <h4>Featured Project:</h4>
        <h2>{featuredProject.title}</h2>
      </div>
    ],
    subtitleContent: [
      <div key={"featured description"} className="featuredProjectDescription">
        {(featuredProject.description) ? featuredProject.description : featuredProject.summary}
      </div>
    ],
    imageContent: featuredProject.images
  }

  const currentProjectComponents = allProjects.filter(x => x.time.includes("Present")).map(p => <NormalProject key={p.id} project={p} />)
  const previousProjectComponents = allProjects.filter(x => !x.time.includes("Present")).map(p => <NormalProject key={p.id} project={p} />)

  const sections = [
    { id: "currentproj_id", title: "Current Projects", content: <div> {currentProjectComponents} </div> },
    { id: "previousproj_id", title: "Previous Projects", content: <div> {previousProjectComponents} </div> }
  ]


  let sectionComponents = sections.map((section) => <Section key={section.id} section={section} />)
  return (
    <div className="app_container">
      <Summary resourceType="projects" nav={pageLinks} header={headerContent} sections={sectionComponents} />
    </div>
  )

}

export default ProjectHome;