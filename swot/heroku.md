# Strengths

##  Maturity of Features and Offerings

There is a BIG difference in creating an RDS instance and a Heroku Postgres instance, and Heroku absolutely nails providing a mature featureset and configuration for all of their offerings.  "A web app with a database and some caching" is super common and when you run the three commands needed to set that up, you have something mature, scalable, secure, and reliable.  All without having to know how the underlying infrastructure is managed.

The router and Logplex are incredibly mature and featureful.  Creating these sorts of things in AWS is not easy and not cheap.  Logging alone can eat up quite a bit of time and money and with Heroku it's just there and just works.

If you think the value Heroku provides is git-based deploys, you are very, very wrong. When Stitch Fix migrated away from Heroku due to our scale<sup>&dagger;</sup>, I led the team that did that migration to AWS.  Just handling the small number of use cases we had required a lot of decision-making, a lot of tuning, and a lot of care to set it up.  The team was three engineers and that was too lean.

Observing this process is a great way to understand the true value of Heroku. You get properly configured, properly monitored, high-performing infrastructure without having to make hardly <strong>any</strong> decisions.  And a huge team that supports it.

<sup>&dagger;</sup><span class="f7">The very short explanation is that we needed Private Spaces and it was in beta at the time and extremely limited. The way we'd designed our systems just wouldn't work with the way Private Spaces worked at that time.  If Private Spaces had shipped earlier or Stitch Fix was starting now, I'm confident we could've used Private Spaces and would still be on it now. The platform performed well and there was never a thought that we'd get better performance by migrating.</span>

##  Stability

This platform is rock solid, experiences few outages, and generally works as advertised if not better.

##  Value for Small-to-Mid-Size Teams

If you look at true cost of ownership, which includes the people and expertise needed to run your own infra as well as all the opportunity costs and carrying costs of doing so, Heroku is a far better deal than AWS for small-to-medium sized teams, and possibly even for larger teams, depending on the workload.

Having a solid foundation of feature-rich tools, supported by a large and responsive team is a helluva lot for $7/month per dyno.  Once you start running your own infra, you'll need at least a three-person ops team for redundancy and upkeep, and the defaults for analogous AWS services are FAR from on par with Heroku's defaults—you need to know AWS deeply to get parity. Oh, and you have to shell out for Enterprise support from AWS, because that's the only way to get your questions answered.

##  Support

Their support is probably one of the best I have experienced.  Every ticket, no matter how insignificant, from customers that are probably not generating margin, gets answered and answered deeply.  They can and will escalate issues to the actual engineers on the products in order to get your question answered.  This is not common at their scale.  AWS Enterprise support is not this good…at all.

##  CLI 

The CLI is quite excellent, feature-rich, and is a model for how to build CLIs.  It can update itself and is easy to script.  It's fast and rock-solid.

## API

Just about every feature of Heroku is available via their API (the CLI uses the API).  This means that you can fully automate just about anything you like.

##  Managed Datastores

Heroku Postgres is best of breed, super mature, highly performant and easy to use and manage.  I was very happy when they added their own Redis, because it means that you can have the majority of the infra you need provided and supported by Heroku.  In particular, both datastores allow automated credential rotation, which is a feature that <strong>many</strong> SaaS companies do not provide.

Dataclips is a great feature to get some reporting up and running quickly, and the "pgextras" command line plugin shows detailed information about your database without having to dig through Postgres' complicated metamodel.

##  Elements / Add-ons

The ability to browse a ton of services and install them with one click is <strong>huge</strong>.  They have built a very sophisticated and user-friendly system here, and it truly enables teams to solve problems with new tools or just get up and running with something familiar, all without creating new accounts, managing payments, or even configuring much in your app.

This may not be great for commoditized services but it's awesome as a user.  Stitch Fix used RabbitMQ via an add-on and that provider experienced a total loss of all their infrastructure.  A few minutes later we had switched to their competitor and went on our merry way.

Even though this example shows the downside to add-on providers, the Elements Marketplace still seems like a great marketing channel for "try before you buy" for any piece of infrastructure Heroku does not provide.

# Weaknesses

