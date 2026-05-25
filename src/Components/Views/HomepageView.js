import React from 'react';
import { Link } from 'gatsby';

import { BaseSection, SummaryView } from '../js'
import { About, Contact, Projects, Work } from '../Homepage/js'
import { ProjectData, JobData, SkillData, SocialLinksData } from '../../Data'
import { ProfilePhoto } from '../../images'
import './css/homepage.css';

const aboutText = "Working towards the title critical thinker before Software Engineer. I work on projects to help out friends, push my skills and abilities, expand my horizons, and have a lot of fun. " +
    "A couple good design docs and diagrams are worth a hundred meetings and POCs. A good mental model is worth all those design docs and diagrams combined. " +
    "I worry about AI for different reasons than you. " +
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
        { type: "SingleLink", title: "Blogs", pageRef: "/blogs"},
        { type: "SingleLink", title: "Madness Suite", pageRef: "/mm" },
        { type: "ExternalLink", title: "Resume", pageRef: "/GrowneyResume2026.pdf", download: true }

    ]
    let headerContent = {
        key: "home_header",
        titleContent: [
            <h1 key="name">Andrew Growney</h1>
        ],
        subtitleContent: [
            <Link key="madness-suite" className="homepage-header-link" to="/mm">Madness Suite</Link>,
            <div key="iam">I am a Senior Software Engineer at Vantor in Denver, CO.</div>,
            <div key="iam-evenmore">Probably teaching my kids something about space right now.</div>,
            <div key="iammore">Enjoy learning about space, physics, people, sci-fi, robotics, music, faith, coffee, college basketball, and dynasty fantasy football</div>
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
    let sectionComponents = sectionsList.map((section) => <BaseSection key={section.id} id={section.id} title={section.title} content={section.content} />);
    return (
        <div id="app_container">
            <SummaryView resourceType={"personal"} nav={pageLinks} header={headerContent} sections={sectionComponents} />
        </div>
    )

}

export default Home;
