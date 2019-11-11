---
layout: post
title: "A Reasonable Development Environment"
date: 2019-09-24 9:00
ad:
  title: "A Ready-Made Toolchain"
  subtitle: "Ruby on Rails Lets You Focus"
  link: "http://bit.ly/dcrails6"
  image: "/images/rails6.jpg"
  cta: "Buy Now $29.95"
related:
  - "Choosing Technology"
  - "Creating a Culture of Consistency"
  - "The Frightening State of Security Around NPM Package Management"
---
I've spent a few hours each day the past week writing a basic HTTP service in Go.  The service has a single
endpoint that writes its request payload to a database table.  I have spent more time setting up the development
environment and toolchain than I have writing code.  Having to design, build, and test a toolchain just to be able
to write and deploy code is meta-work that I'm not excited about and, when we aggregate developer time, is a form
of waste.

So I want to talk about what I think the most minimal things are needed for a reasonable development environment
and how we can get that and keep it working.

<!-- more -->

I'm not talking about the minimum to execute code on my laptop, and I'm not talking about a minimum set of tools
to learn a language, library, or framework. I'm talking about the tools needed to do *real* development of
software that either someone is paying you to do or that you intended to put in front of users for real. I'm also
talking about doing this on a *team*.  Very few pieces of software are built and maintained by a single person.

The most critical part of any development workflow is that any action you need to take can be done in a single
command that requires no options.

## Single Commands That Require No Options

On every Rails project ever, you can always type `bundle install` to install the dependencies.  This is the kind
of interaction I'm talking about.  All workflow actions should be available in this way.  Any options that a tool
needs that are specific to the project should be in a file somewhere.  For example, Bundler allows using arbitrary sources for where to find libraries. You don't have to tell the `bundle` command to use them, it's in `Gemfile` and is part of the project's source code.

When our development workflow is created from option-less commands, those commands are easy to remember, easy to
document, easy to talk about, and easy to script into higher-level commands.  This can eventually create an
ecosystem across projects that reduce friction even more.  It's common experience to have to work on two different
projects that have wildly different commands for doing development, and it's needless friction when this happens.
Eliminating this friction with a set of option-less commands creates leverage for teams as they scale.

So what sort of tasks, then, do we need?

## Development Tasks

We can tease out the tasks we need by thinking through what you have to do starting from a fresh workstation and
ending with being able to actually write and test code:

<div data-ad></div>

First, we have to get things set up, so we need commands to

* *install third-party dependencies*. Projects that use other libraries need a way to download the correct versions required by the project.
* *setup a database*. When using a database, there's often need to do some setup (e.g. create the logical database inside Postgres).
* *fetch needed credentials*. We often need secrets locally to work and these can't be checked into version
control, but we can still script everything about fetching them, even if it's just asking the developer to go to a
site, copy an API key, and paste it back to the script (so-called executable documentation).
* *setup other infrastructure or services*. Many projects need more than a database.  For example, if Redis needs to be running or I need some sort of Elasticsearch index created, there must be a way to do that easily.

Once you have these commands, you can script them all into a single meta-command that does all the setup.  It's
important that each step has its own command, though, because you want the ability to, for example, re-setup your
database without having to download third-party libraries in order to do it.

After setup, we need to be able to do local development, including write and execute tests.  To that end, we need
commands to

* *run the code*. I need to be able to run the code locally so I can actually use the software.
* *syntax check/compile*. I want to see if my code has syntax errors without also having to spin up the application or do test setup.
* *run the test suite*. I want to be able to run all the tests and see the results.
* *run a subset of the test suite*. For large, complex, or older apps, the entire test suite can take a while to
run, so running a subset of tests decreases cycle time. It can be really useful to be able to quickly run unit
tests without having to do all the setup needed for integration tests.  Note that this command obviously must take
some sort of option to specify what subset of the tests to run.
* *run a single test*. To get fast feedback and cycle time, running a single test I am focusing on repeatedly is a boon.  Like the command to run a subset of the test suite, this command obviously needs an option to know what test to focus on.
* *run any other QA-type tasks*. We often want to do static analysis to look for security issues or code style
problems.  Whatever these are, they should be tasks that can be run in one command with no options, too.

Like our setup commands, we want to be able to wrap all of this into a single meta-command.  We can then use this
meta-command in our CI environment to execute the tests in the same way developers do.  If we combine this
meta-command with our setup meta-command in CI, we then essentially get our development workflow tested for us in
the CI system - if the developer commands fail, the build fails, and we know we have to fix our toolchain.


Aside from setup and running tests, there are other things we typically need to do for day to day development that
aren't just writing code.  For example, we might need commands to

