import React from 'react'
import Nav  from '../../../js/Nav'
const MMHomeView = () => {
    let resourceType = ""
    let navContent = [
        { type: "SingleLink", title: "Matchup", pageRef: "/mm/matchup" }
    ]
    return (
        <div>
            <Nav page={resourceType} navContent={navContent} />
            <div>March Madness Home</div>
        </div>
    )
}

export default MMHomeView;
