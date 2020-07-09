import React from 'react'
import { pageView } from '../Components/js/Analytics'
import Navbar from 'react-bootstrap/Navbar'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { BaseSection, SummaryView } from '../Components/js'
import project_data from '../Data/projectData'
import './css/projectPage.css'
import 'bootstrap/dist/css/bootstrap.css'



function NormalProject(props) {
  const project = props.project
  return (
    <Card id={"project_" + project.id.toString()} className="projectCardContainer">
      <h3>{project.title}</h3>
      <h6>{project.time}</h6>
      <p>{(project.description) ? (project.description) : (project.summary) } </p>
      <hr />
      {project.languages.join(', ')}
    </Card>
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
  pageView('/projects')
  const allProjects = project_data
  const featuredIndex = props.featuredIndex || 4
  const featuredProject = project_data.find((proj) => proj.id === featuredIndex)

  // Nav
  const navigation = [
    { type: "SingleLink", title: "Home", pageRef: "/" },
    { type: "Dropdown", title: "Projects", active: true,
      links: [
        { text: "Current Projects", element: "currentproj_id" },
        { text: "Previous Projects", element: "previousproj_id" }
      ]
    },
    { type: "SingleLink", title: "Blogs", pageRef: "/blogs"}
  ]

  // Header
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

  // Sections
  const currentProjectComponents = allProjects.filter(x => x.time.includes("Present")).map(p => <NormalProject key={p.id} project={p} />)
  const previousProjectComponents = allProjects.filter(x => !x.time.includes("Present")).map(p => <NormalProject key={p.id} project={p} />)

  const sections = [
    { id: "currentproj_id", title: "Current Projects", content: <div> {currentProjectComponents} </div> },
    { id: "previousproj_id", title: "Previous Projects", content: <div> {previousProjectComponents} </div> }
  ]

  let sectionComponents = sections.map((section) => <BaseSection key={section.id} section={section} />)

  return (
    <div className="app_container">
      <SummaryView resourceType="projects" nav={navigation} header={headerContent} sections={sectionComponents} />
    </div>
  )

}

export default ProjectHome;
