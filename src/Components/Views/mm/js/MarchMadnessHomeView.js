import React from 'react'
import Nav  from '../../../js/Nav'
import Button from 'react-bootstrap/Button'
import {SummaryView, BaseSection} from '../../../js'
import { MMBracket } from '../../../../images/Blogs/MarchMadnessML';
import { IMAGE_HOST } from '../../../../images';


const PagePreviewSection = (p) => {
    let preview = {
        id: p.id,
        title: p.title,
        content: [
            <div>
                {p.preview}
                <br /><br />
                <Button onClick={() => window.location.href = "/mm/"+p.id}>
                    View Page
                </Button>
            </div>
        ]
    }
    return <BaseSection key={p.id} id={preview.id} title={preview.title} content={preview.content} />


}

const MMHomeView = () => {

    let resourceType = ""
    let navContent = [
        { type: "SingleLink", title: "Matchup", pageRef: "/mm/matchup/" },
        { type: "SingleLink", title: "Bracket", pageRef: "/mm/bracket/" },
        { type: "SingleLink", title: "Team Profile", pageRef: "/mm/team/" }
    ]
    const headerContent = {
        titleContent: [
            <div className={"featuredProjectHeader"}>
                <h2>The Madness Suite</h2>
            </div>
        ],
        subtitleContent: [
            <div>
                {"Explore insight from models I've made to help win your NCAA tournament pools this year"}
            </div>
        ],
        imageContent: [MMBracket]
    }
    const sections = [

        {
            "id": "bracket",
            "title": "Bracket Insights",
            "preview": "Look at how a model performed on matchups throughout previous tournaments"
        },
        {
            "id": "team",
            "title": "Team Profiles",
            "preview": "Checkout team profiles to get a view of their historical performance and similar teams in the past"
        },
        {
            "id": "matchup",
            "title": "Head-to-Head Matchups",
            "preview": "Look at head-to-head matchups in NCAA tournament history to see model predictions on a game-by-game basis"
        },
    ].map(x => PagePreviewSection(x))
    return (
        <div id="root">
        <div className='app_container'>
            <SummaryView resourceType={"March Madness Home"} nav={navContent} header={headerContent} sections={sections} />
        </div>
        </div>
    )
}

export default MMHomeView;