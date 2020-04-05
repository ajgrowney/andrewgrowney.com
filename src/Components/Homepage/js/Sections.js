import React from 'react'
import '../css/sections.css'

function Section(props){
    let { id, title, content } = props.section
    return(
        <div id={id} className="chapterContainer">
            <h3 className="chapterTitle">{title}</h3>
            <hr />
            {content}
        </div>
    )
}

export default Section;