import { SkillSession_Login, SkillSession_Idea } from '../Images'

const data = [
    {
        "id": 0,
        "title": "Ray: Raspberry Pi Assistant",
        "summary": "Digital Personal Assistant, inspired by J.A.R.V.I.S., that uses speech recognition and an API hosted on local network to manage basic tasks and scheduling.",
        "description": "Designed around the specifications of Tony Stark's great assistant JARVIS, this project started out as a simple request and response system. Using speech recognition, text-to-speech, and the level triggered design pattern that drives Kubernetes, Ray can now integrate with any services and interfaces that fulfill the required protocols.",
        "time": "February 2020 - Present",
        "images": [],
        "url": "https://github.com/ajgrowney/ray",
        "languages": ["Python", "Rasa NLU", "IPC", "Houndify API", "Tensorflow", "CLI", "Flask", "Django API"],
        "visibility": "private"
    },
    {
        "id": 1,
        "title": "Hip Hop Genius",
        "summary": "A project focused on lyrical analysis of Hip Hop artists. Shows artists usage of words and phrases over time. Utilizing AWS Lambda for testing the Genius API daily.",
        "time": "Oct 2018 - Dec 2019",
        "url": "https://github.com/ajgrowney/lyrical-analysis",
        "images": [],
        "languages": ["Python", "AWS Lambda", "Web Scraping"],
        "visibility": "public"
    },
    {
        "id": 2,
        "title": "DITI Early Detection of Breast Cancer",
        "summary": "Our senior capstone project was a continuation of a physics research project. Working with PhD students and medical researchers in Europe to use thermal imaging to detect breast cancer.",
        "time": "Jan 2018 - May 2019",
        "images": [],
        "url": "https://github.com/ajgrowney/py-diti",
        "languages": ["Python", "Computer Vision (OpenCV)", "Statistics", "Digital Image Processing"],
        "visibility": "public"
    },
    {
        "id": 3,
        "title": "DITI Image Metadata Classifier",
        "summary": "Using only image processing data from our DITI Early Detection of Breast Cancer project, we worked on implementing a few different classifiers to check predictions",
        "time": "Jan 2019 - Mar 2019",
        "images": [],
        "url": "https://github.com/ajgrowney/pyditi_metadataclassifier",
        "languages": ["Python", "Scikit Learn", "Machine Learning", "Data Science", "Pandas"],
        "visibility": "public"
    },
    {
        "id": 4,
        "title": "SELF Skill Sessions",
        "summary": "Created a reddit system for the KU SELF Program to use for creating group sessions",
        "description": "Reddit style brainstorming site. Designed to make people's favorite ideas more visible, the skill sessions website allowed for real time voting, idea posting/commenting, and event creation.",
        "time": "Jan 2019 - May 2019",
        "url": "https://github.com/ajgrowney/self-skill-sessions",
        "images": [SkillSession_Login, SkillSession_Idea],
        "languages": ["Google Firestore", "Javascript", "React.js", "Bootstrap", "CSS"],
        "visibility": "public"
    },
    {
        "id": 5,
        "title": "andrewgrowney.com",
        "summary": "Challenge to build and deploy fully functioning website in 6 hours. Using React and AWS, successfully designed, built, and deployed all in one day.",
        "time": "March 1, 2019",
        "url": "https://github.com/ajgrowney/andrewgrowney.com",
        "images": [],
        "languages": ["Javascript", "React.js", "AWS Route 53", "AWS S3", "React-Bootsrap", "CSS"],
        "visibility": "public"
    }
]

export default data;
