---
layout: post
title: "Work vs Meta-Work: Delivering the Right Results"
date: 2018-01-19 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---

Engineers often deride anything that's not writing code as being not “real” work.  While this diminishes the contributions of
others, and is generally an unhealthy bravado, it *is* critical to understand the difference between activities that directly
solve a problem and those that organize said activities.  The later, I call “meta-work” and engineers should be very conscious of
spending too much time on it.

<!-- more -->

Think about what a typical engineer does. The engineer is likely writing code for software to solve some problem.  In order to
write that code, they might need to do some requirements gathering, design, and prototyping. They may also write tests of the
code.  They might need to create or maintain a development environment, or update the dependencies of an application they work
on.

<div data-ad></div>

Only one of these things is what I would call actual “work”: writing code for software to solve some problem.  Everything else in
the list above is “meta-work”: activities that enable actual work, but are not in and of themselves delivering a result.

This does not diminish the importance of writing tests, tweaking the dev environment, or doing analysis, but it is valuable to be
open and honest about the difference.  Even noted testing advocate Kent Beck [views tests as different from production
code](https://stackoverflow.com/questions/153234/how-deep-are-your-unit-tests):

> I get paid for code that works, not for tests…

Kent views tests as a means to get confidence that code is working, and this is their value.  Tests alone are valueless unless
they helped us ship software to deliver a result to solve some problem for someone.

In the last five years, I've seen my engineering team go from 3 to over 100, and seen engineers of all experience levels and
backgrounds join the team (and some later leave).  Those that struggle to be successful fail to properly understand the role of
meta-work in getting things done.  They over-prioritize tasks that improve the development environment or
[“refactor” tests](/blog/2012/11/16/why-you-cant-refactor-test-code.html), or
modernize some code that's perfectly functional, despite being years old.

In almost every case case, struggling engineers fail to deliver results because they over-focus on meta-work. My advice to new
engineers—new to the trade or veterans new to a company—is to aggressively focus on _work_: deliver results.

By [focusing on delivering results](http://theseniorsoftwareengineer.com/focus_on_delivering_results_excerpt.html), an engineer
demonstrates through actions that they understand that their purpose first and foremost is to solve a problem for someone through
software.

But, what of meta-work?  We *do* need to spend time doing design, and our development environments *do* need fixing.  Some of our
tests really aren't written well.  How do we think about this?

The solution isn't to jump in, day one, and start changing things.  Be honest about the level of inexperience you really have: you just don't know enough to decide that it's OK to modernize your test suite instead of solving a user problem.  By aggressively focusing on delivering results for users, you will gain valuable insight into the process of doing so on your team, in your new codebase.  Learn about the things you want to change before changing them.

<div class="pullquote">
Learn about the things you want to change before changing them
</div>

Once you do, you are now in the position to make the right trade-offs about meta-work.  These trade-offs have to be made
consciously and with your team.  For example, I see teams that maintain old code (2+ years :), bring on  a new member that wants
to set up a style-checking system like Rubocop or Checkstyle.

These systems are classic examples of meta-work. Setting them up
is never a question of their value, but of time.  What problem do these tools solve, and what *other* problems does the team have
that are likely more important to focus on?  I guarantee a style-checker would not be high on any team's list of problems they
need to solve to work better.

By being honest about the difference between work and meta-work, a team will naturally force conversations about the value of any
and all meta-work, and this will lead to making better decisions that *do* enable the team to work better.
