---
layout: post
title: "On Slow Test Suites and CI Servers"
date: 2017-11-21 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---
A few people on Twitter were talking about developers that run their entire test suite only on their continuous integration (CI) server.  The idea was that this was a sign of low quality tests, low quality code, or an otherwise bad process.  In the past, I
felt this way, and “breaking the build” (by checking in code that had failing tests) was viewed as bad.  I don't believe this any
longer, and now feel like it's a critical ability for a high-functioning team to have.  Not that it isn't important to identify low
quality tests or code, but what exactly is the _value_ of having a fast test suite?

<!-- more -->

## The Value of Fast Tests

The benefit of a speedy test suite is feedback—the quicker you get feedback about any problems, the easier it is to address them and get your code shipped. But, this feedback (and, indeed, the tests themselves), are not
[_results_](http://theseniorsoftwareengineer.com/focus_on_delivering_results_excerpt.html).  They are artifacts and tools
designed to help us deliver results.  It's important to remember that when discussing the virtues of techniques like this.

When developing a feature, you can get feedback quickly by running only the tests relevant to what you are changing. Presumably,
you are making a small change, and can evaluate that change by running only a few tests, possibly even just one.  The way I like
to work is to have one or more acceptance tests capture the overall feature I'm doing, and use unit tests to drive edge cases, as
outlined in [my article for InfoQ](https://www.infoq.com/articles/balancing-unit-and-end-to-end-tests).

While it's nice to be able to run a test suite in a few seconds, it's more important that the tests have adequate coverage for
what I'm doing and meet my personal standard for quality, as well as those of the team and project.  This means, among other
things, that there is value in writing a unit test in Ruby on Rails that loads data into the database.  This is the Rails way,
like it or not, and there is negative value in deviating from these conventions in a Rails project.  Such deviation must be
weighed against the benefits, as well as other solutions to the problem at hand (which is *not* fast tests, but fast feedback).

Again, these are all intermediate artifacts, not results.  While my goal is never to be “Rails-like at all costs”, it's also
never to have “fast tests”. In fact, I don't even test “adequate test coverage” as an explicit goal.  My goal is to deliver
results, and while adequate test coverage is often a means to do that quickly, I try hard not to lose sight of the results I need
to deliver.  I stress this because it means you must take a holistic view of what you are doing and strongly avoid getting lost in the local minima of intermediate metrics like test speed.

<div data-ad></div>

It *is* nice to run the entire test suite after making changes, however.  A benefit to doing so is finding regressions caused by new features. Of less benefit is requiring that this happen on a developer's laptop. A CI server can usually run the suite much more quickly, either by being a more powerful computer or by parallelizing the build (or both).  If I, as a developer, can get faster feedback on my change by pushing a branch to GitHub and letting 10 parallel processes run my app's test suite, what's wrong with that? Nothing.

In addition to speed, running tests on a CI server (as opposed to a developer laptop) creates an added avenue for feedback: sharing your build with others.  When you hit a snag around a failing test you can't quite figure out, help is on its way simply by sharing a URL.  When your test are trapped inside your laptop, you've put friction between you and getting help: screen-sharing, synchronous communication, and environment-specific problems on someone else's laptop.

Remember: these are tools & techniques, not results.  There's no harm or shame in using what you have available to help do your
job.

So what about the notion that a slow test suite is a sign of poor code quality?

## Metrics for Code Quality

If one were to list out some metrics of code quality, “speed of test suite on this year's MacBook Pro” would likely not be one of
them.  In fact, “speed of test suite” is so subjective that it's hard to consider it seriously as any sort of metric for code
quality.

Setting aside that _code quality_ (again) is not a result, not a real goal itself, but just a tool that sometimes helps deliver results, there is actually a fair bit of research around more objective measures of code quality.  As I discussed a few years ago in [“What is 'better' code?”](http://naildrivin5.com/blog/2012/06/27/what-is-better-code.html), we can understand code quality by analyzing its [complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity), [cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science)), [fan-in/fan-out](https://stackoverflow.com/questions/4092228/design-principle-high-fan-in-vs-high-fan-out) (see also [here](http://it.toolbox.com/blogs/enterprise-solutions/design-principles-fanin-vs-fanout-16088)), or even it's size.

All of these are objectively measurable and provide stronger signals about code quality than speed of a test suite (assuming that we could draw a strong conclusion between code quality and results, which is difficult to do and requires more than anecdotal evidence).

A slow test suite still feels kinda bad, thought, and there are practical concerns with using a CI server to make a test suite faster.  If you are practicing Continuous Delivery, it means that you cannot ship code without waiting for your test suite, and so your ability to deliver results is always constrained by it.  Where I work, we have an app that needs 20-30 minutes for its test suite to run, even when using heavy parallelization.  This means that any serious bug in this app must exist for 20-30 minutes in the best case.

But even *this* is a different problem than code quality or test suite speed.  If we have an application where we cannot get
feedback about its correctness (or ship it to production) without a long wait, a fast test suite isn't the only solution to that
problem.

## Address the Problem, not the Symptom

Making a test suite faster feels good, because it's tractable.  We try to convince ourselves that techniques like mocking, null
databases, or headless browsers are all that stand between us and faster feedback.  But consider the design and architecture of
your application.  Breaking up a large application into several smaller ones is much more difficult, but is often more
sustainable.

This problem is easily seen in the small when executing a subset of tests locally.  Ideally, you can run only those tests
relevant to your change, since they are closest to the code being changed.  If your app is organized by “type of module”, this
can be difficult.  A Rails application puts all models in `app/models`, all controllers in `app/controllers`, etc.  To run all
tests for code around a certain feature, say purchasing a product, is difficult. An application organized by function, rather
than structure, would make this easier.

If you were to list possible solutions to this problem, “making the test suite faster” would not be high on the list.  True, running *all* tests is a way to check the tests relevant to your feature, but it's note the only solution, and not even the best one.  Your application's architecture—and what it does to your ability get feedback while developing it—is a lot more important than test speed (It's tradeoffs all the way down, because your hand-crafted, locally-source Sinatra application might be better organized around running tests, but will send you into endless code reviews around maintaining the conventions you had to invent to get there.  Tradeoffs).

And, again, to belabor the point: none of this is a result.  No user benefited from the particular location of code in a project, the use of dependency injection over mocks, or a deployment pipeline. However they very much benefit from functionality being delivered quickly and/or working properly.  There is a difference between these things, despite how related they are.

Take care in how you judge a system, tool, or technique.  Often what appears to be “papering over the problem” is, in fact,
solving a more relevant problem, or addressing something more directly connected to…delivering results.


