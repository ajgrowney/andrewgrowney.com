import React from 'react'
import Nav from '../Components/js/Nav'
import { Header, Section } from '../Components/Homepage/js'
import './css/projectPage.css'

function BlogHome(props){
    return(
        <div className="root">
            <Nav page="projectHome" navContent={[]} />
            <h1>
                Here
            </h1>
        </div>
    )
}

export default BlogHome;