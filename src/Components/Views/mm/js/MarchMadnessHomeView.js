import React from 'react'
import Nav  from '../../../js/Nav'
import Button from 'react-bootstrap/Button'
import {SummaryView, BaseSection} from '../../../js'
import { MMBracket } from '../../../../images/Blogs/MarchMadnessML'


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
        { type: "SingleLink", title: "Matchup", pageRef: "/mm/matchup" },
        { type: "SingleLink", title: "Bracket", pageRef: "/mm/bracket" }
    ]
    const headerContent = {
        titleContent: [
            <div className={"featuredProjectHeader"}>
                <h2>March Madness Home</h2>
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
            "id": "matchup",
            "title": "Head-to-Head Matchups",
            "preview": "Look at head-to-head matchups in NCAA tournament history to see model predictions on a game-by-game basis"
        },
        {
            "id": "bracket",
            "title": "Full NCAA Tournament View",
            "preview": "Look at how a model performed on matchups throughout previous tournaments"
        }
    ].map(x => PagePreviewSection(x))
    return (
        <div className='app_container'>
            <SummaryView resourceType={"March Madness Home"} nav={navContent} header={headerContent} sections={sections} />
        </div>
    )
}

export default MMHomeView;
