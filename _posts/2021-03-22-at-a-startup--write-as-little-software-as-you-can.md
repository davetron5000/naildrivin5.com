---
layout: post
title: "At a Startup? Write as Little Software as you Can"
date: 2021-03-31 9:00
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images//sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

Since May of last year, I've been CTO of [Mood Health](https://moodhealth.com), which is a pre-Series-A startup providing
clinical treatment for anxiety and depression. The engineering team is myself and one other person, and what I've experienced is
something I knew intellectually: write as little software as possible.

To do this effectively requires understanding how the business works, designing your code, process, and tools for constant
change, and being ruthless in delivering solutions that require the least amount of software.  I want to talk about exactly what
this means and why it's important.

<!-- more -->

## What Mood Does

You can [skip](#product) this if you don't care what Mood does, but a bit of backstory is useful. Namely, the product of Mood is
not a piece of software.  The product is a series of appointments with clinicians that will help you deal with your anxiety and
depression through medication, therapy, or both.

Certainly, software is involved in making this happen, but our customers come to us for the care we provide and stay because
they are getting helped.  The software required to make that happen should not mess that up and, if possible, help.

Being an early stage startup, there are aspects of the business that are unknown.  What is the optimal pricing strategy?  What
are the best ways to get good customers?  How do we manage clincians? How to we get customers to pay and show up on time?  And
how do we do all of this given that our customers—by definition—are at what could be the lowest point in their lives?

Our journey as a company is to figure out the answers to these questions and try to operate as efficiently as we can.  To do this
requires understanding how the business works.

<a name="product">&nbsp;</a>
## Step 1 - Understand How the Business Works

One of the first things I did was to pull together a "dashboard" of Key Performance Indicators or KPIs.  This dashboard is a
series of Heroku Dataclips and Google Sheets.  Some data comes from our database and some must be manually entered, but this
dashboard is a central place where everyone sees the same view of the business as everyone else.

For example, *show rate*—the % of appointments where a customer attends—is critical to ensure the business can be viable.  If a
normal show rate is 90% that means we can ultimately charge customers less than if it's 70%. If everyone isn't clear on how
this value is calculated and what the source of truth is, we can't make decisions.

As the person responsible for technology, it's my responsibility to make sure that this data is available *and correct*.  There
is no code more important at a startup than the code to ensure the data used to make decisions is correct and available.

<div data-ad></div>

And the only way to do this is understand how the business works.  You have to understand the relationship between customer
behavior, operations, and marketing.  If we pay $10,000 to Facebook and our show rate is 50%, what would we need to pay a sales
associate to acquire customers who actually show up?

Delivering reports on key data is a way to make sure you do understand the business fundamentals.  These fundamentals then contribute to
every single product decision you make.  Those decisions often result in writing software, so you need to be sure you aren't
writing software you don't need.

## Step 2 - Build Only What You Need

Software is a massive liability. It's expensive to produce and change, and mistakes in its construction can kill a company.  The
single best way to manage this responsibility is to minimize the software you build by building only what you need at the time
you need it.  When a new need arises, always start with a scrappy solution. And I mean *very* scrappy.

I have been constantly surprised about just how polished a lot of people's "scrappy" solutions are, so there's two things you
can do to avoid over-building:

* Start by outlining a completely manual process that would solve the problem. How expensive or error-prone is this process?  Could
automating only *some* of it result in an inexpensive yet reliable process?
* Reframe all questions about what the software can do to questions about what is important to solve for and how much time are we willing to spend.  My collogues used to ask "can we make the system do X?". The answer is always "yes!".  I say this frequently: "We can make it do anything we want, it's just a matter of time, money, and maintenance.  What's the problem we are trying to solve?"  Now they ask "what's the effort in changing the system to do X?" which is a much better question.

<div class="pullquote">
Start by outlining a completely manual process that would solve the problem.
</div>

For example, our customer service team was trying to solve increasing show rate—getting more people to show up to appointments.  Over a month
or two they manually pulled appointment schedules, went into Zendesk and manually emailed, texted, or called people to try to remind them of
appointments, help them understand the service and, ultimately, show up.

After that time, our customer service time had a well-documented and reliable process that did increase the show rate.  It was just all done
manually and would never scale.  But we aren't (yet) solving a scaling problem, we're solving a business problem.  By creating and tweak a
process that doesn't require software changes, the team figured out a workable solution.

That solution had obvious inefficiencies, which we could then solve by shipping quickly in small steps.

## Step 3 - Ship Quality Software Quickly When Needed

When you ask people to do a manual process so you don't overbuild, they will go along with it to a point.  Eventually, you do need to provide
that hypothetical partial automation to relieve the most burdensome parts of any manual task.  And you most do so quickly but without sacrificing
quality.

This is a tough balance, especially because many developers equate *quality* with fancy data structures, advanced technology, or heavy use of
"flexible" design patterns.  This is not what I mean. I mean that the code works for its intended use case (and only that) and that can be
understood quickly if it *isn't* working.  I'll discuss our approach to quality in a future post.

To work quickly, the team needs to have an environment where they can focus on the problem they are solving reduce the amount of time spent
on [meta-work](https://naildrivin5.com/blog/2018/01/19/work-vs-meta-work-delivering-the-right-results.html).  It means the team should strive
to use tools they understand and have already built any custom tooling they need to avoid slowness or confusion while working. I'll discuss our
approach to this in a future post as well, but we are using Rails and Heroku, which we both deeply understand and can use effectively.

<div class="pullquote">
To work quickly, the team needs to have an environment where they can focus…
</div>

The last part about working quickly is to break up the work into shippable chunks that, on their own, deliver value and solve part of the
part of the overall problem.

For example, our customer service team discovered that some people respond to texts and others email, so two days before an appointment they
were texting *and* emailing.  We shipped email automation first because it's useful on its own and we already had email infrastructure set up
in our code, so it was the quickest to get working.

When you work this way, you will build trust with the people doing all the manual work that informs the software you need to build. This
trust forms a feedback loop and you'll work collaboratively for quite a long time. You'll need this because sometimes you have change gears.

## Step 4 - Be Flexible and Change Focus as Needed

When the team can work quickly and ship partial solutions, the team can easily change focus when work becomes unblocked.  This requires a
mindset based on _flexibility_.  The team *must* have the attitude that they can solve whatever problem is needed, given clear priorities and
time to do so.

For example, while building the above-mentioned customer service automation, we did decide to change the sign-up flow for our service to
hopefully improve conversions.   This happened several times with problems more critical than automating customer engagement. It took almost
three months from start to finish before we had provided *all* the automations our customer service team needed.

<div class="pullquote">
The team was flexible and able to change focus by working in an organized way
</div>

But during that three months we shipped a lot of other solutions as well, many of which solved problems none of us knew we'd need to solve
that, once discovered, were absolutely critical.  Because the team was flexible and able to change focus by working in an organized way, bolstered by trust and collaboration with the rest of the company, we were able to both solve the most important problems *and* keep moving on other important problems as well.

This leads to the last step, which is to have a prioritized list of valuable work and don't just so "no" to problems that aren't critical
right now.

## Step 5 - Prioritize Instead of Saying "No"

When prioritizing, it can be helpful to say "no" to certain initiatives to maintain overall team focus.  The problem with this approach is
that you can cull too much valuable work.  When a company initiative is in a state where there is no need for engineering contribution, you
end up having slack time on your engineering team and this can breed problems.

Instead of filling time with meta-work, you want the engineering team to provide business value.  The way to do that is to keep a prioritized
list of work that is larger than your capacity so that when critical work becomes blocked, the engineering team can pick up the less
critical—but still important—work.

For example, we needed a week of time running ads with new creative treatments.  Marketing was the most important company priority at the
time, but there's engineering work needed while letting the ads run.  Instead of twiddling our thumbs or creating technical debt we tackled
important-but-less-critical work.

Because many problems that exist are being solved by well-defined inefficient manual processes, that forms a natural backlog of impactful
work to do.  And because the team is designed to work quickly, shipping small features that help frequently, a lot of value can be delivered
in a few days or a week while waiting for something else to become unblocked.

## Up Next

This post is a lot of context setting for upcoming posts that will get into specifics. I want to share our exact tooling, design, process, and software choices because I think it could be helpful. I know I *always* like to hear how people in a similar situation to me are working.  But all the web frameworks and testing strategies in the world won't help if you aren't following a product-focused process as described above.

