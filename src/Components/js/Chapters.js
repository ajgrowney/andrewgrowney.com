import React, { Component } from 'react'
import About from './About'
import Projects from './Projects'
import Work from './Work'
import Contact from './Contact'
import '../css/chapters.css'
import 'bootstrap/dist/css/bootstrap.css'

let chaptersObj = [
    {
        title: "About",
        content: <About />,
        id: "about_id"
    },
    {
        title: "Work",
        content: <Work />,
        id: "work_id"
    },
    {
        title: "Projects",
        content: <Projects />,
        id: "project_id"
    },
    {
        title: "Let's Chat",
        content: <Contact />,
        id: "contact_id"
    }
]

class Chapters extends Component{
    constructor(props){
        super(props)
        this.chapters = chaptersObj
    }
    render(){
        return(this.chapters.map((ch) => 
            <div id={ch.id} className="chapterContainer">
                <h3 className="chapterTitle">{ch.title}</h3>
                <hr />
                {ch.content}
            </div>
        ))
    }

}

export default Chapters