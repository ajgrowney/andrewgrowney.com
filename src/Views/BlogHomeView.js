import React from 'react'
import { Section } from '../Components/Homepage/js'
import Summary from '../Components/js/SummaryView'
import './css/projectPage.css'

function BlogHome(props){
    const navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "Projects", pageRef: "/projects" }
    ]
    const headerContent = {
        titleContent: [
            <div className={"featuredProjectHeader"}>
                <h4>Featured Blog:</h4>
                <h2>Featured Blog Title</h2>
            </div>
        ],
        subtitleContent: [
            <div className={"featuredProjectDescription"}>
                {"Blog Preview"}
            </div>
        ],
        imageContent: []
    }
    const sections = [
        { id: "blog_0", title: "Blog 0", content: <div>Blog 0 Preview</div> }
    ]
    const sectionComps = sections.map(s => <Section key={s.id} section={s} />)
    return(
        <div className="app_container">
            <Summary resourceType={"Blogs"} nav={navContent} header={headerContent} sections={sectionComps} />
        </div>
    )
}

export default BlogHome;