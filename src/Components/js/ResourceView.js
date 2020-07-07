import React from 'react'
import Nav from './Nav'
import ResourceHeader from './ResourceHeader';
import '../css/resourceView.css'
function Resource(props){
    let { resourceType, nav, header, resource } = props
    return(
        <div>
            <Nav page={resourceType} navContent={nav} />
            <ResourceHeader content={header} />
            <div className='resourceBody'>
                {resource}
            </div>
        </div>
    )

}

export default Resource;