import React from 'react'
import { CacheBlogImage, FirstInternImage } from '../Images'
const blogs = [
    {
        id: 0,
        visibility: "public",
        title: "Caching Instead of Cleaning Your Room",
        date: "9/17/2018",
        preview: "Applications of a fundamental computer science concept in the most familiar of places",
        content: [
            <div>
                It's not exactly a stretch to say my room has been dirty for...a while. That was until the start of this school year. Well, let's say it's a process.
                During my summer of working as a Software Engineering Intern at Cerner Corporation, I had the opportunity to attend an internal development conference title "DevCon". The opening keynote speaker, Dave Rensin, was the head of Site Reliability Engineering at Google. His talk focused on explaining the concepts of humanity, errors, judgement, and systems. An important point he drove home was judgement versus intuition. Rensin details to us that "judgement is what we use when we have to make a decision and there is no more useful data to get or no more time in which to get it. Judgement gets better with experience. Intuition is what we use we could get more data or spend more time to but don't want to."
            </div>,
            <h4>
                "Judgement gets better with experience"- Dave Rensin, Google Engineering Director.
            </h4>,
            <div>
                It's not that I didn't have the proper knowledge on how to clean my room, I didn't want to put the time into it. Despite this, there would be days where I would take an hour or two and get it all perfectly organized and clean. I would walk out accomplished before returning just to notice a few days later that it was back in a state of chaos. The frustration in not wanting to put time into cleaning it didn't come from laziness. It came from confusion on how it would get so messy even though I made conscious efforts to put things in the right places.
            </div>,
            <h4>
                "Habitually breaking the system is NOT the sin. Not fixing the system to prevent it is." - Rensin
            </h4>,
            <div>
                After hearing these words from Rensin, I took time to get a broader glance at my room as a system to collect more data. I made note of specific habits that I had, where I get things from, and how things ended up where the did not belong. It didn't take too long to realize the issue I was discovering had been solved. The solution was implemented in computers in 1980 when the cache was introduced. It brought two important principles: spatial and temporal locality. It means whatever we need more often, let's keep close to us and close to each other.
                My room had become a massive chunk of main memory where I would be searching for the couple things I wanted all the time, and misplacing the things I was looking through repeatedly. It was a system that encouraged breaking it. My solution: keep what I like to wear often close to me and close to each other. The place that I keep these clothes is a small organizer that doesn't hold more than seven pieces of clothes per shelf. This allows me to look there first easily, get something I like to wear quickly, and not disturb other items around it. The last part of that was the purpose of the design, but the first two were positive consequences in creating an impromptu caching system for my clothes. This doesn't mean that the wardrobe has been limited to seven items at a time, it just means an increase in effective clothing access time.
                Now this system might only be Windows 7 quality right now. But as time goes, further judgments will allow for more data, better information, and a system that encourages improvement rather than bugs.
            </div>

        ],
        featured: true,
        image: [CacheBlogImage]
    },
    {
        id: 1,
        visibility: "public",
        title: "First Tech Internship Takeaways",
        date: "8/9/2018",
        preview: "The first experience working in the professional tech world.",
        content: [
            <div>After finishing my junior year in the EECS department at the University of Kansas, I was very confident in my programming and technical skills. This confidence was quickly turned on its head during the first couple weeks of my first technical internship at Cerner Corporation this summer. Although I had experience with certain types of problems and an aptitude for applying it elsewhere, I didn't realize how much work it would take to transition my skill set into meaningful production for a company. As I worked, tried, failed, succeeded, realized it wasn't right, asked for help, and drank another cup of coffee, I managed to write down a couple takeaways from my first summer in the tech world.</div>,
            <h4>Know how you learn</h4>,
            <div>During the first week and a half of the internship, the majority of my hours were spent reading wiki articles on the software I'd be using and how to navigate it. After multiple articles, it felt like each article was just a chore to get through. And I pushed through. However, it seemed like each time I conquered a series of articles and felt ready to apply it, I'd fail. After failing upon multiple attempts, I would walk over to my job coach and ask a couple basic questions that would reveal a simple mistake in the process. This method just wasn't working. So instead of the approach recommended, I proceeded to watch videos on related topics while reading through the previously written code in my organization. Taking notes on successful code while listening to explanations of higher level and language-specific concepts helped my learning curve drastically, but it didn't solve everything. I still encountered issues beyond my style of learning that needed to be addressed. These issues required asking questions to people with expertise in that area which leads me to my second takeaway.</div>,
            <h4>Know your question and what it means before asking it</h4>,
            <div>Although this might seem like a simple concept, I fooled myself multiple times over the course of the last couple of months. What I mean by this is understand each individual word and phrase in your question, or provide context to your misunderstanding of a part of it. If I am asking how a component within a framework behaves, I need to understand the basics of the framework before asking about a portion of it. Even if the expert is to understand your question and formulate an answer, if you don't know the bigger concept, you will not be able to comprehend the answer. This does not mean to spend a whole day trying to figure it out on your own, but acknowledge that you do not quite grasp the framework as a whole before asking about a specific part.</div>,
            <h4>Being "The Best" is a bad mindset</h4>,
            <div>It is nice to be the best in certain moments of life, but it is even better to recognize someone of higher skill worth pacing off and chasing. This person is not someone to imitate, rather someone to mentor your next steps to improvement. Another downside of having "The Best" mindset comes from people interpreting you as an unapproachable figure. The best influences I had this summer made sure to remind me that they struggled with my same spots as well when adjusting.</div>,
            <h4>Culture can drive motivation and work ethic unlike anything</h4>,
            <div>The culture, within organizations of all sizes, plays a monumental role in the pace of work done and the attitudes of its members. As a whole, Cerner did a fantastic job with the workplace environment to encourage collaboration and efficiency. My specific team also gave me motivation through seeing the hard work of my fellow associates in our weekly demo meeting. Being transparent in this way didn't only keep people accountable for their progress, but it made those watching accountable for their pace of work. I can see how this method of presentation is extremely effective and where it can be applied in my organizations going into senior year, and my career following.</div>,
            <div>Overall, it was a fantastic summer and couldn't have asked for anything more. Truly a great experience with a couple key takeaways that I will keep for a long time. </div>
        ],
        image: [FirstInternImage]
    },
    {
        id: 2,
        visibility: "public",
        title: "Journey into DevOps",
        date: "9/21/2020",
        preview: "Going from graduating with a IC Physics Degree to Designing CI/CD Pipelines and the path between.",
        content: [
            <div>
                Looking into different jobs applications at the beginning of senior year, it was tough to nail down the exact role I really wanted.
                With machine learning research experience and a great time working through projects during college, both Software Engineering and Machine Learning Engineer roles were at the top of my list.
                At the bottom laid a role that seemed ridiculuously boring because of no impact on products or solutions that ended up in the hands of consumers...the <b><i>DevOps Engineer</i></b>.
            </div>,
            <div>
                Time passes and I accept a role with an interesting startup based out of Kansas City with the title of Software Engineer on the Platform Team. 
                After acclimating to the new environment and training, I broke ground on a Serverless Template for our development teams' future work in AWS Lambda. And then it happened.
                <br /> <br />
                <h6><i>Put together a CI/CD Pipeline for the project.</i></h6> <br />
                With all the courage I could muster up, I took a single, gentle step into the world of DevOps. And to my surprise, it was...fun. 
                When discussing complexity in our computer science cirriculum, its scope was often limited to program runtime and memory. 
                As important as efficient code was to our applications, the scope of how I viewed complexity widened significantly as I progressed from implementing the serverless application's pipeline, to developing build and deployment templates for our other applications.
                Providing the development teams with simple processes for managing company wide access to their applications in their desired environments 
            </div>
        ],
        image: []
    },
    {
        id: 3,
        visibility: "private",
        title: "API First Design and the Power of Swagger",
        date: "//2020",
        preview: "Documentation is one of the least rewarding, time consuming, and mentally exhausting exercises for a development team. But it doesn't have to be.",
        content: [
            <div>There are few things less enjoyable to the typical developer than spending time writing documentation. However, one of those few things is working with system that does not interact as it is described or expected to. An immovable object meets an unstoppable force.</div>,
            <div></div>
        ],
        image: []
    },
    {
        id: 4,
        visibility: "private",
        title: "Intro to Kubernetes and Containerized System Design",
        date: "//2020",
        preview: "",
        content: [

        ],
        image: []
    }
]

export default blogs;