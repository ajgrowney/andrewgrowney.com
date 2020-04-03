import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import '../css/work.css'
import 'bootstrap/dist/css/bootstrap.css'

class Work extends Component{
    constructor(props)
    {
        super(props);
        this.jobs = props.jobs || [];
    }

    render(){
        
        return(
            <Tabs defaultActiveKey={0} className="workContainer">
                {this.jobs.map((job) => 
                    <Tab eventKey={job.id} title={job.tab_title} className="workCell">
                        <h5>{job.position} / {job.company} / {job.location}</h5>
                        <h6>{job.start_date}-{job.end_date}</h6>
                        {job.about}
                    </Tab>
                )}
            </Tabs>
        )
    }
}

export default Work;