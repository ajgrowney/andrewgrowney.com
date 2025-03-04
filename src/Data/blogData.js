import React from 'react'
import ImageSet from '../components/js/ImageSet';
import { CacheBlogImage, FirstInternImage, DevOpsBlogImage } from '../images'
import { APIDevCycle, PetstoreSite, SampleSwagger } from '../images/Blogs/DesignFirstAPI'
import { MMBracket, CoinClassifier, SeedClassifier, Rule3Classifier, Rule3Diagram, EastRegion_2021 } from '../images/Blogs/MarchMadnessML'
import { OddsToProbs, TeamPointsPDF, TeamScoresLessThan, ProjTeamPtsMov, ProjSpreadCalc, CDFTailInterp, FullProjSpread, SBLogo } from '../images/Blogs/MMPt2'
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
        featured: false,
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
        id: 4,
        visibility: "public",
        featured: false,
        title: "YDKYK: The Machine Learning Behind Your March Madness Picks",
        date: "3/1/2022",
        preview: "First post in the series: You Didn't Know You Know. We walk sports fans through the process of picking their March Madness bracket to show them that they might know more about machine learning than they think",
        content: [
            <div>
                The experience of being a sports fan can be one of excitement, joy, anxiety, pain, and sometimes all those emotions at the same time. It can create friendships, connect you to a community, and raise your heart rate enough to consider it a form of cardio. 
                When you follow closely enough, you gain an understanding of the sport itself. This understanding of the sport might give rise to an intuition of who will win and even how it could play out, like how many points will be scored in a basketball game. 
                Your intuition gets better the more time you spend watching as you learn more of the nuances. The amazing thing about sports that keeps people watching is, no matter what the person with the most intuition and knowledge of the game thinks, no outcome is guaranteed. 
                There isn't a better example in the world of sports than the NCAA's College Basketball Tournament. Its parody and wild outcomes have earned it the title of March Madness.
                <br />
            </div>,
            <div>
                <br />
                <h3>The Problem</h3>
                If you fill out a bracket in March, you know how hard it is to pick a perfect bracket. We still have yet to have a verified perfect bracket in the event's history, which actually isn't surprising given the odds are <b>1 in 9,223,372,036,854,775,808</b>. 
                It's no one's fault given the exceptional outcomes like Jim Valvano's North Carolina State team winning the National Championship in 1983, the 16 seed UMBC's upset of the overall #1 seed, and every buzzer-beater that seems to freeze time while it is in the air. 
                Let's walk through how you might approach this insurmountable problem of picking your bracket. Along the way, I want to show you that <b>you might know more about machine learning than you think</b>.
                <br />
            </div>,
            <div>
                <br />
                <h3>Our Approach: Survive and Advance</h3>
                When we take your first look at the bracket after it is released, we have 63 games to pick (excluding the play-in games). So instead of thinking about the bracket as a whole, let's break it down into a smaller problem: pick the winner of a single game. 
                If we can come up with a consistent rule to pick the winner of a game, then we just have to use that rule 63 times! 
                So let's think of some basic rules and how well they would do. For these rules, let us say each game is between Team A and Team B.
                <br />
            </div>,
            <div>
                <br />
                <h4>Rule Idea #1: Flip a coin</h4>
                This is the easiest rule in the book we can use! Fair. Unbiased. So how do we use it? Let's go ahead and define the rule as:
                <ul>
                    <li><i>If the coin lands on heads, then Team A wins</i></li>
                    <li><i>Otherwise, when the coin lands on tails, Team B wins</i></li>
                </ul><br />
                <h6>So what's the machine learning used here?</h6>
                The goal of rule #1 is to decide if the winner is “Team A” or “Team B”. These are the two possible outcomes of the game. Another word we can use instead of outcomes here is <b>classes</b>. 
                When we flip the coin, we put the game into one of the two classes: “Team A Win” or “Team B Win”. In machine learning, this is called <b>classification</b>. 
                So in our case here, the coin is our “machine learning classifier”. It is “predicting” which “class” the winner is: “Team A” or “Team B”.
                <ImageSet sources={[CoinClassifier]} />
                <center>(Note: we aren't making predictions here, this is just a function)</center>
                <h6>Applying Rule #1</h6>
                We have a 50% chance of predicting the correct winner of an individual game. Not really much to look into here.
            </div>,
            <div>
                <br />
                <h4>Rule Idea #2: The winner is whichever team has the better seed</h4>
                This is a pretty straightforward idea that performs decently well historically! This rule is extremely biased, which is the purpose of using it. The bias we are using comes from the committee seeding the teams. 
                The committee is made up of experts who take time to study and evaluate each team individually, and the seed they assign a team reflects how good they believe the team to be. If we are to trust these experts, we could use this simple rule.
                This rule is extremely easy to use, but we run into the problem of what to do when we encounter a game between two teams of the same seed, for that, let's just pick a non-biased comparison like the name of the team's mascot.
                <ul>
                    <li>If Team A has a lower seed than Team B, then Team A wins</li>
                    <li>If Team B has a lower seed than Team A, then Team B wins</li>
                    <li>If Team A and Team B have the same seed, choose whichever team's mascot comes first alphabetically</li>
                </ul>
                <ImageSet sources={[SeedClassifier]} />
                <center>(Note: the way we describe this “classifier” is still just a function that we can write the outcome to)</center>
                <br />
                <h6>So what's the machine learning used here?</h6>
                Rule #2 requires us to think about the teams we are comparing. We need two pieces of information about each team: their seed and their mascot. 
                Each piece of information is called a <b>feature</b> in machine learning. 
                Previously, in rule #1, our “classifier” didn't need any information to “predict” which “class” the game fell into. 
                Now, we are going to use two features for each team to “predict” which class the winner is: “Team A” or “Team B”.
                <br /><br />
                <h6>Applying Rule #2</h6>
                Since we have a function we know the outcome to here, we can take a look at last year's tournament to see how well it would have done in 2021. 
                Let's start by taking a peek at results from the East Region.
                <ImageSet className="flexItem" sources={[EastRegion_2021]} />
                Looking at the top half of the regional I am feeling really good about this rule and then…what happened? 
                Well, between an 11 seeded UCLA Bruin team making an incredible run to the Final Four and a 59% free throw shooter hitting two free throws with 1.2 seconds left to beat Texas: we got March Madness'd.
                <br />
                However, looking at the tournament as a whole, we got 66.7% of games correctly classified with our rule! That is looking back at each game individually. 
                If we had been picking from an empty bracket, like we'll be doing this year, we would have only picked 50.8% of the games correctly. 
                So we've got to get smarter about this if we're going to beat our friends this year.
            </div>,
            <div>
                <br />
                <h4>Rule Idea #3: Team Stats</h4>
                The introduction of information (aka <b>features</b>) gave us a better compass to follow in Rule #2. Right now, we use a small amount of information which allows us to have an easier rule to determine the winner. 
                What if using more information, requiring a more complex rule, gives us better results? Luckily, concerning college basketball, there is a seemingly endless amount of data about teams: strength of schedule, points per game, points allowed per game, free throw percentage, 3pt shooting percentage, etc. 
                Those could be thought of as useful pieces of information. Let's just try using our previous two features with a couple of these new ones. What does our new “classifier” look like?
                <ImageSet sources={[Rule3Diagram]} />
                Well, we've got our inputs, but think of how many ways we can write a rule to decide the winner. Let's recall how we approached this in Rule #2, we started at the top of our set of information and worked our way down:
                <ol>
                    <li>Compare team seeds</li>
                    <li>If tied, then compare the alphabetical ordering of the team mascots</li>
                </ol>
                If we think about what we are doing in our mind here in step 1, we are thinking about the team as a function. We are comparing the value of the two teams. 
                Instead of “Compare team seeds”, let's think about it as “Compare team values”. It just happens that we saying <b>the value of a team is its seed</b>.
                If we could bust out our 8th-grade math books and write a function to say this, it would be: <br /><br />
                <center><i>Value(team) = seed</i></center><br />
                I know this would seem to be the opposite of what I am saying since a lower seed means a better team, but for now, think of seed as 17 - seed (e.g. a 1 seed would have a value of 16 and a 16 seed would have a value of 1).
                So to make use of this new information, we could end up with something like:<br />
                <center><i>Value(team) = seed + (Strength of Schedule) + (Points / Game) - (Points Allowed / Game) + (Free Throw %)</i></center><br />
                Great! Using more information, we have to be doing better…right? To figure out, we'd go back to evaluating how we did against the last tournament as we did in rule #2. 
                With this new value for the team, maybe we catch some insight we might have missed, like if UCLA played a tougher schedule which helped them get ready for a high-pressure game.
                <br /><br />
                <h6>Applying and Improving Rule #3 by Example</h6>
                Now that we have a more complex rule, let's think about how we will build it piece by piece for the East Regional above.<br />
                Say we know that the strength of the schedule will help us correctly pick the winner of UCLA vs BYU, so we add it first to our team value function.<br />
                <center><i>Value(team) = seed + Strength of Schedule</i></center><br />
                Unfortunately, we forgot that Georgetown's strength of schedule is really high and it incorrectly picks them to beat Colorado. So for those two games, our old seed rule has the same score of 50%. 
                Instead of throwing that stat in the trash can, let's think of another way to allow this information in without it ruining our other prediction. If we just divide the strength of schedule by two, it allows us to still factor that statistic in and we pick both games correctly.<br />
                <center><i>Value(team) = seed + (1/2)*Strength of Schedule</i></center><br />
                Looking at the rest of that East Region with this rule, we don't miss any other games accidentally. Since we are predicting 1 more correct winner with this rule across this region, let's improve upon it. But let's not just improve upon it, let's get greedy. 
                We know Abilene Christian had the #1 Team Defense Efficiency according to TeamRankings.com, so let's use that to our advantage to predict the coveted 3 vs 14 upset over Texas. Since we only have points allowed per game as a feature, let's multiply it by -1 to give a higher value to teams that allow fewer points per game.<br />
                <center><i>Value(team) = seed + (1/2) * Strength of Schedule + (-1) * Points Allowed / Game</i></center><br />
                This new team value function gave us what we wanted: predicting Abilene Christian to upset Texas. However, we lost predictions on others that we had previously picked correctly. Now we have to go through all the games again and adjust our team value function to account for them. 
                How we are going to make these adjustments is by just changing the numbers we multiply each statistic by. For example, we changed Strength of Schedule's number from 1 to (1/2).
                After way more math than any of us wanted to do, we did it.<br />
                <center><i>Value(team) = (0.8)*seed + (0.4)* Strength of Schedule + (-0.5)* Points Allowed / Game</i></center><br />
                You can see that getting this upset correct while also predicting the other winners took some changes to how we use all the statistics. As long as we have more statistics at our disposal, the resolve to do enough math, and time to run the numbers, we could hopefully reach some rule that predicts the entirety of the East Region correctly. 
                We could even take a step back past that and try to build this team value function that predicts the entirety of last year's tournament correctly.
                <br /><br />
                <h6>So what's the machine learning used here?</h6>
                Rule #3 took some massive steps into the world of machine learning, some of which are too complex to even mention here. The most basic and most important step we took was thinking about our problem through the lens of math. 
                The fundamental idea of using a function to define the value of a team is foundational to machine learning. As we were selecting the statistics that we wanted to use in our team value function, we were going through the practice of what is called <b>feature engineering</b>. 
                The numeric value that we put in front of different statistics (aka <b>features</b>) are called weights in machine learning. Finding the best weights to maximize the number of correct predictions is the process of <b>training (aka fitting)</b> our model. 
                Creating a value for each team and comparing those values to determine the winner of the game allowed us to quantify if we were getting better or worse at predicting. In machine learning, the <b>loss function</b> is this terminology for determining how close you were to the expected predictions.
                <ImageSet sources={[Rule3Classifier]} />
                <br />
            </div>,
            <div>
                <br />
                <h3>The Bigger Picture</h3>
                Looking back at our rule #3, we could take as much time adding more stats and adjusting weights to get the rule picking 100% of last year's tournament game winners correctly. The problem is: when you kick back and look proudly upon your work, would you really be confident picking the 15 seeded Oral Roberts to beat the 2 seed Ohio State when the bracket comes out this year? 
                It's okay to be confident if you are because it happened, but you might end up distraught when this year that rule instead picks the upset over a team like the 2 seeded Villanova in 2016 who went on to win the National Championship. This is just to say, defining a one size fits all rule is difficult.<br />
                Having built ML models for the last two March Madness tournaments, you gain an even deeper appreciation for the upsets, buzzer-beaters, and each shining moment. 
                In 2019, my model beat me to finish in 1st place in my friend group's pool and in the top 81% of ESPN brackets. 
                In 2021, I beat my model by finishing in the top 98% while my model finished in the top 78%. <br />
                In part #2, coming out later this week, we are going expand on the rule #3 classifier through visualizations and dive into actually building a model like this for the 2022 March Madness Kaggle Competition. Hope to see you there! <br />
            </div>
        ],
        image: [MMBracket]
    },
    {
        id: 5,
        visibility: "public",
        featured: true,
        title: "YDKYK March Madness Pt 2: Win Probability ft Super Bowl Sunday",
        date: "2/9/2024",
        preview: "Waiting for Selection Sunday? Using Super Bowl Sunday to look at ways that Las Vegas, and you, can think about win probability come March.",
        content: [
            <div>
                <p>It's 37 days until Selection Sunday, so something has to distract us while we wait to fill out our brackets. Luckily, Super Bowl Sunday serves as an effective warm-up to put us in the right mindset.</p>
                <p>In our previous article, we walked through the assigning a value to a team that represents how good they are. This was so we could use these numbers to predict which team would win when they face each other. In practice, building a model that predicts the winning team in a matchup will typically output the <b>probability</b> of each team winning.</p>
                <p>Las Vegas, the host site of this year's Super Bowl, happens to be home to the most profitable builders of these models: sportsbooks. Let's see what these experts are saying about the Kansas City Chiefs and San Francisco 49ers chances of winning.</p>
            </div>,
            <div>
                <h2>The Most Common: Spread and Moneyline</h2>
                <p>When you hear about the Super Bowl, you are likely to hear about the spread and moneyline. These are the two most common ways to bet on the outcome of a game. The spread is a way to bet on the margin of victory, while the moneyline is a way to bet on the winner of the game.</p>
                <h4>Win Probability from the Moneyline</h4>
                <p>The moneyline is one of the simplest ways to look at probability these sportsbooks give each to win. As of today, the 49ers odds are -125, meaning you would have to bet $125 to win $100, and the Chiefs odds are +105, meaning you win $105 on a $100 bet. To find the win probability from these, we have to use the equations below: </p>
                <ImageSet sources={[OddsToProbs]} />
                <p>With the 49ers having negative odds, we use that equation to find this sportsbook gives them a 55.5% probability of winning. And the Chiefs, with positive odds, have a 48.8% chance.</p>
                <hr />
                <h5>My Mom Hates Gambling, and the Math is on Her Side</h5>
                <p>You don't have to be a mathmatician to realize that 55.5 and 48.8 add up to more than 100%. To be more precise, the odds of 55.55% + 48.78% = 104.33%. This 4.33 above 100% is what is known as the "Sportsbook's Vigorish", or "Vig" for short. This is how they make money at scale. As long as their models can evenly distribute bets to each side of these lines, the only goal they have is to drive more betting volume.</p>
                <p>If we see this as a "tax" to betting on either team, we can subtract half that tax from each side to get their models probability. This assigns a "vig" adjusted win probability of <b>53.39% to the 49ers</b> and <b>46.61% to the Chiefs</b>.</p>
                <p>So when you are placing a bet, like the Chiefs Moneyline, they are making you pay an additional ~2.165% on top of what their <b>world-renowned</b> models have projected. So if your mom hates gambling too, just know she has probably ran the numbers.</p>
                <hr/>
                <br />
                <h4>Win Probability from the Spread</h4>
                <p>While the moneyline can be thought of as a direct bet on win probability, the spread is a bit more complex due to it being a bet on margin of victory.</p>
                <p>The spread is currently at 49ers -2 at -105 odds, and Chiefs +2 at -115 odds. This is an example of the sportsbook using "the vig" to make bettors pay a higher tax on the Chiefs losing by 2 points or less than the Niners winning by 2 points or more.</p>
                <p>They could be adjusting this to protect themselves because they see too many bets coming in on the Chiefs side. Another reason might be that their margin of victory model says the 49ers are expected to win by a fractional amount, like 1.8 points. So why not see if we can dive even deeper.</p>
            </div>,
            <div>
                <h4>Deriving Spread and Win Probability from Team Totals</h4>
                <p>Some books provide "Team Totals" bets that give us some insight into the spread.</p>
                <p>The Team Total odds are setup so you can bet if a team will score over or under a point total. We took the odds each team scores less than the points and converted to probabilities the same equations above to get: </p>
                <ImageSet sources={[TeamScoresLessThan]} />
                <p>So let's build a margin of victory model from this. In the world of statistics, this data above can be looked at as a Cumulative Distribution Function. This is important because it means we know how to convert this data into "the probability each team scores X points" by converting it to a Probability Density Function.</p>
                <p>The math behind this is less impressive than you might think. To find the probability that the Niners score <b>exactly</b> 14 points, we can just subtract the probability they score less than 13.5 points from the probability they score less than 14.5 points. We'll do this on all of the data they give us, from 14 through 33 points, for each team.</p>
                <ImageSet sources={[TeamPointsPDF]} />
                <p>So now that we have a model that can predict the probability of each team scoring an exact number of points, let's use it to calculate a probability of each score (except ties). We are going to use this so we can build out the full probability of each margin of victory. Because we are going to have to do this for each of the 380 combination of points that are not equal, we can look at just a couple of them.</p>
                <p>The probability that the Niners score <b>exactly 15</b> and the Chiefs score <b>exactly 14</b> is ~0.05045%. Considering margin of victory to be 49ers score minus the Chiefs score, it is +1 in this scenario, so we will add .05045% to the probability of a +1 margin of victory. The probability that the Niners score 17 and the Chiefs score 24 is ~0.14%, so we add that 0.14% to the probability of a -7 margin of victory. After doing this for all 380 combinations, we get the following probabilities for each margin of victory:</p>
                <ImageSet sources={[ProjTeamPtsMov]} />
                <p>The blue line is our probability for each margin of victory for the 49ers (where left of the black line is negative meaning the Chiefs win). The red line of this graph is what our projected spread is based off this data.</p>
                <p>To get this value, we peform an expected value calculation by adding together each margin of victory multiplied by the probability of it happening as shown below: </p>
                <ImageSet sources={[ProjSpreadCalc]} />
                <p>This is how we got our value of 0.38, which is suspiciously lower than the 2 that the sportsbook is offering. If you add together all of the probabilities for these margins of victory, you'll realize we only have a total probability of 0.47, meaning we are only calculating margin of victory for less than half of the real possible outcomes. Which makes sense because we aren't thinking about the cases where either team scores less than 14 or more than 33 points. So how can we handle this?</p>
                <hr />
                <h6>Forging our Own Path</h6>
                <p>Since we don't have access to the sportsbook data outside of this range, we are going to have to build out our own probabilities. A simple approach is to establish limits where there is absolutely no chance of scoring below a certain point and where there's certainty of not scoring above a certain point. We're certain that neither team will score fewer than 0 points. Determining the upper limit is more complex, but for the sake of this analysis, we can say that neither team will score more than 50 points.</p>
                <p>With those bounds, we can look at different ways to interpolate the probabilities of scoring points between 0 and 14, and also between 33 and 50.</p>
                <ImageSet sources={[CDFTailInterp]} />
                <p>There are more robust ways to model these probabilities, but using a simple linear interpolation can help us get a more accurate spread and win probability.</p>
                <hr />
                <p>After rerunning our margin of victory probabilities with our new bounds of 0 and 50, we get a better margin of victory model that is evaluated on 95.9% of the possible outcomes. Our new projected spread inches closer to what Vegas has: </p>
                <ImageSet sources={[FullProjSpread]} />
                <p>With our derived margin of victory model, we can also use this to find the win probability for each team by looking at the total probability on each side of the black line. This gives win probabilities of ~52.115% to the 49ers and ~47.885% to the Chiefs.</p>
            </div>,
            <div>
                <h3>And Back to the Waiting</h3>
                <p>Using the Super Bowl as a warm-up to March Madness, we were able to see how sportsbooks use the spread and moneyline to give us insight into the win probability of each team. We also saw how we can use the team totals to build a margin of victory model like Vegas to calculate a spread and win probability.</p>
                <p>So now we just have to figure out other ways to spend the next 37 days while we enjoy this last month and change of the regular season.</p>
            </div>
        ],
        image: [SBLogo]
    },
    {
        id: 6,
        visibility: "public",
        title: "Asking my Front End Copilot for some 3D Help",
        date: "3/1/2025",
        preview: "Getting further and further from the front end as my career progresses, ",
    },
    {
        id: 7,
        visibility: "public",
        title: "The Curious Case of the Rolling Tide",
        date: "3/26/2024",
        preview: "Our 2024 Base Model for the NCAA Tournament has done well so far, but",
        content: [],
        image: [MMBracket]
    },
    {
        id: 8,
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