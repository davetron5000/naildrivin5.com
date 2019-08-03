Been thinking about the right "tech stack" for a new team or new company.  In particular, a company whose product isn't software per se, but that will need to rely heavily on it for their success.  Further, this would be a web-based application. What I want to explore is what the table stakes are for a tech stack today.  What basic problems around development, testing, deployment, and operations do you need to have a solution for, just to get to market.  What's interesting is that vanilla Ruby on Rails includes almost all of it.

But I digress.

This isn't "One Framework to Rule Them All", so it's important to set a bit of context.  The assumptions I'm
making are:

* A team will create a public-facing website as well as internal tools and a mobile app
* Most features involve taking input, performing a business process, storing data, and producing output
* The team and organization will have growth, changes in direction, and all the other stuff that happens over
  several years
* Speed of delivery is important, which implies quality must be high enough to keep the team focused on
  delivering value (vs. fixing problems they created by going "too fast").

To me, this is a pretty standard set of constraints, but I admit that I view it as such based on my experience.

OK, so given all of this, what problems do we need to solve?

Let's break these down into four categories:

* *development* which allows us to create or modify features
* *quality* which is how we verify features work as desired
* *deployment* which is how our changes become real and start to actually solve the problems they are to solve
* *operations* which is how we understand the real behavior of these features

## Development

At a base level, we need to be able to edit code and run it outside production.  We need to be able to share our
code with the team without deploying it to production.

Beyond that, we need to have an application architecture.  An _application architecture_ answers questions like
"Where does code go?", "How should we name things?", and "How do we access external dependencies like user input
or databases?".

To answer these questions, we have to have some sort of understanding of the internal structure of our
application.  A web based application will need to provide structures for a request/response cycle:

* Receive HTTP requests from a client (browser)
* Access the parts of the request and trigger logic
* Render a response, including dynamic HTML

Each of these will require some code and conventions:

* How do we associate a route and HTTP method with code that should be triggered?
* How should we parse the query string, request body, and headers?
* How do author dynamic HTML?  How is data exposed to it?
* How do we structure the so-called business logic that happens between the request and response?
* How do we manage sophisticated view logic that requires client-side JavaScript and CSS?
* Do we need background jobs, and how are the managed?
* What other external systems do we need to interface with (e.g. messaging, third party payments, etc.)

And once there are answers for these, we have to consider developer workflow:

* How do populate data stores with realistic data?
* When I change code in my development environment, how do I see my changes?
* How do I set up any third party external dependencies?

This is all just to be able to write code.  Most high performing teams have automated quality controls (e.g.
tests).

## Quality

The internal architecture of an application *has* to be informed by the testing techniques the team wants to
use.  Thus, there must be some understanding of exactly how quality is controlled.

* Is there coding style?  How is it enforced?
* Are there conventions around code coverage for tests?
* What tests should the team write?  Should there always be a unit test for every module/class/function?
* How do integration tests work?
* How do end-to-end/acceptance/full-stack tests work?
* How do we handle third party and external dependencies when running tests?
* Do we do code review?  How?
* How is quality assessed by non-developers?  How does a "stakeholder" or approver examine the work and decide
  that it's done?
* What level of quality is required to deploy changes to production?
* How do we write our code and design our UIs so that we can test them?
* What about performance and security?

Once these questions are answered, there must be tools and conventions available to do all of this.  And since
much of this would run in a development environment, tooling must be chosen, configured, or designed to deal
with that reality, i.e. how does a developer run the tests in their development environment?  

Once we have that, we now have to get the code in front of actual users so it can solve the problems it was
created to solve.

## Deployment

Production is all that matters, and code that's not in production might as well not exist.  So how does it get
there?

Specifically:

* What is the mechanism by which all parts of the application are executed?
* What do we expect to exist on the operating system/deployment system that our application can rely upon?
* How do we manage parts of the OS that we can't assume will just be there?
* What pieces of infrastructure (e.g. web servers, load balancers) need to be in place beyond just the application's deployable artifact (source code, compiled binary, etc.)?
* How is production configuration managed, e.g. secrets, feature flags, etc.?
* How do we manage changes to external systems that must be in sync with the application's code, for example changes to the database schema?
* Does deployment require downtime?  If not, how do we manage multiple versions of the application running at the same time?
* Can we undo a deployment? How?

And, of course, it's not sufficient just to get it up in production, we also have to make sure it stays up.

## Operations

Operations involve everything required to understand the behavior of the application(s) in production.  This is
a potentially deep topic, but I think the barest of requirements would be:

* How do we know if the application is running?
* How do we know if the application is running correctly?
* If our application fails, how would we know about that?
* What level of detail can we know about our application and related infrastructure?
* How do we know that the systems that monitor all this are themselves working?

## Table Stakes

The above four sections are the absolute minimum questions an engineering team must have an answer for.  And,
I'd say further that a team looking to switch technologies or provide an alternate tech stack should have
answers for all of these before they write one line of production code.

Which leads to a few more questions a team has to answer:

* How does the team ensure that the conventions we've agreed on are followed?
* How do we handle situations where our existing conventions don't provide guidance on what to do?

These are critical, because conventions that aren't followed are worse than useless, and inconsistency across
codebases or within applications can be a huge productivity killer.  What you want is an engineering team that
can focus on the business problems they exist to solve. You do not want them constantly re-assessing or
re-litigating tooling and library choices.

I have seen a team decide that the blessed stack wasn't for them, and then spend literally years arriving at
answers to the questions above.  In the interim, they maintained and operating several codebases that were not
only inconsistency between each other, but also inconsistent inside the codebase.  And these applications were all solving similar classes of problems. I often wonder how much more value the team could've delivered had they either answers the questions above from the start, or not even bothered diverging.

## Deciding on Stack

OK, so how do we actually decide our tech stack in light of these questions?

First, we have to marry them up with the specific needs of our business/organization/project/domain.  But then,
we have to take a hard look at what we want engineers to spend time doing.  There is a reason so many startups
rely on Rails. Rails provides an out-of-the-box answer for many of these questions.

Meaning, with a single choice, you get answers and sophisticated tooling ready to go.  You might not like the
conventions Rails has chosen, but that's not the decision you are making.  The decision you are making is if
*your* conventions and the time it will take to build tooling, documentation, and process around them are going
to deliver more value than Rails'.

And it may be true that it will!  For example, I have seen teams waste huge amounts of time struggling with
JavaScript's lack of a type system, and so I could see the benefit to using something like Elm or TypeScript.
But choosing Elm isn't just about comparing it to, say, React.  You have to evaluate it against the criteria
above.  Is the type safety of Elm outweighed by the fact that I'll need to integrate it into my deployment
pipeline myself (e.g.)?

What's also interesting is how these questions can affect your team structure, which affects hiring.  But I'll
save that for another day.
