import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

import About from './About'
import Work from './Work'
import Contact from './Contact'
import Projects from './Projects'

import '../css/sections.css'

let sectionsList = [
    { title: "About", content: <About />, id: "about_id" },
    { title: "Work", content: <Work />, id: "work_id" },
    { title: "Projects", content: <Projects />, id: "project_id" },
    { title: "Let's Chat", content: <Contact />, id: "contact_id" }
]

class Sections extends Component{
    constructor(props){
        super(props)
        this.sections = sectionsList
    }
    render(){
        return(this.sections.map((s) => 
            <div id={s.id} className="chapterContainer">
                <h3 className="chapterTitle">{s.title}</h3>
                <hr />
                {s.content}
            </div>
        ))
    }

}

export default Sections;