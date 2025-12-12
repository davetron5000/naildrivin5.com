---
layout: post
title: "Choosing Technology"
date: 2019-08-08 8:30
ad:
  id: "sweng"
related:
  - "Creating a Culture of Consistency"
  - "The Frightening State of Security Around NPM Package Management"
  - "The Katz Conjecture: You Must Understand What an Abstraction Abstracts"
---

Choosing technology has a huge impact on a  team's performance, and when you are starting out, you have a lot of
decisions to make. We often get hung up on technical features, or weather we should use a framework or a bunch of
libraries.  The reality is you have to gain a deep understanding of the business realities coupled with your
team's values.  From there, you then evaluate your startup cost (opportunity cost) against the cost to maintain
the system over time (carrying cost) to arrive at the best decision.  Technical features are a part, but a small
one.

<!-- more -->

## Everyone's Using a Framework

Teams don't decide to adopt a framework or install a bunch of libraries - teams always build their own framework
out of the tools, technologies, libraries, practices, and conventions they need to do their work and deliver
value.  Technology choices are always about building or enhancing this custom framework.  Even something as
comprehensive as Ruby on Rails doesn't included everything a team could possibly need.

So, before you start asking "what is the best programming language?" or "what testing tool do we need?", you need to have answers to these questions first:

* What business realities exist that truly drive our technology decisions?
* What are our values in how we deliver software?
* What is the opportunity cost of the options in front of us?
* What carrying costs of those options?
* Is the opportunity cost worth the carrying cost given our values and business realities?

If you want to talk about “right tool for the job”, *these* are the questions that allow you to define the job, as
well as the constraints under which it must be delivered.  If you can't answer these, you aren't making the right
decision.

Let's talk about the terms in each of these, starting with _business realities_.

## Business Realities

Business _realities_, as opposed to _requirements_ are a somewhat fuzzy notion that represent what the business
plans to do, how it plans to do it, and what is actually happening at any given time.

<div data-ad></div>

For example, the business
might be planning to quickly build a 10-20 person engineering team, and then keep that size for the foreseeable future.  Or, the business might need several years of hypergrowth and a team to gro with it.


Of course what the business actually *does* is a big reality to account for.  How much data is going to be
processed?  How much traffic will there be?  What sorts of tools need to be built for employees, if any?  How
stable are the processes being used to run the business?

These realities should have a huge impact on technology selection.  If the team is going to grow like gangbusters
over several years, you'll have new people coming on board all the time, and they need to get productive quickly.
This means that you either choose commonly-understood technology or you have a solid onboarding to train people
up.

Business realities deal in the _what_, but the _how_—how your team operates and delivers results—is also
important.  These are captured as _values_.

## Values

Your company has values, and you need to know what those are (as well as what is not valued).  You need to know
the *actual* values people practice and not just what the HR team says.  For example, is speed of delivery more
important than quality?  How much risk is tolerated?  Are the engineers trusted partners or a service
organization?

From these values you should then identify engineering-specific values.  For example, is consistency important? Is
automated testing valuable? Are developers micro-managed or given agency?  Are bugs in production tolerable and do
we monitor them, or is it better to spend more time up front avoiding bugs?  How much planning and design work is
appropriate before you start coding?  Should code be reviewed before its shipped?  Who can ship code to
production?  Do you prefer generalists or specialists, or a mix of both? How do you do data modeling?

The answers to these then inform your technology choices.  Choose technologies that model your values, otherwise you'll be fighting your development environment constantly.

<div class="pullquote">
Choose technologies that model your values
</div>

For example, if your team values generalists, you want to avoid technologies that require deep expertise to use effectively.  If properly modeled data is very important, you might prefer a statically-typed language over a dynamic one.

When you marry these values to your business realities, you can then create a short-list of technologies that will
fit your needs and your team.  To turn that list into a final decision requires understanding both the up-front
cost of getting set up (opportunity cost) and the ongoing cost of maintaining the system you'll create to work in
(carrying cost).

## Opportunity Costs

