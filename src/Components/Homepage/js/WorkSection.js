import React from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/work.css'

function WorkSection(props) {
    let { jobs } = props || [];

    let jobTabComponents = jobs.map((job) =>
        <Tab eventKey={job.id} title={job.tab_title} className="workCell">
            <h5>{job.position} / {job.company} / {job.location}</h5>
            <h6>{job.start_date}-{job.end_date}</h6>
            {job.about}
        </Tab>
    )

    return (
        <Tabs defaultActiveKey={0} className="workContainer">
            {jobTabComponents}
        </Tabs>
    )
}

export default WorkSection;