##  Enterprise Features Require Phone Calls and Price Negotiation

Private Spaces, HIPAA, and several other features useful for anyone—not just big companies—require an enterprise agreement and sales calls.  I would be surprised if there is a technical reason that is true, so this means that any company willing to sign a BAA without sales calls has potential to eat marketshare.

Imagine if Render creates a single-click private network solution and a signed SOC-2?  Why would anyone want to have a phone call with Salesforce Enterprise Sales vs. clicking a few buttons in a UI?

This is a double-whammy for companies in a growth phase.  It's extremely hard to predict infrastructure needs while growing, but the Heroku Enterprise process requires yearly commitments to do so (or it did they last time I interacted with it—how their Enterprise offering works at all is completely hidden).

##  Noisy Neighbors Expensive to Eliminate

Until you pay for performance dynos, which are overprovisioned for many use-cases, you won't have dedicated servers and you <strong>will</strong> hit "noisy neighbor" issues where your app inexplicably fails to perform for a brief amount of time.  Diagnosing and eliminating noisy neighbors is hard and exists on any cloud platform.

This means that if you are designing your app to horizontally scale with standard dynos, you will forever be marred by this problem.  Your alerting will always be noisy and your team will eventually ignore real issues because of alert fatigue.

##  Docker Support Awkward

Heroku suffers from first mover advantage, having built their own kinda-Docker-like-thing called buildpacks.  While they have tried to get traction with that concept by open-sourcing it, Docker/containers currently dominate the rest of the world.

Heroku <strong>does</strong> support deployments with Docker, but it's extremely awkward to use.  For each process type you must make a separate image, even if the only difference is the command line invocation used.

At Stitch Fix, we built a Docker-based deploy that used <code>Procfile</code>s the same way Heroku-without-Docker does. Our infra would schedule a given image, but use the <code>Procfile</code> to determine the command to run. The same image powers web and background jobs, as well as rake tasks and other one-off needs.

Why didn't Heroku build their Docker support this way?

##  Infra-as-code Support Lags API and CLI

Heroku Terraform templates don't let you do everything, and some don't even really work (you cannot upgrade datastores using Terraform).  Their API is powerful, but Terraform is a very common standard for managing infrastructure and it sucks to be able to only use part of Heroku from Terraform.

##  Scheduler

