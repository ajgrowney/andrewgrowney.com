import React from 'react';
import { pageView } from '../Components/js/Analytics'

import { BaseSection, SummaryView } from '../Components/js'
import { About, Contact, Projects, Work } from '../Components/Homepage/js'
import { ProjectData, JobData, SkillData, SocialLinksData } from '../Data/'
import { ProfilePhoto } from '../Images'
import './css/homepage.css';

const aboutText = "Working towards the title critical thinker before Software Engineer. I work on projects to help out friends, push my skills and abilities, expand my horizons, and have a lot of fun. " +
    "After starting my career as a Software Engineer, I try to work with quality design and documentation at the forefront of each project I work on. " +
    "Thinking about analytics and performance at scale is the biggest piece of that design. " +
    "As I have encountered different problems, I have had to pick up new languages, learn new technologies, and study everything from data structures to algorithms to quantum mechanics. My experience has given me skills in, but not limited to these."


function Home(){
    let pageLinks = [
        { 
            type: "Dropdown", title: "Home", active: true,
            links: [
                { text: "About", element: "about_id" },
                { text: "Work", element: "work_id" },
                { text: "Projects", element: "project_id" },
                { text: "Contact", element: "contact_id" }
            ]
        },
        { type: "SingleLink", title: "Projects", pageRef: "/projects" },
        { type: "SingleLink", title: "Blogs", pageRef: "/blogs"}

    ]
    let headerContent = {
        titleContent: [
            <h3>Hello World! My name is</h3>,
            <h1>Andrew Growney</h1>
        ],
        subtitleContent: [
            "I am a Software Engineer on the Platform and Analytics Team for Atonix Digital in Denver, CO and recent graduate from the University of Kansas.",
            <br />,
            "With a passion for people, sci-fi, physics, music, faith, coffee, college basketball, and software design, feel free to reach out about anything or everything!"
        ],
        imageContent: [ProfilePhoto],
        imageRounded: true
    }
    let sectionsList = [
        { title: "About", content: <About aboutText={aboutText} skills={SkillData} />, id: "about_id" },
        { title: "Work", content: <Work jobs={JobData} />, id: "work_id" },
        { title: "Projects", content: <Projects projects={ProjectData} projectPerColumn={2} />, id: "project_id" },
        { title: "Let's Chat", content: <Contact email={"ajgrowney@gmail.com"} socialData={SocialLinksData} />, id: "contact_id" }
    ]
    let sectionComponents = sectionsList.map((section) => <BaseSection id={section.id} title={section.title} content={section.content} />);
    pageView('/homepage')
    return (
        <div id="app_container">
            <SummaryView resourceType={"personal"} nav={pageLinks} header={headerContent} sections={sectionComponents} />
        </div>
    )

}

export default Home;