An _Opportunity Cost_ is a one-time cost you bear as a result of your decision.  In the case of choosing technologies, it's the cost of getting set up.  The reason for the word "opportunity" is because this time you spend getting set up prevents you from pursuing other opportunities. So it's not just a cost of time setting things up, but it's a loss of productivity while doing so.

A simple way to understand opportunity cost is to ask yourself what else you could be doing, and would that be more valuable? There are *always* more things to do than people to do them, so of all those other tasks, which ones can you do *right now*? Are those tasks more valuable than what you are considering spending time on?

<div class="pullquote-left">
Ask yourself what else you could be doing, and would that be more valuable?
</div>

Opportunity costs also relate to tasks that cannot be done until you make a decision and unblock yourself.  To
launch the first version of your website you need to choose a web framework, set it up, and build the site. In
this scenario, a seasoned team of Rails developers will have a low opportunity cost with Ruby on Rails compared
to, say, Yesod, a Haskell web framework (notice how the team itself—a business reality—plays into this cost).

When evaluating opportunity cost, create a comprehensive understanding of *everything* that needs to be in place.
It's not sufficient to make an app that renders “Hello World”.  You need a solution or convention for stuff like:

* URL routing
* View Rendering
* Business logic
* Unit testing
* Integration testing
* Browser testing
* Database Schema management
* Background jobs
* Email
* Third party integrations
* Deployment
* Runtime monitoring and error handling
* And lots more probably

Don't forget that you have to make all this work together.  There's a big difference in choosing Node, Jest, and
Cypress than Rails, since the former requires some level of manual integration between the code and testing
frameworks.

The key is to be very honest about what needs to built just to be productive, and how quickly you'll be able to
build that (or at least *how* you will build it as you go).  Just keep in mind that opportunity cost is only one part of the puzzle. If you are thinking that a high upfront cost might be worth it because it saves time down the right, that is called _carrying cost_.

## Carrying Costs

Carrying costs are the continued and constant costs you pay to use the technologies you have chosen.  When making
that choice you have to estimate what those costs will be over time.  This is, of course, informed by your values
and business realities, but also by the technology itself.

A common carrying cost is the cost to apply security patches to your tools and make sure your system still works
properly with those patches applied.

There are tons more:

* Bringing on new engineers to work on the project
* Managing deprecations, bugs, and performance problems in third party tools & libraries
* Managing deprecations, bugs, and performance problems in *your* code
* Introducing new tools/technologies to the system to meet new business realities
* Increased scale of data, traffic, or team
* Integration with third party services and keeping those integrations working

<div class="pullquote">
When you understand carrying costs, you'll…stop having discussions about…technical merits and start discussing using that technology in earnest.
</div>

When you understand carrying costs, you'll find that you stop having discussions about the technical merits of a technology and start discussing the implications of actually using that technology in earnest.  Assessing carrying cost can be very hard. It requires a holistic, system view of not just the applications you are working on, but the team, its dynamics, and even the entire operational model of the business.


Keep in mind that a reduced carrying cost is how you justify a potentially large opportunity cost.  The opportunity cost you pay only once—the carrying cost is with you forever.

This leads us to the fifth question above, “Is the opportunity cost worth the carrying cost given our values and business realities?” which is how you make your decision.

## Making Your Decision

You will always make technical decisions with imperfect data, and there will always be biases to cloud your
judgement.  The only way to deal with this is to be honest and clear about *why* you decided what you did. I would
highly recommend writing down your assumptions about business realities, your interpretation of the values, and
how you arrived at your understanding of the opportunity and carrying costs of the alternatives.

This does two things.  First, it provides historical guidance for new people wondering why a particular tool might
be in use.  Second, it allows you to revisit your decision as you learn more or as things change.  If the business
reality changes in a fundamental way, looking back at your decision model for the technologies you chose can help
you decide if you need to make a change.

At any rate, making a technical decision is about way more than technical features, but about looking at
opportunity costs and carrying costs against the business reality and the values of your team.
