import React from 'react'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'

const skills = [
    {
        domain: "Backend",
        icon: <FaCog className="skillsIcon" size="4em" />,
        list: [
            "Lot of AWS (API Gateway,EKS, Lambda, ECS, Route 53)",
            "API Development: TCP / HTTP / Websocket / gRPC",
            "Postgres",
            "Linux",
            "C++",
            "Kubernetes",
            "Flask",
            "C# / .NET",
            "Bash",
            "Event Driven",
            "Prometheus",
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
            "JS/HTML/CSS",
            "React + Vite"
        ]
    }

]

export default skills;
