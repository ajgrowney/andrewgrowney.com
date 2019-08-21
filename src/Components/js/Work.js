import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import '../css/work.css'
import 'bootstrap/dist/css/bootstrap.css'

const all_jobs = [
    {
        tab_title: "SWE",
        position: "Software Engineer",
        company: "Atonix Digital",
        location: "Denver, CO",
        about: "Assisted platform development for IIOT SaaS Company",
        start_date: "August 2019",
        end_date: "Current",
        id: 0
    },
    {
        tab_title: "SWE Intern",
        position: "Software Engineering Intern",
        company: "Cerner Corporation",
        location: "Kansas City, MO",
        about: "Developed 3 successful application components for Cerner Millennium Powerchart used by nurses and physicians in thousands of facilities worldwide as measured by approvals from full time associates and managers by using NodeJs, React based framework, and object oriented Javascript ES6 within an agile team using JIRA, Kanban, and Git",
        start_date: "May 2018",
        end_date: "August 2018",
        id: 1
    },
    {
        tab_title: "Blue Team Staff",
        position: "Blue Team Managerial Staff",
        company: "Archdiocese of Kansas City, KS",
        location: "Williamsburg, KS",
        about: "Managed, scheduled, and mentored staff of 80 college students with over 2000 camp participants. Responsibilities included developing curriculum, training of staff, and other duties as directed by the camp directors",
        start_date: "Summer 2015",
        end_date: "Summer 2017",
        id: 2
    },
    {
        tab_title: "Business Owner",
        position: "Owner",
        company: "Growney Landscaping",
        location: "Overland Park, KS",
        about: "Financed first car purchase and 100% of college costs by creating and operating an independent full-service lawn care venture for 9 clients throughout Middle School and High School years",
        start_date: "April 2010",
        end_date: "May 2015",
        id: 3
    }
]

class Work extends Component{

    render(){
        
        return(
            <Tabs defaultActiveKey={0} className="workContainer">
                {all_jobs.map((j) => 
                    <Tab eventKey={j.id} title={j.tab_title} className="workCell">
                        <h5>{j.position}/ {j.company}/ {j.location}</h5>
                        <h6>{j.start_date}-{j.end_date}</h6>
                        {j.about}
                    </Tab>
                )}
            </Tabs>
        )
    }
}

export default Work;