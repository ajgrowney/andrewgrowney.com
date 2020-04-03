import React from 'react'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'

const skills = [
    {
        header: "Backend",
        icon: <FaCog className="skillsIcon" size="4em" />,
        list: [
            "AWS Lambda",
            "AWS API Gateway",
            "REST API Design",
            "Linux",
            "C++",
            "C#",
            ".NET Core",
            "AWS S3",
            "AWS Route 53",
            "SQL",
            "Azure DevOps",
            "Azure Pipelines",
            "Google Firebase",
            "Haskell",
            "C",
        ]
    },
    {
        header: "Data Science",
        icon: <FaDatabase className="skillsIcon" size="4em" />,
        list: [
            "Python",
            "Pandas",
            "Numpy",
            "Scikit Learn",
            "Computer Vision",
            "OpenCV"
        ]
    },
    {
        header: "Frontend",
        icon: <FaCode className="skillsIcon" size="4em" />,
        list: [
            "Javascript (ECMAScript 6)",
            "Node.js",
            "React.js",
            "Bootstrap",
            "HTML5 & CSS3",
            "Electron.js"
        ]
    }

]

export default skills;