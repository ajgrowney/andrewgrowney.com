import React from 'react'
import ImageSet from '../components/js/ImageSet';
import { CacheBlogImage, FirstInternImage, DevOpsBlogImage } from '../images'
import { APIDevCycle, PetstoreSite, SampleSwagger } from '../images/Blogs/DesignFirstAPI'

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
        title: "An Apology to DevOps",
        date: "11/21/2020",
        preview: "Going from graduating with a IC Physics Degree to Designing CI/CD Pipelines. The path between that led to a place more familiar than expected.",
        content: [
            <div>
                Looking into different jobs applications at the beginning of senior year, it was tough to nail down the exact role I really wanted.
                With machine learning research experience and a great time working through projects during college, both Software Engineering and Machine Learning Engineer roles were at the top of my list.
                At the bottom laid a role that seemed ridiculuously boring because of no impact on products or solutions that ended up in the hands of consumers...the <b><i>DevOps Engineer</i></b>. 
                It's not a colloquial job title. Not something you learn about in college. Not something you would EVER hear about outside of a tech environment.
                My rough mental translation of the title was along the lines of "someone who cleans up after people who do the real work". 
                <br />  <br />
            </div>,
            <div>
                Time passes and I accept a role with a startup based out of Kansas City with the title of Software Engineer. On the first day, I get my placement on the Platform Team. 
                The team's primary responsibilities included enhancing overall system performance, researching and implementing new technologies to enhance the platform, and managing application and service deployment.
                The last piece of that didn't really hit me until I saw the last task of the our first Serverless project feature: 
                <br /> <br />
                <center><h6><i>Implement a Continuous Integration and Deployment pipeline for the project.</i></h6> </center>
                <br />
                With all the courage I could muster up, I took a single, gentle step into the world of DevOps. And to my surprise, it was...fun. 
                <br /><br />
            </div>,
            <div>
                The surprise was quickly replaced with a feeling of amazement. I'd been duped. Played like a fool.
                It dawned upon me that in the midst of writing this automated build, deploy, and monitoring pipeline that not only was I building a product, but I had a consumer.
                The consumer, our Applications Development team, were actually just solving a different style of problem than we were. But at the end of the day, we were Software Engineers because we were still just problem solving.
                At this point, we have built build and release pipeline templates for Angular applications, Docker images, AWS Lambda projects, Nuget packages, NPM modules, and a couple other artifact types.
                Each one of these products has extreme value because it allows our company to enforce coding/testing standards, but also quickly go from concepts to customer facing applications without people standing in the way. 
            </div>,
            <div>
                Upon having the opportunity to be part of the DevOps process, an apology is owed to the job title "DevOps Engineer" and the practice as a whole. With just a different style of problem solving, it really provides an interesting place for new developers to enter an organization.
                It helped me get a higher view of our platform as a whole and which technologies were being used to develop products at Atonix Digital. It really seems like the perfect place to introduce someone to a company to help them better understand not only the products, but the development lifecycle also.
                So if you come across a job opening that aligns will a DevOps Engineer, don't overlook it, because it might just be the most enjoyable kind of Software Engineering for you.
            </div>
        ],
        image: [DevOpsBlogImage]
    },
    {
        id: 3,
        visibility: "public",
        featured: true,
        title: "APIs: Definition Driven Development and the Power of Swagger",
        date: "3/6/2021",
        preview: "Documentation is one of the least rewarding, time consuming, and mentally exhausting exercises for a development team. But it doesn't have to be.",
        content: [
            <div>
                <h3>Motivation</h3>
                As a more technologically connected world develops, the distance between computing devices shrinks, internet bandwidth and speed increases, and the ability for smaller devices to communicate with more power machines becomes that much more important.
                These "more powerful" devices can be qualified as computers that have more CPU, more RAM, more GPU, or even more storage.
                These smaller devices are able to take advantage of these more powerful devices' ability to run computationally complex programs that have value. 
                In a world where computing is done closer to the edge, there is a need for these more powerful machines to be able to communicate with the smaller ones.
                One widely used way is developing REST APIs to provide programmatic access to resources. I'll jump more into REST API Design in another post, but I want to focus on the process here.
                What makes a good API usable and understood by all clients? One of the first answers typically is thought of as a four letter in the Software community: documentation.
                <br /><br />
                There are few things less enjoyable to the typical developer than spending time writing documentation. On the flip side, one of those few things is working with system that does not interact as it is described or expected to.
                So the tradeoff can be posed something like: writing documentation burns you in the short term by taking away developer time. But a lack of documentation burns you long term by your developers losing time trying to figure out the code and losing API users to frustration trying to figure out the interface.
                Surely you are going to be losing on one side of this equation, so the question is what is the best loss to take?
                <br /><br />
                One way to calculate the best loss to take is how long you expect to support this API. If it for a migration or just doesn't hold any lasting value, taking the loss on having to ressurect the code and deploy it again might be the best case as you might even be able to come up with a better design.
                However, most APIs have not only the need for long term support, but also for long term stability. If this is a monetized API, you can't be expecting users to be adjusting their client programs all the time for small breaking changes in the architecture. 
                Managing those client expectations and usabilty can be saved for an exercise in API versioning with respect to the first release of a stable API. 
                Getting to that stable v1 release means you have developers and a business team working across a team, or even an organization, to get the design and deployment finished.
                Few business team members (and arguably even few developers) have any desire to read through the code or even comments in the code to construct a mental diagram of what's occuring to explain the value of each parameter and endpoint.
                But the whole purpose of an API is to allow customers, whether they be internal or public, to quickly understand and adopt the value behind each endpoint, parameter, and response in the interface. If there wasn't value in any of those, why would it be included?
                So everyone wins in the API development and design process if there is a clear and consistent way to learn and track the documentation.
                Enter the OpenAPI and Swagger Specification as part of, what I've seen called many things but I'll refer to as, Definition Driven Development. <br /><br />
            </div>,
            <div>
                <h3>What is Definition Driven Development?</h3>
                The Definition Driven Development API Workflow follows the diagram below:<br />
                <ImageSet sources={[APIDevCycle]} />
                The client, whether they be internal or external, really only has two interactions with the API lifecycle. They have wants/needs, and they use what is deployed. A bonus for them is a documentation site that allows them to navigate what is deployed.
                Working off the asumption you want to provide them that documentation site for a better experience and less emails / phone calls, one extremely helpful tool in this process is known as an OpenAPI or Swagger specification document.
                <br /><br />
                <ImageSet sources={[SampleSwagger]} />
                <br /> <br />
                The goal of this document is to specify, with however much or little detail, all possible endpoints, parameters, definitions, and responses of your API. This document represents the "Definition" that is driving this process.
                Let's explore how this document's value grows throughout each step and iteration of the development process within the context of an example. In this example, let us be a ski resort that has never developed an API.<br /><br />
            </div>,
            <div>
                <h3>Approval and Refinement</h3>
                <div className="flexContainer">
                    <p className="flexItem">
                        When there is a set of specific wants and needs that are being brought to you, they typically represent interactions with some set of entities in your system. 
                        In the specification document, you can define the scope of that entity you want to expose and give access to per the want or need of the user. 
                        In our example, say a user really wants to get information about the slopes they can ski at your resort and filter by difficulty rating. As the ski resort, you might track a lot of information about each slope you have. 
                        Maybe you track when it was last groomed, an estimate of traffic per day, difficulty rating, and the run's vertical feet.
                        As part of the approval process, you clarify that the traffic per day is something you don't want to expose to external clients. 
                        So in this stage of the document, you'd be able to capture a fully qualified and approved representation of a slope entity in the "definitions" section.
                        The other conversation that needs to happen here is figure out where in your API Ecosystem is this resource best served. In our case, this is our first API so I will save that for the deployment step.
                    </p>
                    <pre className="flexItem">
                        <code>
                        {JSON.stringify({
                            "definitions": {
                                "slope": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "integer",
                                            "description": "Identifier for the slope"
                                        },
                                        "difficulty": {
                                            "type": "string",
                                            "format": "enum",
                                            "enum": [
                                                "green",
                                                "blue",
                                                "black"
                                            ]
                                        },
                                        "vertical_feet": {
                                            "type": "number",
                                            "format": "float",
                                            "description": "Vertical feet of the slope"
                                        },
                                        "last_groomed": {
                                            "type": "date",
                                            "description": "Date on which the run was last groomed"
                                        },
                                    }
                                }
                            }
                            },null,2)}
                        </code>
                    </pre>
                </div>
                <h3>Specification Design</h3>
                <div className="flexContainer">
                    <p className="flexItem">
                        With definitions provided through the approval and refinement process, specification design is able to have its scope reduced drastically. 
                        This enables a more focused conversation around the best experience for clients to access the resources defined, parameters allowed, and responses they would expect back. 
                        Here we know at a minimum they would want the list of filtered slopes back if it is successful, but we can also prepare them to be able to handle a response if their authentication failed. 
                        At this point, you can also provide the document as feedback to the client or even deployed to a pre-release documentation site so the users can be ready to integrate with the API upon its release.
                    </p>
                    <pre className="flexItem">
                        <code>
                        {JSON.stringify({
                            "paths": {
                                "/slopes": {
                                  "get": {
                                    "tags": ["v1"],
                                    "operationId": "getSlopes",
                                    "summary": "List slopes",
                                    "description": "Fetch a list of the slopes for our ski resort",
                                    "parameters": [
                                        {
                                            "name": "difficulty",
                                            "in": "query",
                                            "type": "string",
                                            "format": "enum",
                                            "enum": [
                                                "green",
                                                "blue",
                                                "black"
                                            ],
                                            "description": "Filter the return list by difficulty rating",
                                            "required": false
                                        }
                                    ],
                                    "responses": {
                                        "200": {
                                          "description": "Success",
                                          "schema": {
                                              "type": "array",
                                              "items": {
                                                  "type": "#/definitions/slope"
                                                }
                                            }
                                        },
                                        "401": {
                                            "description": "Unauthenticated",
                                            "schema": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }}
                            },null,2)}
                        </code>
                    </pre>
                </div>
                <h3>Development and Testing</h3>
                With this iteration of the specification finished, development and testing are extremely straightforward as you just have to work towards an implementation of the specification document. 
                One great thing about this document format is you can integrate it into many API tools, like Postman and API Gateway, with a simple import. Setting up paths for your testing are as simple as working through permutations of paths and parameters while validating the response. 

                <br /><br />
                <h3>Deploy Code and Documentation</h3>
                
                <div className="flexContainer">
                    <p className="flexItem">
                        Now that development and testing have finished, you know you have a functional API that matches the full specification. If this is your first API, like it is ours for this example, we have to decide the base URL that users are going to access it at.
                        We'll choose to host it at https://api.myskicompany.com/v1 as our first version of an API. Now unless your client is just a huge fan of parsing through a JSON file, they'd probably enjoy a better UX to view the documentation. 
                        One of the great things about this style of specification document, is there are a lots of options for rendering a great UI with extremely limited overhead. A couple of the most commonly used are Dapperxox, Redoc, and Swagger UI. 
                        Using any of those three will get your clients up and running with the only work on your part being linking the specification to the rendering tool.
                    </p>
                    <pre className="flexItem">
                        <code>
                            {JSON.stringify({
                                "info": {
                                    "version": "1.0.0",
                                    "title": "My Resort API",
                                    "description": "API for finding information about the resort"
                                },
                                "schemes": [
                                    "https"
                                ],
                                "basePath": "/v1",
                                "host": "api.myskicompany.com"
                            },null,2)}
                        </code>
                    </pre>
                </div>
            </div>,
            <div>
                <h3>More Resources</h3>
                If you like this process and are interested in seeing a final view of a full specification file, a great example of this can be found at  
                <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/json/petstore-simple.json" target="_blank" rel="noopener noreferrer" > Full Sample Swagger: Simple Pet Store</a>.
                The other supported format for these files is YAML so you'll find examples of both throughout GitHub. 
            </div>
        ],
        image: [PetstoreSite]
    },
    {
        i: 4,
        visibility: "private",
        title: ""
    },
    {
        id: 5,
        visibility: "private",
        title: "2020: A Year of Learning",
        date: "12/25/2020",
        preview: "A recap of some of the simple, hard, and exciting concepts I started learning in the year of COVID-19 ",
        content: [
            <div>
                <h2>Kubernetes</h2>
                <p>TODO</p>
            </div>,
            <div>
                <h2>API Design</h2>
                <p>TODO</p>
            </div>,
            <div>
                <h2>Knowledge Graphs</h2>
                <p>TODO</p>
            </div>,
            <div>
                <h2>Networking</h2>
                <p>TODO</p>
            </div>,
            <div>
                <h2>Prometheus / Grafana</h2>
                <p>TODO</p>
            </div>,
            <div>
                <h2>AWS</h2>
                <p>TODO</p>
            </div>
        ],
        image: []
    },
    {
        id: 6,
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