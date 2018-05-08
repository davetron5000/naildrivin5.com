---
layout: post
title: "Creating a Culture of Consistency"
date: 2018-05-06 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---

While I was not the first technical hire at Stitch Fix, I was early enough to make a lot of technical decisions that have had
long-reaching effects on what is now a large engineering team of over 100 developers at a public, profitable company.  Over that
time, the good decisions were almost always about being consistent, and the bad ones where the introduction of arbitrary
inconsistencies.

<!-- more -->

Early on, the entire team (of six developers) met regularly and agreed that consistency was a value we held and that we would foster as the team grew.  “Arbitrary Inconsistency Should Be Avoided” was one of our written-down architectural principles.

Even now, many things in the Stitch Fix engineering team are consistent, regardless of who did them or why.  This has allowed us to make a few drastic changes over the years without incident, and made onboarding developers far more straightforward than if each team was doing its own thing.

For example, when we moved from Heroku to AWS, we were able to do so without major downtime or production incidents, and without major code changes.  What code changes were required were almost entirely scriptable because of the overall consistency in the design and structure of our applications.

When growing a team, it's important to use consistency as a driver for conventions and technical decisions.

## The importance of being consistent

If a developer has spent time digging into a technical problem, coming up with a solution, and getting it into production, there
is little value in another developer re-doing this work.  Instead, that developer should copy or re-use the work done by the
first developer.  This work should become a convention on the team unless there's a strong reason to the contrary (and personal
preference is not a strong reason).

Further, if same things are the same (such as internal application architecture, naming, project structure), it becomes easy to
grow the team and extends the time during which a single person can understand the entire technical architecture.

A team that embraces this will basic practice be able to move quickly and maintain a focus on the specific business problems they solve. A team that continually re-solves problems or has to maintain many different methods of solving the same technological issue will be slower to deliver value.

<div class="pullquote">
A lack of consistency has long-term negative effects on a team's productivity
</div>

A lack of consistency has long-term negative effects on a team's productivity.  When there are many ways to do the same thing, developers
now have to decide which way to do something, or if there should be an additional way.  Developers that must work across systems (which becomes highly likely as a team grows) must learn *all* the different ways to do something to be able to work.

No technical leader would want this for their team.  They would want undifferentiated problems to have a single solution across
the team so that developers could spend most of their time solving business problems, not technical problems.

Even minor inconsistencies can have grave cost.  We failed to establish a consistent naming convention for where internal
microservice API keys were placed in the UNIX environment.  When it came time to rotate those keys due to an employee departure, we couldn't automate it.  We spent 20+ engineer-hours manually rotating the keys.

The next time it happened, we spent three days of six developers' time to make everything consistent (yup), so it could be automated.  Then we automated it.  Now, one person can rotate the keys in under an hour (most of which is spacing out application restarts).

Another example: JavaScript frameworks.  At Stitch Fix we have AngularJS, Angular 4, React, jQuery, and an internal JS framework.
I'm on a project now that requires touching all of the UIs in a minor way, and this is going to be fairly difficult to do since
there is no consistency.  These apps are all pretty similar in what they do, so there is no functional reason they aren't using
the same framework<a name="back-1"></a><sup><a href="#1">1</a></sup>.

<aside class="pullquote">
Had I to do it over, I'd spend more time explicitly advocating for consistency
</aside>

When I reflect back on struggles the team has had, many of them would've been prevented or made less drastic had I and others been more insistent on consistency in approach.  Had I to do it over, I'd spend more time explicitly advocating for consistency.

Back to growing the team, if the core team agrees on the importance of consistency and what that means, there are two problems to solve in maintaining this burgeoning culture: keeping the culture as the team grows, and communicating the previously-solved
decisions and conventions to that growing team so they don't re-solve or re-litigate past decisions.

This starts with hiring.

## Hiring for Values

I can't do justice to technical hiring here, but what I *can* say is that you have to assess for *all* qualities you want in the
engineers you hire. The difference between a successful hire and an unsuccessful one usually comes down to values, not technical
knowledge.  A junior Fortran programming who values consistency can be taught Ruby on Rails and distributed programming.  A
mid-level developer who's only ever done agency work might never have experienced consistency, but they can learn.  A 20-year veteran expert on distributed systems who prioritizes their own way of doing things over team consistency is unlikely to change (and can tank your team's productivity).

<aside class="pullquote">
Be explicit and clear that consistency is a value
</aside>

It's hard to assess for a value like this, so you also need to make sure that new hires understand that your team values
consistency and what that means for them. Onboarding and new-hire training *must* involve setting these expectations. Be 
explicit and clear that consistency is a value, and that it's expected that all engineers avoid arbitrary inconsistency.
Managers and tech leads must continually reinforce this and mentor developers in the practice.

The harder thing is, once a developer is bought-in on consistency, where do they go to find out the current state of the world?

## Incentivizing Consistency

My experience is that most developers really do want consistency, and will do things in a consistent way if given the right tools
to do so.  But there is a limit.  Developers don't want to comb through a 100-page wiki for every change they make.  There must
be an easy way for developers to be consistent.  There must be incentives in place that make consistency the default, easiest
path.

There are three main techniques to accomplish this:

* Tribal Knowledge
* Documentation
* Tooling

Each begets the next, and each has a tradeoff, summarized in the table below:

