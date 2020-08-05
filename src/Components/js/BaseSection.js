import React from 'react'
import '../css/sections.css'

// Param: id { string } - 
// Param: title { string } - 
// Param: content { JSX } - Element in the boady of the section 
function BaseSection({id, title, content}){
    return(
        <div id={id} className="chapterContainer">
            <h3 className="chapterTitle">{title}</h3>
            <hr />
            {content}
        </div>
    )
}

export default BaseSection;