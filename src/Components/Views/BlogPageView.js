import React from 'react'
import Helmet from 'react-helmet';
import { pageView } from '../js/Analytics'
import PageNotFoundView from './NotFoundView'
import { ResourceView } from '../js'
import blogs from '../../Data/blogData'

function BlogPageView(props){
    let headerElement = props.headEl;
    console.log(headerElement)
    console.log(props)
    let blog_id_param = props.match.params.blogId
    let blog_id = parseInt(blog_id_param)
    if(isNaN(blog_id)){
        return(<PageNotFoundView />)
    }
    pageView('/blogs/'+blog_id)
    let blog_selected = blogs.filter(b => (b.id === blog_id))
    console.log(blog_selected.length)
    if(blog_selected.length !== 1){
        return(<PageNotFoundView />)
    }else{
        blog_selected = blog_selected[0]
    }
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
            <Helmet>
                <title>{blog_selected.title}</title>
                <meta name="image" property="og:image" content={blog_selected.image} />
                <meta name="description" property="og:description" content={blog_selected.title} />
                <meta name="author" content="Andrew Growney" />
            </Helmet>
            <ResourceView resourceType={"Blogs"} nav={navContent} header={headerContent} resource={blog_selected.content} />
        </div>
    )
}

export default BlogPageView;