import React from 'react'
import Nav from './Nav'
import Header from './Header';

function Summary(props){
    let { resourceType, nav, header, sections } = props
    return(
        <div>
            <Nav page={resourceType} navContent={nav} />
            <Header content={header} />
            {sections}
        </div>
    )

}

export default Summary;