Heroku Scheduler seems to have not been touched since 2013.  It is not reliable and does not scale.  There is no guarantee that your jobs will run on time or at all (and they don't always), and there is no way to observe its behavior or get errors. The web UI completely fails to scale because it truncates the commands and doesn't allow sorting.  And you have to convert everything to UTC.

It feels very beta, and I think it should be retired if they aren't going to make it better.  Everyone using Heroku should use their tech stack's cron-like service and just skip the scheduler.  It's a shame because running scheduled jobs is <strong>hugely</strong> useful.

##  Data Stores Exposed to Public Internet

In the Common Runtime, all data stores (Postgres, Redis) are available over the Internet, protected by a password.  These data stores <strong>do</strong> offer credential management and rotation (and they do so far better than competitors), but it does mean that if someone leaves your company, you have to rotate all the credentials of all datastores.

The only way to avoid this is to use the Private Spaces product which, as mentioned above, requires sales calls, price negotiation, and year-long contracts.  I don't think this is the only technical solution to this problem, and I would bet that many teams would happily pay extra to ensure that only their dynos can access their datastores and not have them on the public Internet, even if such a setup isn't SOX or HIPAA compliant.

##  Metrics/Monitoring

Heroku have added more metrics and monitoring over the years, but it's still in the vein of "useless information that makes nice graphs".  We DO need to know when we are hitting memory and CPU boundaries so we know to scale or refactor, but the current offering isn't all that useful, especially for non-web processes. 

To put it bluntly, you cannot use Heroku without also paying a third party APM or observability vendor.  Why Heroku is happy to just let this money go straight to New Relic is beyond me.  New Relic is not a good service, and Heroku could certainly build something of this level of quality and keep us on their platform.

## The Global App Namespace

This may sound like a minor annoyance, but when you have more than a few apps in your Heroku organization, it becomes very difficult to manage them.  You have to make your own namespacing to ensure that your app names are available, since Heroku's apps are named from a shared global namespace.

If you are in the dark ages of using a staging environment, this, too, must be namespaces, so you end up with `acme-www` and `acme-www-staging` and run out of letters real quick.

##  Heroku Marketing

Most developers think Heroku is toy.  It is not. I met with a junior dev at a startup who was setting up fucking <strong>ECS</strong> to run his tiny app that was in beta and serving < 100 users.  He thought Heroku was not a serious consideration. I told him that Stitch Fix almost went public on Heroku and that it would absolutely work for his use-case.  I asked him to give a try.  He later told me that after an hour he had migrated everything from AWS to Heroku…and was very happy about it.

This perception exists because Heroku either doesn't do any marketing or markets to…I guess legacy enterprise?  I realize legacy enterprises have tons of money, but there is an entire generation of developers who will be leaders and decision makers in a few years who think Heroku is a toy.  The fact is, a team can go from startup to going concern on Heroku and this is not something Heroku successfully promotes.

Why is there no chart on their website that explains the true cost of ownership of an AWS-based deployment pipeline? Why does the homepage say nothing about what Heroku actually is or does?  Perhaps the startup market isn't large, but it is by definition growing.  Successful startups become big companies. Unsuccesful ones mint engineers who will make decisions at their next job and you want them choosing Heroku.

# Opportunities

##  Eat Vercel, Netlify, and Friends for Lunch

If you think of what's needed to build, deploy, and maintain a web app these days, it's not just a ball of React and a Firebase connection, but a solid database, observability, background workers, caching, etc etc.

Heroku provide the best-in-breed of 75% of this: the backend, deployment, monitoring, security, routing, and networking.  This used to be 100%, but front-end tools and techniques have now come to be a bigger part of any app, and the Vercels of the world want to be the Heroku of that 25%.

This is Heroku's opportunity: commoditize this by providing a Heroku-like developer experience for the new 25% of front-end.  Push a button and I have a Webpack-powered, CDN-hosted React app making API calls to a Postgres database.

Heroku can then differentiate its new commodity by providing best-in-class front-end observability.  The observability space with front-end <strong>sucks</strong>. New Relic is useless. Honeycomb says roll your own.  And Vercel's analytics <em>marketing</em> page has some of the worse front-end performance I've seen, so what does that say about their offering?

##  Postgres as GraphQL/SPA API

While the JAMStack architecture is not appropriate for many use-cases, there is a lot of excitement around using GraphQL as a backing API for multiple views (e.g. iOS, Android, Web).  Managing GraphQL is no joke and most teams aren't equipped to do it or do it well.  Even the armchair devops can't claim AWS has a cheap version!

Heroku could leverage their Postgres expertise and provide a sophisticated, performant, managed GraphQL on top of Postgres.  Why
comb through something like Apollo server and re-learn <strong>it's</strong> way of doing things when you already know and can
rely on an RDBMS like Postgres?

This would be a huge unlock for a ton of teams who can't afford to hire 30 mobile developers to build their app. It would also allow a clean mixture of the often messy front-end state management with sophisticated and reliable data modeling of the back-end.

##  Canary Deploys

Manually examining a staging app and clicking a deploy button is not the best way to ensure the quality of code to be deployed.  But it's easy to understand and set up.  A much better approach are so-called "canary" deploys where your new code runs alongside the old and has limited traffic routed to it.

Setting this up can be difficult because there's a lot of ways to do it, and it requires a pretty heavy investment in tooling across the entire stack to make it work well.  Heroku are positioned to provide a solution, because they <em>do</em> control the entire stack and <em>don't</em> have to support a milling AWS services.

They have the foundation: dynos, autoscaling, the router, preboot, and metrics.

##  Dataclips 2.0

As great as Dataclips is, it's fragile and hasn't been given a lot of attention.  The rich editor is absolutely horrendous. There is no way to manage the SQL and if you don't save a copy you can lose it forever.  The integration with Google Sheets constantly breaks (which is not Heroku's fault, but still a reality of the Dataclips as a product).

