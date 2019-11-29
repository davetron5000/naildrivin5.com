---
layout: post
title: "Managing Technical Architecture"
date: 2019-10-10 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---
I played a lot of roles at Stitch Fix, but one was as the Chief Software Architect, which means that I was
ostensibly responsible for all the technical architecture on the engineering team.  I struggled a lot with what
this actually meant and how to do this. I am a pretty laissez-faire manager, and tried to lead my example, but
at a certain scale, say beyond 50 or so engineers, this wasn't super effective.  I've had time to think about a
better way.


<!-- more -->

First, let's clarify the problem.  You have a team of engineers writing code to produce features to solve
business problems.  This codebase increases in size and complexity, in accrues technical debt and cruft, and the
variety of people working on it increases, both around the level of experience and tenure with the company.

The main problem that can happen here is that the engineering team becomes less able to deliver value because of
the friction created by the carrying costs of all the technical decisions that led up to the current state.
This manifests itself as perceived slowness of delivery (e.g. why did THAT take so long?), increased or
repeated outages, and inability to address cross-cutting issues that come up (e.g. security, changes in business
direction, cross-functional projects, etc.).

The solution here is to manage the technical change in such a way that you reduce these problems.  But you have
to do it in a way that does not create further problems.  For example, a way to manage this is to require all
work to have a formalized design document and review process by a central board who approve all changes.  Many
places do this!  Such a process can slow a team down dramatically and in a lot of cases, this is not the right
tradeoff.

So any solution has to balance the values of the team against the value of preventing the kinds of problems
outlined above.

I want to be careful her to not use words like "software quality" or "operational excellence", because these are
non-falsifiable concepts that don't have intrinsic value.  To say it another way, if the business is successful,
can respond to change, doesn't have excessive outages, but the codebase is a massive ball of mud internally,
there is not necessarily a clear problem.  Sloppy code is only a problem if it creates a measurable problem.

So, like many things in software, you have to start with values.

At Stitch Fix, the three values that drove many of my decisions were:

* Delivering business value is paramount
* Consistency is preferable unless there is a reason to be inconsistent that we can track to business value
* Cut scope, not corners.  We aren't going to ever go back and clean up some mess we made, so don't make one in the first place.  Ship less stuff if we are feeling date pressure, don't ship shit.

The first thing I would've done that I didn't do was to explicitly state these values and hire for them.  These
values were shared and were not totally implicit, and we did end up hiring engineers that generally held these
values, but not always.

The reason you have to start with values is to have a framework in which problems can actually be solved. If one
engineer values consistency and another does not, they will be unlikely to ever agree on a course of
action.

Aside from hiring, making these values explicit gives you a reference point to say "this technical decision,
while not wrong, is counter to our values and it must be re-thought".

Thinking back to even the early days, this would've helped with some architectural discussions.

With these values as a base, how do we ensure technical decisions - the decisions that shape the technical
architecture - get made consistent with our values?

There are two factors to consider.  The first is knowing that technical decisions need to be made or are being
made.  The second is how decisions are ratified or accepted.

The answers imply some sort of process, and process can be a hard thing to discuss when the team is only a few
people.  Process feels heavy.  But here's the thing - there is always a process, because no action can be taken
without the execution of some number of steps in sequence and that is...a process!

The question is how explicit the process must be. The answer here depends greatly on the people.

If you have a small group of senior engineers who are aligned on basic engineering values, you don't need much
explicit process at all - the group will do a good job of intuiting when to have a technical discussion, what
decisions effect the group, and when a decision has to be made.

If the team has a wider variety of experience levels, junior developers will not know when they are facing a
potentially far-reaching technical decision.

And so here is how I would handle this, and I believe this method will scale quite well.

First is that each application or service must be owned by exactly and only one team.  "Owning" means being on
call, keeping it maintained, and making sure it's working. Owners can change, but every application or service
has to be someone's responsibility.

Each team, then, has responsibility for a suite of applications and services.  That team should be responsible
for two things regarding the technical architecture: 1) ensure it complies with the larger team's values and
conventions, and 2) establishing and refining conventions for the evolution of that software going forward.

The way that happens is that each team has an architect, which in this parlance is a role.  The role of the
architect is to stay on top of the technical architecture.  They are the person who understands what the
conventions are and reviews changes to ensure they are being followed.  They are the person who drives decisions
when the conventions don't provide an answer.  They bring learnings to their peer group - other architects - to
refine the company-wide conventions.

This works fractally.  If you have a single architect for everything (me, in this case), and there are 4 large
teams that make up the engineering team, there are 4 architects, one for each team.  But if those four teams are
each comprised of 3 sub-teams, then those 12 sub teams each have their own architect as well.

Remember, the architect here is a role.  It should not be a full time job, but a responsibility they do as
needed.  Instead of working 100% on feature works, the architect budgets their time to do code review and
communication.

The existence of these architects handles knowing when architectural decisions need to be made, because it's
their responsibility to stay on top of it.  In terms of making decisions, these architects should be driving the
decision-making, but they should not really be approvers.  Ideally, a decision is made when everyone agrees, and
the architects' job is to get everyone to agree.

These decisions should be documented, ideally as a refinement to the conventions or values.

<div data-ad></div>

Yet more content 
