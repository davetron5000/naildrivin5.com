---
layout: post
title: "Code Reviews—or not—at an Early Startup"
date: 2021-04-27 9:00
ad:
  id: "sus-dev"
---

As mentioned in [a previous
post](https://naildrivin5.com/blog/2021/03/31/at-a-startup-write-as-little-software-as-you-can.html), I'm CTO of an early stage
startup and the engineering team is me and one other engineer. We don't pair program but we do review pull requests—at least
sometimes.  I want to talk about how we do it, why we think it works, and how it might scale.

<!-- more -->

Two of our team values are *autonomy* and *respect*.  These concepts are the foundation of our current process of creating pull
requests, possibly reviewing them, and when we merge them to the main branch for deployment.

## Autonomy to Ship, Respect When to Get or Give Feedback

If each of us required the other to review all of each other's changes, our small team would grind to a halt.  I'm on the east
coast, she's on the west. I tend to be in more meetings, she's not.  That said, both of us do work that we both realize sometimes needs to be looked at by the other person.

Often, it's to let each other know of significant changes. Other times we've done something new or complex and really do
need the other person's technical input.  And, of course, we both find bugs in each other's code by looking at the changes.

We both highly value autonomy and did not want to create gates to shipping that weren't needed.  We are both comfortable with
some risk and confident in our systems' monitoring to know when things go wrong and then fix them.

<aside class="pullquote">
It is sometimes worth delaying shipping to get feedback
</aside>

But we also respect each other's expertise and roles to know that it is sometimes worth delaying shipping to get feedback.  Here is what we ended up coming up with:

1. Always make a pull request, since this serves as a marker of changes that were made.
   * Write the pull request as if another person will review it, even if that's not going to happen.
   * "Self-comment" on anything that might benefit from more context or be the result of tradeoff that might not be obvious from just the code.
   * If there is any part of the change that the other developer should specifically be aware of, `@` reply the other developer.
1. If the developer making the pull requests wants feedback, explicitly ask for it using GitHub's mechanism for doing so.
1. The developer making the pull request decides when to merge (and thus deploy). This is where respect comes into play.
   * If you need to merge before getting feedback, merge.
   * If you *did* merge, explain why in the pull request to reaffirm that you still need the feedback but had to get the change into production (feature flags can be useful in mitigating the risk of doing this).
1. Even if a review was not requested, feedback is welcome even after the fact.
   1. If post-merge feedback is actionable, a new pull request is made with changes addressing that feedback.
   1. All feedback should be addressed or acknowledged, even if it does not lead to code changes (this is another aspect of respect).

<div data-ad></div>

This might sound complicated, but it does allow us to ship changes when we need them but still get all the benefits from
asynchronous code review.  We both can be aware of changes in the system. We can both give feedback that will be acted-upon at
any time.  We can both balance the need for specific feedback and the desire to ship on a case by case basis.

One note is that both of us do our best to give respectful and useful feedback (both affirming and corrective).  Feedback is
tricky because it must be clear, it must be useful, but it must acknowledge that a real human is receiving it.

Not everyone is used to receiving feedback, nor are there necessarily good at giving it.  This will be something to keep in mind as we add developers to our team.

Which leads to an obvious question about how to go from a two person team to a three, four, or five person team.

## How Might This Scale?

The problem with a simplistic process like "always pair" or "always get a code review" is that it seems like it scales due to
its simplicity, but it fails to truly solve the problem of balancing speed of delivery with volume of value delivered.  It's a type of command-and-control leadership that I have not seen to be particularly effective.

<aside class="pullquote">
[Always pairing or requiring code review] is a type of command-and-control leadership
</aside>

To be honest, I'm not sure how the process above might scale. I could imagine that if each set of developers has clear areas of
responsibility, the team understands proper feedback as well as how to build and maintain trust, the above process could work
fractally.

But, we'll see.  It depends on who the developers are.  Any process that doesn't account for the specific people on the team
isn't going to work very well.  That's way there's just as many people that hate pairing as who hate code review.

This illustrates why leadership is so difficult. If you are too directive, you exclude great people and annoy others.  If you
don't clearly set expectations, you end up with uncontrollable output and shadow directives.  Whatever the solution, it surely starts with setting
clear expectations and being honest about what problem you are trying to solve.




