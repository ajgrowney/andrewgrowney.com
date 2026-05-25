import React from 'react'
import { FaCode, FaCog, FaDatabase } from 'react-icons/fa'

const skills = [
    {
        domain: "Languages",
        icon: <FaCode className="skillsIcon" size="4em" />,
        list: [
            "Python",
            "Bash",
            "SQL",
            "TypeScript",
            "C++",
            "Groovy",
            "HTML/CSS"
        ]
    },
    {
        domain: "Infra",
        icon: <FaCog className="skillsIcon" size="4em" />,
        list: [
            "Docker",
            "Linux",
            "Nginx",
            "VPC",
            "Kubernetes",
            "AWS",
            "EKS",
            "Terraform",
            "Helm",
            "Jenkins",
            "Prometheus",
            "Grafana",
            "CDNs",
            "Route53"
        ]
    },
    {
        domain: "Backend / Data",
        icon: <FaDatabase className="skillsIcon" size="4em" />,
        list: [
            "PostgreSQL",
            "InfluxDB",
            "Apache Iceberg",
            "Parquet",
            "Protocol Buffers",
            "TensorFlow",
            "scikit-learn",
            "React",
            "REST API design",
            "STAC",
            "GeoJSON",
            "HTTP",
            "TLS",
            "Codex",
            "Augment"
        ]
    }

]

export default skills;
