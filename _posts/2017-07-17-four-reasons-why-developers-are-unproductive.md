---
layout: post
title: "Four Reasons Developers are Unproductive"
date: 2017-07-17 9:00
ad:
  title: "Be Productive With Rails"
  subtitle: "Rails Just Works"
  link: "https://pragprog.com/book/rails51/agile-web-development-with-rails-51"
  image: "/images/rails51.jpg"
  cta: "Buy Now $29.95"
---

We all feel unproductive at times, and we can be sure that our bosses, clients, or co-workers feel we are being unproductive at times as well.  And, because developer productivity is so hard to measure or talk about, it can feel frustrating to be in a situation where you are feeling or perceived to be unproductive.  Rather than dwell on these feelings or postulate new broken ways to measure productivity, I want to talk about the *reasons* a developer might be unproductive.  With some self-awareness, you can improve your situation.

<!-- more -->

## What is Productivity?

Rather than try to precisely define productivity, we'll use a softer notion: are you getting things done in a reasonable amount
of time?  This is fuzzy, but you, your co-workers, and your boss will have some pre-conceived notion of how long something should
take, and productivity is often measured by how well you track against those notions. Often, those notions are correct, but not
always.  Feeling productive—and being perceived as such—involves matching expectation to reality.  Sometimes, that's working
faster, but sometimes it's being more visible with what's _actually_ involved in a task or project.

In my experience, there are four main impediments to feeling or being perceived as productive:

* Incompetence
* Not working in an organized way
* Over-engineering
* Not solving the right problem

Mental health issues are also a likely contributors to a lack of productivity, and I won't get into them here—I have very little
experience or expertise here, other than to know that a) there is no shame in having a mental health issue, and b) they are often
treatable.  I have seen treatment work in others and if this is something that afflicts you, do your best to get the necessary
treatment.

OK, back to the other four impediments.  A common one is that you are being asked to do something you aren't (currently)
qualified to do.

## Incompetence (is normal)

The word _incompetent_ often carries a strongly negative connotation, usually because a person is acting competent when it's
clear they are not.  Despite this, a lack of competence is nothing to be ashamed of and is quite normal.  We are all incompetent
at most things - it's just not  possible to have broad competence, even in one's field. For example, I'm not a competent Clojure developer, so if I were asked to write Clojure, it would be difficult—I would be unproductive in doing so.

Competence isn't just a macro thing—it affects every level of your work.  If you are a seasoned Rails developer, but have not used
Rails Mailers for one reason or the other, you are lacking that competence.  When faced with a task involving Rails Mailers, it
will take you longer to get going than someone who knows them well.  To get the job done, you must build some level of competence
and *then* solve the problem in front of you.

This can feel unproductive.  It can make something take longer than it might seem, especially if your co-workers or boss are
assuming complete competence at every level.

This can contribute to the second reason you might be unproductive: not working in an organized way.

## Not Working in an Organized Way

I like to think that everyone has a system for how they work.  This is likely not true.  Many developers _putter_, getting
distracted by unnecessary things, or even not knowing where to begin or how to tackle a problem.  This is especially prevalent in
tasks that are more involved than they might initially seem.

If you just start coding with no plan, or you end up with commit after commit with “WIP” somewhere in the title, you might not be
working in an organized way.

This can lead to tasks taking longer than they technically need to, but it also feeds the _perception_ of being unproductive,
because intermediate results are hard to describe or demonstrate.

To work in an organized way, you must have some sort of plan and system for working.  Although each task you work on is somewhat
unique, there are high-level steps to take in order to work in an organized way.

<div data-ad></div>

You need to spend time figuring out how you are going to do the work.  If you don't know immediately how you are going to write
the code you need to write, you have to spend time figuring that out first.  Coding is not necessarily the best way to do
this, and it can lead to much thrashing as you try to both figure out what's needed, write tests, and write clean code.  It's too
hard to do them all at once.  When you *do* use code to figure this out, throw it away when you're done—don't waste time trying
to make it production-worthy.

This is a long way of saying that you always need a plan.  Maybe it's in your mind, or maybe you write it down.  The bigger the task, the more you should write out what you're going to do.  Decide what intermediate steps you'll have and be clear about what the definition of _done_ is.  This all produce artifacts to both appear and feel productive, even if they are just mentioned verbally in a stand-up.

Two great plans are the thin slice, or outside-in.  The _thin slice_ means you build a simplistic happy path end-to-end and
iterate on that handling edge cases. This works great if the problem space is unclear.  _Outside in_ involves building out the
majority of the UI first, and then iterate on making it real.  Working _inside out_, which often starts with a database design is
incredibly difficult, both from a correctness and productivity standpoint, because you jump right into the implementation
details, bypassing the user experience and over-arching problem you are solving.  Don't do this.

Although incompetence can contribute to working in a disorganized way, over-engineering can be far more detrimental.

## Over-Engineering

Over-engineering might just be the biggest contributor to lack of productivity.  This is because it massively explodes the
scope of work *and* we all love to do it.  Turning a mundane problem into a more interesting one is a hard urge to fight, and
that urge does not go away with more experience.  Programmers are problem-solvers and some problems aren't terrible interesting
to solve, but are absolutely critical to *be solved*.

