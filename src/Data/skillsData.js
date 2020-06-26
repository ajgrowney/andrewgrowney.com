import React from 'react'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'

const skills = [
    {
        domain: "Backend",
        icon: <FaCog className="skillsIcon" size="4em" />,
        list: [
            "Kubernetes",
            "AWS (API Gateway,EKS, Lambda, ECS, Route 53)",
            "Flask",
            "Azure DevOps",
            "REST API Design",
            "Linux",
            "C++",
            "C#",
            ".NET",
            "Bash",
            "SQL",
            "Azure Pipelines",
            "Google Firebase",
            "Haskell",
            "C",
        ]
    },
    {
        domain: "Data Science",
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
        domain: "Frontend",
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