The opportunity here is to make something better that a team can grow with.  When you outgrow the current Dataclips product, your options are either build your own or pick up the phone and call Looker while praying to God Google doesn't fuck it up.

Tools like Looker and way overkill for what most teams need and Heroku could absolutely fill this gap with a first party "run SQL into a CSV with some graphs" that is managed better than Dataclips.  Developers would pay for this.

##  First-party Observability

That I had to install and setup New Relic makes me so sad. New Relic is absolutely dreadful, but there isn't really any other option to get any measure of observability on Heroku.  

As platform owners, they have very good and very reliable intel into what's running on their platform. They have the experience to make things "just work", so why not do this with observability?  Hell, buy Honeycomb.

Now, when you also look at the opportunities around GraphQL and JAMStack, Heroku could quickly become <strong>the</strong> name in front-end observability.  The front-end observability story sucks and sucks hard. New Relic is useless. Honeycomb says roll your own.  And by god, go to Vercel's analytics page and weep as your maxed-out 2021 computer's fans spin up a cyclone and your browser stops scrolling properly.  Anyone interested in front-end observability should look at that page and get to work putting it out of business.


##  Serverless

While Heroku dynos are not servers, the main thing that "serverless" means is: responding to infrastructure events managed by the platform.  Heroku could push the envelope here.  Lambda and friends are a nightmare to configure, deploy, and manage. The pricing is byzantine.

Instead, why not let Kafka trigger my code when an event happens?  Why not trigger my code for router events or even Postgres events!  Because Heroku's offerings are far fewer and more focused than AWS, they have an opportunity to define the happy path of serverless and make it accessible to a lot of engineers.

##  More First-party Infra

Why is there no Heroku equivalent of S3?!?!?  Why is there no Heroku CDN? Heroku SQS?

##  Heroku-powered Dev Environments

Local dev sucks for everyone.  Most "developer tools" startups are focusing on deployment, writing code in a web browser, or fixing Javascript tooling.  What's missing is "How do I get everything set up to run the app I work on?".

Heroku have all the tools needed to start solving this problem.  One could imagine with minimal configuration, a developer could spin up a low-end Postgres, Redis, etc, seeded with reasonable data refreshed often for local dev, and in a way that it spins up and down as needed to minimize cost.

# Threats

##  Salesforce

Salesforce has left Heroku alone for a while.  And then this year we all had to start logging in a LOT and see a big nasty green checkmark under a Salesforce URL.  Salesforce meddling is not good for Heroku and not good for Heroku customers. No good comes from this.

##  Render

Render are making a product very similar to Heroku, and they have the second-movers advantage of being able to build on     more modern infra.  They also can essentially cut off the enterprise product by offering it self-serve. Now, it could be that for reasons I'm not aware of,  Render are <strong>also</strong> doomed to an Oracle acquisition and enterprise phone calls, but this isn't guaranteed.

Render could, if they wanted, position themselves as <em>the</em> PAAS for startups. This would leave Heroku with lucrative but uninspiring legacy enterprise clients only. They'd eventually fade away into a tiny little feature blurb on Salesforce's webpage.

##  Vercel, Netlify, and Friends

These companies aren't constrained by Salesforce and they are captializing on current fashion trends in app development.  That means they are getting developer mindshare and, when the JAMStack lie comes crashing down, will probably be a in good position to expand their offerings.  Imagine if Netlify launched a managed GraphQL backed by a real database like Postgres.  Suddenly, they become a platform for a <em>ton</em> of developers to deploy apps backed by a powerful datastore that can be integrated into any backend.


##  Carrying Cost for Supporting Pipelines and its Legacy Workflows

The addition of the various Pipelines features made me extremely worried for  Heroku's roadmap. To be honest, this is probably the single biggest indicator that they are targeting entrenched legacy customers, because no modern deploy pipeline should have manual buttons to push to promote code.  Heroku should be modeling a better way to do things, not acquiring carrying cost operationalizing outmoded concepts.

This is a threat because they must support these features as they grow and expand their product.  I can't imagine anyone is enthused about this, and it's confusing at best for new customers.  I mean, they have freakin' <strong>staging</strong> listed as part of a "continuous delivery workflow".  Yech.

