---
layout: post
title: "Code Reviews—or not—at an Early Startup"
date: 2021-04-27 9:00
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images//sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

As mentioned in [a previous
post](https://naildrivin5.com/blog/2021/03/31/at-a-startup-write-as-little-software-as-you-can.html), I'm CTO of an early stage
startup and the engineering team is me and one other engineer. We don't pair program—we can't—and we do do code reviews of pull
requests. But we don't do it to check a box or ensure a "second set of eyes" and I want to talk about what we do, why we do
that, and how it might scale.

<!-- more -->

Two of our team values are *autonomy* and *respect* and these apply perfectly to what we do with pull requests and merging to
the main branch in order to deploy.

## Autonomy to Ship, Respect When to Get or Give Feedback

If each of us required the other to review all of each other's changes, our small team would grind to a halt.  I'm on the east
coast, she's on the west. I tend to be in more meetings, she's not.  That said, both of us do work that we realize needs to be
looked at by the other person.

Sometimes we need to let each other know of significant changes. Other times we've done something new or complex and really do
need the other person's technical feedback.  And, of course, we both often find bugs in the other's code by looking at the
changes.

<aside class="pullquote">
It is sometimes worth delaying shipping to get feedback
</aside>

We both highly value autonomy and did not want to create gates to shipping that weren't needed.  We are both comfortable with
some risk and confident in our systems monitoring to fix things that go wrong after the fact. But we also respect each other's
expertise and roles to know that it is sometimes worth delaying shipping to get feedback.

Here is what we ended up coming up with:

1. Always make a pull request, since this serves as a marker of changes that were made.
   * Write the pull request as if another person will review it, even if that's not going to happen.
   * "Self-comment" on anything that might benefit from more context or be the result of tradeoff that might not be obvious from just the code.
   * If there is any part of the change that the other developer should specifically be aware of, `@` reply the other developer.
1. Explicitly request a review if the developer making the pull request thinks they need one.
1. The developer making the pull request decides when to merge (and thus deploy). This is where respect comes into play.
   * If you need to merge before getting feedback, merge.
   * If you *did* merge, explain why in the pull request to reaffirm that you still need the feedback.
1. Even if a review was not requested, feedback is welcome even after the fact.
   1. If post-merge feedback is actionable, a new pull request is made with changes addressing that feedback.
   1. All feedback should be addressed or acknowledged.

<div data-ad></div>

This might sound complicated, but it does allow us to ship changes when we need them but still get all the benefits from
asynchronous code review.  We both can be aware of changes in the system. We can both give feedback that will be acted-upon at
any time.  We can both balance the need for specific feedback and the desire to ship on a case by case basis.

## Scaling This By Setting Explicit Expectations

A difficult nuance of leadership is differentiating expectations from direction.  *Direction* is telling people what to do and
that is no fun for anyone.  *Setting expectations*, however, preserves autonomy.  It also gives permission for spending time on
activities you claim to value.

As our team gets bigger, here is how I might start to set expectations around pull requests and code review:

* Making Changes:
  * You decide what feedback you want and if it should delay shipping.
  * It is 100% normal to need feedback because you aren't totally sure if what you've done is right.
  * You decide what to do with the feedback you are given.
  * You are open to unrequested feedback before or after merging your change.
  * Respond or acknowledge all feedback. Respect the giver enough to tell them what you are doing with their feedback.
* Giving Feedback:
  * Give timely feedback when requested.  Take the time you need to do this.
  * Be respectful and give clear feedback about the code (this topic could be an entire book probably).
  * If you are explicitly accountable for part of the codebase, part of that is to make sure feedback is happening
  appropriately.

This is somewhat vague, mostly to allow the team to meet these expectations however they see fit.  I think it'll highly depend
on who the team actually is.  There's no one-size-fits all and oversimplified systems like "always pair" or "always get a code
review" ignore the individual and I don't think will lead to the best outcomes.

