import React from 'react'
import Button from 'react-bootstrap/Button';
import { BaseSection, SummaryView } from '../Components/js'
import blogs from '../Data/blogData'
import './css/projectPage.css'

function BlogPreviewSection(b){
    let blog_preview = {
        id: b.id,
        title: b.title,
        content: [
            <div>
                {b.preview}
                <br /><br />
                <Button onClick={() => window.location.href = "/blogs/"+b.id}>
                    View Blog
                </Button>
            </div>
        ]
    }
    return <BaseSection key={b.id} section={blog_preview} />
}

function BlogHome(props){
    const featured_blog = blogs.filter(b => b.featured)[0]
    const nonfeatured_blogs = blogs.filter(b => !b.featured)
    const navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "Projects", pageRef: "/projects" },
        { type: "SingleLink", title: "Blogs", pageRef: "/blogs", active: true}
    ]
    const headerContent = {
        titleContent: [
            <div className={"featuredProjectHeader"}>
                <h4>Featured Blog:</h4>
                <h2>{featured_blog.title}</h2>
                <h6>{featured_blog.date}</h6>
            </div>
        ],
        subtitleContent: [
            <div>
                {featured_blog.preview}
                <br /><br />
                <Button onClick={() => window.location.href="/blogs/"+featured_blog.id}>
                    View Blog
                </Button>
            </div>
        ],
        imageContent: featured_blog.image
    }
    const sections = nonfeatured_blogs
    const sectionComps = sections.map(s => BlogPreviewSection(s))
    return(
        <div className="app_container">
            <SummaryView resourceType={"Blogs"} nav={navContent} header={headerContent} sections={sectionComps} />
        </div>
    )
}

export default BlogHome;