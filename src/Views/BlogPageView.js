import React from 'react'
import { ResourceView } from '../Components/js'
import blogs from '../Data/blogData'

function BlogPageView(props){
    let blog_id  = props.match.params.blogId
    const blog_selected = blogs.filter(b => b.id == blog_id)[0]
    
    const navContent = [
        { type: "SingleLink", title: "Home", pageRef: "/" },
        { type: "SingleLink", title: "Projects", pageRef: "/projects" },
        { type: "SingleLink", title: "Blogs", pageRef: "/blogs" }
    ]

    const headerContent = {
        titleContent: [
            <div className={"featuredProjectHeader"}>
                <h2>{blog_selected.title}</h2>
                <h6>{blog_selected.date}</h6>
            </div>
        ],
        subtitleContent: [
            <div>
                {blog_selected.preview}
            </div>
        ],
        imageContent: blog_selected.image
    }

    return(
        <div id="root">
            <ResourceView resourceType={"Blogs"} nav={navContent} header={headerContent} resource={blog_selected.content} />
        </div>
    )
}

export default BlogPageView;