* *manage the database schema*. When using a database, you need to be able to make changes to the schema or otherwise bring your local schema up to date.
* *generate code*.  Projects that use code generation often require periodically updating generated code from some source or initial configuration.
* *manage or update third-party dependencies*.  Projects that use other libraries need to be able to update or upgrade the versions in use.
* *package the project (or parts of it)*. Often the project must be packaged for deployment, and being able to do this in a development environment is critical to make sure packaging works as expected (e.g. compile JavaScript assets).
* *generate documentation*.  Most languages and frameworks support machine-generated documentation and this should be possible to do.

Ideally there is also a way to create custom tasks specific to the project that work in the same way so you can
grow your development toolchain as you need to.

What all this adds up to is that, on any project where more than one person is going to work, there needs to be a
set of option-less commands that can perform each of the above tasks.

Anything you need to do that cannot be done via a single option-less command means developers will either not
perform that task, perform it inconsistently, or waste time performing it due to the friction involved in not
having it scripted.  This will add up and create negative value for the project and its team over time.

This is particularly burdensome for senior developers who are expected to mentor those with less experience.  Debugging local environments can be difficult and time consuming, and it's not something  that comes naturally. Less experienced developers almost often struggle with this, and that means that the senior developer, rather than mentoring those with less experience on how to be a more effective programmer, end up debugging their environment most of the time.

So, given that we need them, where do they come from? Who builds and maintains these commands?


## Who Creates These Tasks?

Where these tasks come from highly depends on the [technology you've chosen][techpost] to build the project.  For
example, if you have chosen JavaScript or Go, you have to create all of this yourself.  If you have chosen Rails,
you don't have to create hardly any of it.

One thing to consider is the opportunity cost involved in creating these tools, and the carrying cost in
maintaining them.  You will have to spend time creating and designing the development tools if your language and
framework don't support them, and this is a fundamentally different activity than building the software those
tools are there to help you develop.

Your toolchain *will* break and *will* require fixing.  And when that day comes, you will certainly have your
actual work to do, and thus will need to make a decision about fixing the toolchain or accepting the friction that
comes along with not fixing it.  You essentially are signing up to maintain this toolchain as part of all the other work you have to do.  Keep this in mind if your team wants to start using some shiny new piece of tech—it's not sufficient to just get it running, there has to be tools for a reasonable development workflow as well.

Even a framework like Rails still requires some special commands to account for the specific needs of your
project, so there's no getting out of this entirely just by choosing Rails.

So what is the solution?

## Building & Maintaining a Development Environment

To be glib, you treat this like any other piece of software - you write it, test it, and commit to maintaining it.  But how?

How your development environment works is intertwined with both the design of your application as well as the
systems you use to test and deploy it.  As a very obvious example, Rails would not be able to have a simple
mechanism for managing your database if it did not make assumptions about the existence and configuration of
Active Record.

The first requirement, though, is for your toolchain to be used in your CI system.  If your CI system
is using your it to setup, run, and test the application, then when the toolchain fails, CI fails, and you
can fix it,  nay *have* to fix it.

This need will feed into the design of your application.  For example, you want to run your application inside CI
the same way a developer might (using the toolchain).  That implies that there is a programmatic way to see if the
application started up correctly. *That* implies you have designed your application to support such a feature.

If you are going to apply this to multiple applications using a variety of technologies, a good strategy is to
create a protocol that each application must adhere to.  For example:

* `bin/setup` assumes a fresh checkout and sets up whatever is needed for the app to run locally and have its
tests executed.  It should be idempotent/safe to run many times.
* `bin/run` starts the application locally so that it can be used in a dev environment.
* `bin/ci` executes all tests and any other checks required by CI to consider a change good.

These are the “meta-commands” I was talking about above.  Ideally, they are composed of other commands that a
developer can run to do parts of the setup, testing, or execution.  Note that you don't have to wrap everything in
a script, but doing so allows you to adapt any tech stack to a standard development environment.

No matter what you end up with, you *have* to reserve capacity for the maintenance of the development environment
across the entire team.  If you've ever worked in a restaurant, you've no-doubt experienced the deep-cleaning day,
where the entire staff give the restaurant a very thorough cleaning.  Some restaurants close for the day,
and others do it on a day the restaurant isn't open, but the idea is that they have budgeted time and labor to
periodically do this deep clean.

While a deep clean might not be the right model for maintaining your development environment, the reservation of capacity to keep it working is critical.  The staff must be ready and able to perform needed upkeep on this in perpetuity (though it should be done during business hours and accounted for in the team's velocity and *not* on a weekend :)

## Final Thoughts

Considering all of this as the bare minimum for effective development, it's surprising to me how utterly terrible
dev environments tend to be.  I think teams habitually underestimate both the costs in setting up a reliable dev
environment as well as the ongoing carrying cost of doing so.  Teams also rarely consider this aspect of their
work when making technology decisions, and rarely design their applications to make them easy to work on.  I hope
that starts changing.

[techpost]: /blog/2019/08/08/choosing-technology.html
