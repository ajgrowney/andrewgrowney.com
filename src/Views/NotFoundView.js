import React from 'react'
import Button from 'react-bootstrap/Button'
import { BaseSection, Nav } from '../Components/js'
function NotFoundView(props){
    let links = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "Projects", pageRef: "/projects" },
        { type: "SingleLink", title: "Blogs", pageRef: "/blogs" }
    ]
    
    let notFoundSection = { title: "Not Found", id: "not_found",
        content: <div>
            404: Page Not Found
            <br /><br />
            <Button onClick={() => window.history.back()}>
                Back
            </Button>
        </div>, 
    }
    return(
        <div>
            <Nav navContent={links} />
            <BaseSection id={notFoundSection.id} title={notFoundSection.title} content={notFoundSection.content}/>
        </div>
    )
}

export default NotFoundView;