<table class="border-rows">
  <thead>
  <tr>
    <th>&nbsp;</th>
    <th class="text-l">Cost of Creation</th>
    <th class="text-l">Cost of Change</th>
    <th class="text-l">Effectiveness</th>
    <th class="text-l">Best For</th>
  </tr>
  </thead>
  <tfoot>
  <td colspan="5"><p>Methods for incentivizing consistency and their tradeoffs</p></td>
  </tfoot>
  <tbody>
    <tr>
      <th class="text-l">Tribal Knowledge</th>
      <td>Low</td>
      <td>Low</td>
      <td>Not Very</td>
      <td>Small, senior teams</td>
    </tr>
    <tr>
      <th class="text-l">Documentation</th>
      <td>Medium</td>
      <td>Medium</td>
      <td>Medium</td>
      <td>Small to medium-sized teams</td>
    </tr>
    <tr>
      <th class="text-l">Tooling</th>
      <td>High</td>
      <td>High</td>
      <td>Very</td>
      <td>Medium-sized teams or bigger</td>
    </tr>
  </tbody>
</table>

All three of these techniques are required for the team to incentivize consistency, and each builds on the previous.  Tribal
knowledge can be documented and tooling can automate instructions in documentation.

The trick is to make the right investments at the right time.  It's never too early for documentation, and even two-person teams
would be well-served by a wiki or shared repository of text files.  I've found [Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) to be handy for this purpose.

Tooling is harder to balance.  Developers that over-invest in [meta-work][metapost] can wreak havoc on consistency as they
extract tooling earlier than is warranted.  But, if you wait too long to extract re-usable libraries or automation, teams will
start to drift apart, creating inconsistency.

An effective technique to know when to invest  is the “rule of three”.

## Rule of Three

Creating re-usable tools as your default behavior is a form over-engineering and leads to [a lack of
productivity](https://naildrivin5.com/blog/2017/07/17/four-reasons-why-developers-are-unproductive.html).  When you a second
instance of something, it feels like a pattern, but if you wait for the *third* time you see something, that's a strong indicator
there is a pattern to extract. Cohesive teams *can* detect patterns from two data points, but three is a safer bet.

<div data-ad></div>

Applying the rule of three requires two clear expectations to be set:

* Tooling or library extraction is part of the job.
* Looking broadly for patterns of re-use is part of the job.

Initially, everyone can be given both of these expectations and meeting them is reasonable.  As the team grows, however it's
particularly difficult to keep a finger on the pulse of the team and its technology to identify patterns.  As this happens, a
smaller group of technical leaders should be given this responsibility explicitly, as part of their job.

At each level of organization within a team, there can be a person responsible for the technology.  This person still does
“regular work”, but at a reduced rate so they can also keep an eye on the big picture.  This role must be explicit, and their
direction to extract tooling or re-usable libraries must be followed.

If the team's culture is of consistency, and this is explicitly part of everyone's job, the “found work” of extracting tooling or
libraries should not be treated as a disruption, but should be viewed as normal, which then gives developers the space to feel
good about doing this meta-work.

Most agile teams are able to deal with found work, and this is no other.  There should not be such a high volume that it disrupts
major plans or roadmaps, but it must be made crystal clear not just that it's OK to do, but required as part of the job of an
engineer.

Eventually, the burden of creating this tooling will be too high, and a dedicated team might be needed.

## Dedicated Tooling Team (is tricky)

The advantage of dedicating engineers to internal tools is that you have more predictability on when and how they get worked on.
The downside of such a team is the same [downside of dedicated product managers][bestworkpost]: a level of indirection between
those with a problem and those tasked with solving it.

I've experienced internal tools teams produce nothing of value for months, because they were unable to properly understand the needs of the developers and unable to prioritize delivering value (these teams tended to be over-interested in technology for its own sake).

<div class="pullquote">
The internal tools team must be the primary champion of consistency
</div>

The internal tools team must be the primary champion of consistency to the rest of the team.  This team must have an
above-average ability to quickly deliver value, gather feedback, and iterate.  Because the internal tools team isn't working on
the same business problems as the developers, they won't naturally discover areas of inconsistency or duplication—they must
actively seek them out.

Stitch Fix was able to go almost four years without needing this team.  Even now, we don't have a team 100% dedicated to internal
tooling.  We needed to get off of Heroku and that required a specialized team to build and maintain our deployment pipeline,
  infrastructure, and operations.  Our “platform team” is a natural owner for internal tooling as well.

The team is hyper-focused on iterative delivery of value, partnership with the rest of the team, consistency.  They operate as a
startup within the team, and maintain internal tools and libraries in an open-source fashion: developers contribute but platform
has oversight.

Note that the effectiveness of an internal tools team is related to the level of consistency when they are formed. An internal
tools team inheriting a bunch of inconsistent ways of doing the same thing is going to have a very hard time automating stuff or
making broad changes.  Their team will be slow and unproductive.

When the day comes that you need to dedicate engineers to internal tooling, you will be very happy if they are hired into a team
that has deeply embraced consistency.

## Conclusions

* Embrace a culture of consistency early on, when the team is small.
* Clearly set expectations around how that culture is to be maintained, including the extraction of internal tooling.
* Dedicate engineers to this problem *only* when needed, and make sure *those* engineers deeply understand iterative development
and can actively seek feedback.

If you don't embrace a culture of consistency, you will eventually require a very large team with a lot of painful process and
gate-keeping to deliver value.  It's not fun.

---

<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>There <em>is</em> a reason though: extreme instability in the JavaScript ecosystem.  Even though the teams all made sound technical choices, the inconsistency is a tax on our productivity.  Heavily invest in JavaScript at your own peril.<a href='#back-1'>↩</a>
</li>
</ol>
</footer>

[metapost]: /blog/2018/01/19/work-vs-meta-work-delivering-the-right-results.html
[bestworkpost]: /blog/2014/03/16/doing-your-best-work.html
