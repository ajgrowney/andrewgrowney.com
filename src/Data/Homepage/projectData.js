import ss_login from '../../Images/SELFSkillDemo-Login.gif'
import ss_createIdea from '../../Images/SELFSkillDemo-CreateIdea.gif'


const data = [
    {
        "id": 0,
        "title": "Ray: Raspberry Pi Assistant",
        "summary": "Digital Personal Assistant, inspired by J.A.R.V.I.S., that uses speech recognition and an API hosted on local network to manage basic tasks and scheduling.",
        "time": "February 2020 - Present",
        "images": [],
        "url": "https://github.com/ajgrowney/ray",
        "languages": ["Python", "Houndify API", "Tensorflow", "Natural Language Processing", "Django API"]
    },
    {
        "id": 1,
        "title": "Hip Hop Genius",
        "summary": "A music platform focused on lyrical analysis of Hip Hop artists. Currently working on display of meaningful results while utilizing AWS Lambda for daily API testing.",
        "time": "Oct 2018 - Present",
        "url": "https://github.com/ajgrowney/lyrical-analysis",
        "images": [],
        "languages": ["Python", "AWS Lambda", "Web Scraping"]
    },
    {
        "id": 2,
        "title": "DITI Early Detection of Breast Cancer",
        "summary": "Our senior capstone project was a continuation of a physics research project. Working with PhD students and medical researchers in Europe to use thermal imaging to detect breast cancer.",
        "time": "Jan 2018 - May 2019",
        "images": [],
        "url": "https://github.com/ajgrowney/py-diti",
        "languages": ["Python", "Computer Vision (OpenCV)", "Statistics", "Digital Image Processing"]
    },
    {
        "id": 3,
        "title": "DITI Image Metadata Classifier",
        "summary": "Using only image processing data from our DITI Early Detection of Breast Cancer project, we worked on implementing a few different classifiers to check predictions",
        "time": "Jan 2019 - Mar 2019",
        "images": [],
        "url": "https://github.com/ajgrowney/pyditi_metadataclassifier",
        "languages": ["Python", "Scikit Learn", "Machine Learning", "Data Science", "Pandas"]
    },
    {
        "id": 4,
        "title": "SELF Skill Sessions",
        "summary": "Created a reddit system for the SELF Program to use for creating group sessions",
        "time": "Jan 2019 - May 2019",
        "url": "#",
        "images": [ss_login,ss_createIdea],
        "languages": ["Google Firestore", "Javascript", "React.js", "Bootstrap", "CSS"]
    },
    {
        "id": 5,
        "title": "andrewgrowney.com",
        "summary": "Challenge to build and deploy fully functioning website in 6 hours. Using React and AWS, successfully designed, built, and deployed all in one day.",
        "time": "March 1, 2019",
        "url": "#",
        "images": [],
        "languages": ["Javascript", "React.js", "AWS Route 53", "AWS S3", "React-Bootsrap", "CSS"]
    }
]

export default data;
