---
layout: post
title: "Estimates are Fine. They Build Trust When You Provide Them And Deliver On Them"
date: 2024-05-10 15:00
ad:
  title: "A Crap Dev Environment Kills Productivity"
  subtitle: "Docker and Bash Have you Covered"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

[Marco Rogers](https://social.polotek.net/@polotek#.) asked about estimates on Mastodon, and I agree with a lot of what he's written. Engineers often think they should not have to do estimates, going so far as to champion the "no estimates" movement, or claiming that engineers should not have to be accountable for their work.  Writing software is expensive, and the people paying for it have every right to ask the developers when it might be done.

<!-- more -->

I want to go through a process for giving an estimate and running a project, since both are intertwined.  Successful delivery makes estimates easier, and realistic estimates support successful delivery. After that, I'll touch on why estimates are not some evil thing that is done to us and that they can actually make you better and build trust in you and your team.

<figure style="padding: 1rem; border-radius: 0.125rem; box-shadow: rgb(224, 224, 224) 1px 1px 3px 1px;">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0.00 0.00 583.00 612.60">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 608.6)">
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-608.6 579,-608.6 579,4 -4,4"/>
<g id="clust1" class="cluster">
<polygon fill="none" stroke="#000000" points="8,-226 8,-536 430,-536 430,-226 8,-226"/>
<text text-anchor="middle" x="80.1669" y="-519.4" font-family="Baskerville" font-size="14.00" fill="#000000">Estimation &amp; Planning</text>
</g>
<g id="clust2" class="cluster">
<polygon fill="none" stroke="#000000" points="173,-8 173,-207 567,-207 567,-8 173,-8"/>
<text text-anchor="middle" x="479.7082" y="-190.4" font-family="Baskerville" font-size="14.00" fill="#000000">Execution (weekly cadence)</text>
</g>
<g id="node1" class="node">
<title>First, align on why estimates are needed and what is being estimates</title>
<polygon fill="none" stroke="#000000" points="280.1839,-604.4019 159.8161,-604.4019 159.8161,-563.1981 280.1839,-563.1981 280.1839,-604.4019"/>
<text text-anchor="middle" x="220" y="-588" font-family="Baskerville" font-size="14.00" fill="#000000">
    <a href="#why-are-you-being-asked-for-an-estimate">Align on Why</a>
</text>
<text text-anchor="middle" x="220" y="-571.2" font-family="Baskerville" font-size="14.00" fill="#000000">
    <a href="#why-are-you-being-asked-for-an-estimate">We are Estimating</a>
</text>
</g>
<g id="node2" class="node">
<title>Second, Create your Estimate</title>
<polygon fill="none" stroke="#000000" points="280.4692,-503.2 159.5308,-503.2 159.5308,-467.2 280.4692,-467.2 280.4692,-503.2"/>
<text text-anchor="middle" x="220" y="-481" font-family="Baskerville" font-size="14.00" fill="#000000"><a
href="#providing-an-estimate-requires-experience-and-honesty">Estimate the Work</a></text>
</g>
<g id="edge1" class="edge">
<path fill="none" stroke="#000000" d="M220,-562.8895C220,-548.5592 220,-529.3744 220,-513.6551"/>
<polygon fill="#000000" stroke="#000000" points="223.5001,-513.4284 220,-503.4284 216.5001,-513.4285 223.5001,-513.4284"/>
</g>
<g id="node3" class="node">
<title>Third, Present Your Estimate and Explain your Reasoning</title>
<polygon fill="none" stroke="#000000" points="283.9706,-392.0019 156.0294,-392.0019 156.0294,-350.7981 283.9706,-350.7981 283.9706,-392.0019"/>
<text text-anchor="middle" x="220" y="-375.6" font-family="Baskerville" font-size="14.00" fill="#000000">
<a href="#can-you-do-it-faster">Present and Explain</a>
</text>
<text text-anchor="middle" x="220" y="-358.8" font-family="Baskerville" font-size="14.00" fill="#000000">
<a href="#can-you-do-it-faster">the Estimate</a>
</text>
</g>
<g id="edge2" class="edge">
<path fill="none" stroke="#000000" d="M220,-467.1681C220,-449.7695 220,-423.0835 220,-402.2965"/>
<polygon fill="#000000" stroke="#000000" points="223.5001,-402.0444 220,-392.0444 216.5001,-402.0444 223.5001,-402.0444"/>
</g>
<g id="node4" class="node">
<title>While presenting your estimate, see if scope can be reduced to allow reducing the estimate</title>
<polygon fill="none" stroke="#000000" stroke-dasharray="5,2" points="421.6927,-275.4019 326.3073,-275.4019 326.3073,-234.1981 421.6927,-234.1981 421.6927,-275.4019"/>
<text text-anchor="middle" x="374" y="-259" font-family="Baskerville" font-size="14.00" fill="#000000">Reduce Scope</text>
<text text-anchor="middle" x="374" y="-242.2" font-family="Baskerville" font-size="14.00" fill="#000000">from Project</text>
</g>
<g id="edge3" class="edge">
<path fill="none" stroke="#000000" d="M247.5321,-350.5543C272.9352,-331.3205 310.7952,-302.6551 338.4697,-281.7015"/>
<polygon fill="#000000" stroke="#000000" points="340.8464,-284.2921 346.7062,-275.4653 336.6209,-278.7113 340.8464,-284.2921"/>
</g>
<g id="node5" class="node">
<title>While presenting your estimate, see if areas of uncertainty can be clarified to allow reducing the estimate</title>
<polygon fill="none" stroke="#000000" stroke-dasharray="5,2" points="113.7437,-275.4019 16.2563,-275.4019 16.2563,-234.1981 113.7437,-234.1981 113.7437,-275.4019"/>
<text text-anchor="middle" x="65" y="-259" font-family="Baskerville" font-size="14.00" fill="#000000">Clarify areas</text>
<text text-anchor="middle" x="65" y="-242.2" font-family="Baskerville" font-size="14.00" fill="#000000">of Uncertainty</text>
</g>
<g id="edge4" class="edge">
<path fill="none" stroke="#000000" d="M192.2891,-350.5543C166.7211,-331.3205 128.6152,-302.6551 100.761,-281.7015"/>
<polygon fill="#000000" stroke="#000000" points="102.5664,-278.6799 92.471,-275.4653 98.3583,-284.2738 102.5664,-278.6799"/>
</g>
<g id="node6" class="node">
<title>Fourth, hard-rank every task or feature from most important to least</title>
<polygon fill="none" stroke="#000000" points="290.278,-275.4019 149.722,-275.4019 149.722,-234.1981 290.278,-234.1981 290.278,-275.4019"/>
<text text-anchor="middle" x="220" y="-259" font-family="Baskerville" font-size="14.00" fill="#000000"><a
href="#plan-to-work-iteratively-in-priority-order">Hard-prioritize</a></text>
<text text-anchor="middle" x="220" y="-242.2" font-family="Baskerville" font-size="14.00" fill="#000000"><a href="#plan-to-work-iteratively-in-priority-order">Every Feature or Task</a></text>
</g>
<g id="edge7" class="edge">
<path fill="none" stroke="#000000" d="M220,-350.5543C220,-332.4812 220,-306.0803 220,-285.5753"/>
<polygon fill="#000000" stroke="#000000" points="223.5001,-285.4652 220,-275.4653 216.5001,-285.4653 223.5001,-285.4652"/>
</g>
<g id="edge6" class="edge">
<path fill="none" stroke="#000000" stroke-dasharray="1,5" d="M367.0433,-275.5991C363.9525,-286.6148 361,-300.4485 361,-313.1 361,-429.7 361,-429.7 361,-429.7 361,-446.5325 325.7672,-460.4049 290.5258,-470.0704"/>
<polygon fill="#000000" stroke="#000000" points="289.3919,-466.7497 280.615,-472.684 291.1769,-473.5183 289.3919,-466.7497"/>
<text text-anchor="middle" x="388.4015" y="-367.2" font-family="Baskerville" font-size="14.00" fill="#000000">as needed</text>
</g>
<g id="edge5" class="edge">
<path fill="none" stroke="#000000" stroke-dasharray="1,5" d="M65,-275.5763C65,-286.7056 65,-300.6505 65,-313.1 65,-429.7 65,-429.7 65,-429.7 65,-449.0421 108.3221,-463.4449 149.1596,-472.7249"/>
<polygon fill="#000000" stroke="#000000" points="148.6681,-476.2 159.1848,-474.9158 150.1626,-469.3614 148.6681,-476.2"/>
<text text-anchor="middle" x="92.4015" y="-367.2" font-family="Baskerville" font-size="14.00" fill="#000000">as needed</text>
</g>
<g id="node7" class="node">
<title>Fifth, if needed, split the next task to extract a one-week task from it</title>
<polygon fill="none" stroke="#000000" stroke-dasharray="5,2" points="259.1118,-174.0019 180.8882,-174.0019 180.8882,-132.7981 259.1118,-132.7981 259.1118,-174.0019"/>
<text text-anchor="middle" x="220" y="-157.6" font-family="Baskerville" font-size="14.00" fill="#000000">Split Tasks</text>
<text text-anchor="middle" x="220" y="-140.8" font-family="Baskerville" font-size="14.00" fill="#000000">as needed</text>
</g>
<g id="edge8" class="edge">
<path fill="none" stroke="#000000" d="M220,-233.7899C220,-219.419 220,-200.1344 220,-184.0556"/>
<polygon fill="#000000" stroke="#000000" points="223.5001,-184.0363 220,-174.0363 216.5001,-184.0363 223.5001,-184.0363"/>
</g>
<g id="node8" class="node">
<title>Sixth, deliver and demonstrate a week's worth of work</title>
<polygon fill="none" stroke="#000000" points="559.2199,-174.0019 402.7801,-174.0019 402.7801,-132.7981 559.2199,-132.7981 559.2199,-174.0019"/>
<text text-anchor="middle" x="481" y="-157.6" font-family="Baskerville" font-size="14.00" fill="#000000"><a href="#deliver-and-revisit-everything-weekly">Deliver and Demonstrate</a></text>
<text text-anchor="middle" x="481" y="-140.8" font-family="Baskerville" font-size="14.00" fill="#000000"><a
href="#deliver-and-revisit-everything-weekly">One Week's Work</a></text>
</g>
<g id="edge9" class="edge">
<path fill="none" stroke="#000000" d="M259.252,-153.4C303.6776,-153.4 348.1032,-153.4 392.5288,-153.4"/>
<polygon fill="#000000" stroke="#000000" points="392.6086,-156.9001 402.6086,-153.4 392.6086,-149.9001 392.6086,-156.9001"/>
</g>
<g id="node9" class="node">
<title>Last, revise your estimates based on the work done to date.</title>
<polygon fill="none" stroke="#000000" points="420.9089,-57.4019 301.0911,-57.4019 301.0911,-16.1981 420.9089,-16.1981 420.9089,-57.4019"/>
<text text-anchor="middle" x="361" y="-41" font-family="Baskerville" font-size="14.00" fill="#000000">Revise Estimate</text>
<text text-anchor="middle" x="361" y="-24.2" font-family="Baskerville" font-size="14.00" fill="#000000">Given Work Done</text>
</g>
<g id="edge10" class="edge">
<path fill="none" stroke="#000000" d="M459.5464,-132.5543C440.0078,-113.5692 411.0118,-85.3948 389.5265,-64.5182"/>
<polygon fill="#000000" stroke="#000000" points="391.8789,-61.9238 382.2679,-57.4653 387.0008,-66.9442 391.8789,-61.9238"/>
</g>
<g id="edge11" class="edge">
<path fill="none" stroke="#000000" d="M336.0103,-57.4653C312.9232,-76.5571 278.4645,-105.0528 253.0983,-126.0293"/>
<polygon fill="#000000" stroke="#000000" points="250.6839,-123.4842 245.208,-132.5543 255.1448,-128.8787 250.6839,-123.4842"/>
</g>
</g>
</svg>
  <figcaption class="">
  An overview of the estimation and project-deliver process. Elements are clickable to their sections below.
  </figcaption>
</figure>


## Why Are You Being Asked for an Estimate?

The first thing to do is ask what is being requested, what is needed, and why does that require an estimate.  Ask probing
questions to build alignment, such as:

* Is there a critical feature that must exist?
* Should we focus on solving a specific problem as best we can?
* Are we weighing projects against each other to prioritize?
* Do we need to explore a concept through quick iteration?
* Are other teams coordinating on this delivery?

You want to build alignment with everyone on exactly what is being proposed.  You must lead this, because product managers, designers, and "stakeholders" are often very wrong about what parts of a project are time consuming and which are not.  With no-code and AI-driven products, this problem is worse.

<aside class="pullquote">It’s your job to make them understand what is time consuming and why.</aside>

It's your job to make *them* understand what is time consuming and why.  *You* are responsible for identifying areas of
uncertainty to explore more deeply. It's also your job to discover other dependencies outside the software that you need to be
aware of, such as customer server training, ad campaigns, etc.

With this alignment, you can now deliver an estimate.

## Providing an Estimate Requires Experience and Honesty

There's no formula for coming up with an estimate. Many have tried<sup id="back-1"><a href="#fn_1">1</a></sup>.  Marco's posts
outline some techniques, but it boils down to experience.  This experience is a combination of repeated delivery of software and
mentoring by those who have more experience estimating delivery.  Keep in mind that *no* amount of experience can allow you to accurately estimate any project.

<aside class='pullquote'>Keep in mind that <strong>no</strong> amount of experience can allow you to…estimate any project.</aside>

You will need to combine three basic strategies:

* Accurately estimate stuff you generally know how to build. For example, I'm pretty confident I can estimate how long it will
take to build a web form, validate its input, and store it in a database.
* Increase your estimate in relation to the amount of uncertainty there is.  The more uncertainty, the more likely things will
take longer.
* If there is so much uncertainty that you can't come up with anything, you can estimate time to explore the project and get a
better estimate.  This technique is extremely common outside software and it can work well to either let you figure out what you
need to do *or* motivate the stakeholders to try to remove uncertainty (if they can).

The more experience you get, the better you get, however you have to pay attention during delivery, as this is your feedback
about how good your estimates are.

Figuring out the estimate is easier than negotiating it.

## Can You Do it Faster?

Every estimate I've given has been met with either "can you shorten it?" or "why is it so long?".  This is natural, but how you
handle this is critical to successfully delivering the project and building trust with both your team and the project's stakeholders.

You can feel free to paraphrase [Bender's Oscar Guarantee](https://www.youtube.com/watch?v=DGZ10kZ4lmE) to Calculon thusly:

> I can tell you any number you want, but it won't change what you've asked me to do.

Perhaps you should be less flippant, but the core message is that your estimate is a best guess based on what you've been told.

You can:

* Improve your guess with more information. And you should have ready what information you need.
* Reduce your estimate by removing scope. And you should have ready what scope, when removed, would meaningfully reduce the
estimate.

<div data-ad></div>

Remember, most product managers and company stakeholders don't understand what is time consuming in software. They usually
assume important things take a long time, and minor features are easy.  Get ahead of this by having a list ready of what cuts
will reduce uncertainty and be meaningful.

Also, your estimate should include assumptions you are making.  For example, "assuming a 3 person team" or "assuming access to a
new database instance" or whatever.  You must *not*, however, accept assumptions from others in order to reduce your estimate.
Remember that the non-engineers will not have a good sense of what takes a long time or what is complex.

If assumptions are proposed as a way of reducing your estimate, you have two responses:

* "I was already assuming that, thanks for the reminder, let's write that down"
* "We can't control that, and I don't want to give you a false sense of security by lowering the estimate"

Remember, *you* are the expert here, and *you* must take ownership for the estimate.  *You* know what assumptions are likely to
hold.

The first time you do this with a new team, this all will be hard. It's a lot of non-coding negotiating that can feel like
politicking.  And, while it kinda is, it will get easier as you successfully deliver projects.  The best way to build trust is to
get your shit done.

How you do that matters.

## Plan to Work Iteratively in Priority Order

Once everyone is agreed on the estimate and the project is scheduled to start, you can overlay your estimate onto a calendar and
come up with a date. Don't forget about holidays, PTO and, if the project is long enough, attrition.  Show your work so everyone
agrees on the projected completion date of the project.

I know this will feel like giving a deadline, and the `#NoEstimates` people are angry, but the world does not revolve around the
software engineers.  Other people will need to coordinate with whatever it is you are building, and it's extremely hard to
coordinate around weekly deliveries of whatever.  Dates are the simplest way to coordinate across many teams.

<div class='pullquote'>The world does not revolve around software engineers.</div>

The way to manage this is to run the project in a way that constantly reminds everyone that this date is a projection and not a
deadline.

The first step toward doing that is to ask what happens when things take longer than we expect.  Will the team ship what it has, or should the team keep working to delivery everything originally requested?

## An Estimate is Just an Estimation in the Category of Guesstimates, What's the Problem?

On projects where your team must coordinate with others, the stakeholders will almost always want to ship whatever is ready on
the projected date, and treat the unfinished work as a "fast follow". That said, it can feel like you are already telling them the project is behind before work has started.

You can assure them, you stand by your estimate, but that it is just an estimate.   This will be the first of many times you will
remind everyone that the date is a best guess.  But this time, at the start of the project, you will also let everyone know how
you will manage this risk.

You manage the risk of not completing everything on the projected date by working on the most important or most uncertain things first. This way, your projection can be improved over time, and you are always sitting on the most valuable features, fully completed.

<aside class="pullquote">We will work in order. I’m happy to choose the order in which we work.</aside>

Inexperienced stakeholders will not usually agree to put everything into a hard-prioritized list.  They will want buckets and
they will put everything in the "high" or "medium" priority bucket.  This is not what any reasonable person would call
_prioritization_.  Bucketing can help prioritize, but you need features/tasks/whatevers in a single ordered list that you will
work from.

If the stakeholders won't help, you can solve this problem easily.  Tell them that you have to work in some sort of order and you
are happy to choose the order in which things are completed.  Tell them further that your preference is that *they* have input
into this ordering to ensure that the most valuable aspects of the system are delivered as quickly as possible.

If this doesn't work, you are not dealing with serious people, but you can certainly create the prioritized list.  Sometimes, when people see *your* list of priorities, they suddenly have an appetite for providing input.

## Deliver and Revisit Everything Weekly

At this point, the project has been planned, and your original estimate still holds, and thus your prioritized list of things to
do has a single line at the bottom with the projected completion date next to it.  This list is how you will manage the project's
delivery and communicate its status.

Each week, you will deliver working software that can be demonstrated to the stakeholders in a way that they can understand what
you've done. If this can be delivered to real users, that's great, too.

<aside class="pullquote">Each week…deliver software that can be demonstrated to the stakeholders in a way…they can understand.</aside>

If the most important task cannot be completely
delivered in a week, you must break it down into at least two tasks such that one of those tasks *can* be delivered in a week. You must maintain a clear mapping between your breakdown and the original list.

Don't over-do breaking up tasks.  If you have a large task that can't be done in a week, you don't need several sub-week tasks.
You just need the one that you are going to work on. You can break down the remaining work later if needed.

At the end of each week, revise your estimate, based on work done so far:

* What items from the list do we think are deliverable by the original date?
* What date do we think all items from the list could be delivered?

You should also be prepared to explain why your estimates have changed. Show respect for the product managers, designers, and
stakeholders by giving a better explanation than "it took longer than we thought".  Even if you need to get a bit technical,
the stakeholders can often understand enough of these details to maintain their trust in you. Such details can also improve your own estimation skills when you verbalize precisely why something took longer than you thought.

This weekly review is also a good time to re-prioritize the work.  As the software is demonstrated and becomes real, the
stakeholders may change their mind about what is important.  Move things around and, if needed, update your estimates.

## Detailed Review at Halfway

Although your weekly reviews will keep everyone aligned, you need to get ahead of whatever is going to happen when the originally projected date arrives and all the work is not completed.  Halfway through the project, you should have a more accurate estimate, and  you should start having pointed discussions with stakeholders about what's going to happen.

Most product managers and other stakeholders will not be as focused on the project as you, and will assume that it'll all work
out if they aren't told otherwise. You must lead a discussion to set expectations.  Your opening proposal is that, on the
originally projected completion date, launch happens as planned. The system will have the most important stuff, and you can
itemize out exactly what that is.

If there is a perception that the project is "behind", you need to remind everyone that the projected completion date was just an
estimate, and that you have been revising it weekly.  You can remind them of the reasons why work hasn't gone as fast.

You will then need to manage suggestions on how to get the project "back on track".  Inexperienced leaders will ask you and your
team to "work harder". You will need to explain that each additional hour worked does not move the project's delivery date
forward an hour.  You will need to explain that, over time, this will make the project later due to team burnout.

<aside class="pullquote">You will then need to manage suggestions on how to get the project “back on track”.</aside>

You will also be asked to add more engineers to the project.  Rather than simply quote Fred Brooks' Mythical Man Month, I'd
suggest you actually itemize out what you think is required to onboard a new person and add them to the team.  Show the
stakeholders where the project will slow down and grind to a halt.  Show them how it may not actually catch back up.

This discussion will be had whether you drive it or not.  If you don't drive it, it'll happen late enough in the project that
everyone will be stressed and tempers may flare.  Get ahead of it by taking ownership at the halfway mark.  Depending on how big
the project is, you should do it again at the 75% mark.

If you do this, you and your team will appear extremely competent. You will be viewed as reliable and trustworthy.  This will
ensure that the project will end well and that future projects will go more smoothly with you there.

## Why Even Engage with Estimates?

The [No Estimates Movement](https://ronjeffries.com/xprog/articles/the-noestimates-movement/), boggles my mind, as it seems to be
the quickest way to destroy trust while demonstrating a complete lack of systems thinking. Their site makes this claim:

> The basic idea, as I understand it, is that it is possible to do small chunks of work incrementally, leading as rapidly as possible to a desired shippable product, and that when you do that there is no need to do much of anything in the way of estimating stories or the project.

Imagine being a product manager on a new major product at your company, that will need an advertising campaign, customer service
training, and support documentation written being told by the engineering team "we'll just work one week at a time and I'm sure it'll be fine". What the actual fuck.

_(I would agree that estimating <del>stories</del>individual features is not as valuable as estimating projects, but you still
 need to be able to figure out how big something is to determine if it needs to be broken down into smaller parts. That's
 estimation!)_

<aside class="pullquote">[If you] don’t provide an estimate, one will be provided for you.</aside>

The reality is that we are paid to do work, and the people paying us have every right to ask what might be involved in doing that
work.  And, the reality is also that if your team's work must be coordinated with others, and you don't provide an estimate, one
will be provided for you.

Despite what the [`#NoAccountability`](https://holub.com/noaccountability/) people say, you *will* be held accountable.  My
recommendation is to start acting like it.

---

<footer class='footnotes'>
<ol>
<li>
<a name='fn_1'></a>
<sup>1</sup>“Tried and failed?” “Tried and died”<a href='#back-1'>↩</a>
</li>
</ol>
</footer>



