import React from 'react'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'

const skills = [
    {
        header: "Backend",
        icon: <FaCog className="skillsIcon" size="4em" />,
        list: [
            "AWS (API Gateway, Lambda, ECS, Route 53)",
            "Azure DevOps",
            "REST API Design",
            "Linux",
            "C++",
            "C#",
            ".NET",
            "Bash",
            "Django",
            "SQL",
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
            "OpenCV",
            "Tensorflow",
            "Keras",
            "ML Ops"
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