If you find yourself making something “more flexible”, “generic”, or “abstract”, you are almost certainly over-engineering.  Most
of us aren't building frameworks or re-usable libraries.  We are solving some problem for some user, and everyone will be happier
if we solve that in the simplest way possible.  Simple, tested code that solves a specific problem is far easier to change,
understand, and maintain than abstract code that can be applied to a larger variety of problems.

I try to follow the “rule of three”, which essentially means that you should not seek to abstract, extract, or genericise
anything until you've seen a solid pattern, often evidenced by seeing the same thing a third time.  My collegue Patrick Joyce [has
a more detailed post](http://pragmati.st/2013/07/19/build-it-twice/) on this.

Duplication is likely better than a complex, over-engineered, generic solution that took too long to ship.  Sandi Metz has [a great blog post](https://www.sandimetz.com/blog/2016/1/20/the-wrong-abstraction) on the subject.  And, finally, I [wrote in more detail on detecting and avoiding over-engineering](http://multithreaded.stitchfix.com/blog/2016/08/15/avoiding-over-engineering/) at Stitch Fix's tech blog.

This isn't to say that ambitious, big projects aren't ever worth doing, but those aren't necessarily over-engineered.
Over-engineering is when you have a simple problem and produce a complex solution that solves some general class of problems.  If
you really do have a general class of problems, then you and you are team should discuss the solution to that, and build it.
*That* isn't over-engineering.

Where Over-engineering is producing a more complex solution than is necessary, engineers often solve the wrong (or additional) problems.

## Not Solving the Right Problem

Where over-engineering is expanding the solution, what we're talking about here is expanding the problem.  An obvious sign of
this is undertaking a large refactoring while also fixing a bug or adding a feature.  Refactoring is
[tricky](http://naildrivin5.com/blog/2013/08/08/responsible-refactoring.html).  If you start refactoring shipped, working code,
you need to be really sure that such a refactoring makes the problem you are *actually* solving easier to solve.  In a
moderately-factored codebase this is rarely the case.  In a poorly-factored codebase, this might be the case, but carries great
risk, since poorly-factored code is often not as well tested as it seems, and refactoring is impossible without trusted and
reliable tests.

Refactoring isn't the only type of problem-expansion, though.  We might feel like since we're in a part of the code, we can add a few more features that might be useful.  We might add a new fields to a UI.  We might even imagine edge cases or requirements that don't exist.  I created a page in a system I created at Stitch Fix that no one asked for, and as users discovered the page and built manual workflows around it, I had to maintain it, including spending an entire week making it more performant as it fell apart under load.  All that time should've been spent solving the users' problems more directly.

Finally, getting wrapped up in esoteric edge cases that might never happen can turn a 2 day task into a 2 week excursion from which you might never return.  Not every edge case needs to be handled.  They all have a trade-off around the effort required to prevent them against the problems they cause.  Even in financial software there are acceptable bugs—if there is an issue that happens monthly that gives a customer an extra $10 they shouldn't get, is it worth spending 2 weeks of engineering effort to fix that bug, and then maintain it forever?  Not usually.

What you'll find is if you work in an organized way, you will have a lot more clarity around edge cases, their likelihood, and
their impact.  It's *incredibly* hard to write code all at once that solves all edge cases at once.  Focus on the problem you
were given, and solve the 80% case, then take stock.  You might find you've solved the 99% case.

Knowing what keeps is from feeling or being perceived as productive, how do we avoid them?

## Removing the Impediments

When I think back on every task I've done, I can see parts of all of these failure modes.  There's always some thing I don't
understand, some thrashing in how I approach the problem, some little bit that's way fancier than it needs to be, and some amount
of scope creep.  If I'm being honest, there's times when these issues haven't been so little, and I wasted time and energy, often
saddling a team with a bad decision.

Our goal should be to reduce these issues—we'll never be truly rid of them.  The first step is self-awareness.  Ask yourself:

* “Do I know what I'm doing?”
* “Do I have a plan?”
* “Is this the simplest thing I could do?” (note: [Simple ain't easy](https://www.infoq.com/presentations/Simple-Made-Easy))
* “What is the problem I'm trying to solve?”

Often, these yield very obviously-bad decisions and can guide the way.

If you work in a safe environment, you can also ask others.  If you don't instantly know how to do something, it's safe to ask
“what's the way we normally solve problem X?”.  Run your plan by a co-worker: “here's my approach, does this sound reasonable?”.
Sketch out your solution before committing to it and ask “is this over-engineered?”.

For identifying the right scope of your solution, look at your diff - can you justify every single change as being necessary to
solve the problem?

This is hard, perhaps harder than it should be.  As an industry, we don't have disciplines.  We don't have shared language.  We
don't have standards on any level of our work.  We are entirely on our own, every time, all the time, to figure out how to be
productive.  For some of us, this is a feature—it's what attracts us to the profession.  For others, it can feeling confusing,
frustrating, or overwhelming. I often wonder if there could be a discipline for software engineering that reduces all of the
issues above without creating a stifling, uncreative atmosphere.  What do you think?




