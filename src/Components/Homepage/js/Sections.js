import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/sections.css'


class Sections extends Component{
    constructor(props){
        super(props)
        this.sections = props.sectionsList
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