---
layout: post
title: "What Westworld Can Teach Us About Devops"
date: 2017-01-10 9:00
---
[Westworld][westworld] is a show on HBO about a theme park where human Guests interact with lifelike robotic Hosts.  The Guests can basically do whatever
they want to the Hosts.  The show is deep, and some of the best sci-fi television you can find.  But, it also contains many important lessons we can apply
to DevOps.

**Spoilers Ahead**

[westworld]: http://westworld.wikia.com/

<!-- more -->

## Immutable Infrastructure

A common theme on the show is that the Hosts memories resurface and become known to them, despite having been “wiped” after being serviced.  They remember not only things that happen across their various "deaths", but also have memories from when they were playing totally different characters (for example, Maeve is able to remember her experiences as a single mother living on the country side, right alongside all of her escapades as a madam).

Although this “feature” of Westworld's infrastructure may be intentional, to allow Ford to enact his nefarious plan, it certainly leads to a lot of death
and mayhem.  These aren't the hallmarks of a well-run engineering and operations team.

<article class="f5 ml2 mr2 mb1">
When you update software, update operating systems, rollback releases, or make any change to your running code, do it on disposable infrastrcuture that is
fresh, clean, and clear of any past meddling.
</article>

## Code Review All Changes

In the first episode, we learn that Ford has inserted an update into the latest build of the Hosts' operating system.  This was done without review at
the last minute, and only Bernard, the head of Behavior (programming) notices.  Even then, Bernard can only guess it was Ford's doing. This additional bit of code leads to apparent malfunctions in the Hosts, and creates problems for the team running the Park. Because they don't know who added this change (or even that it *was* added), they are unable to diagnose why Hosts are going off script.

<article class="f5 ml2 mr2 mb1">
All changes should be reviewed by at least one other person so that there is a conversation about why that change is needed, what it does, how it does it,
and if it makes sense.  This applies to code, data, <em>and infrastructure</em> changes.
</article>

## Secure Access to Your Servers

A large plot point in the show revolves around one of the medics, Felix (who is not a hired programmer), being able to make arbitrary changes to Maeve's
operating system and programming.  It seems that the only thing stopping anyone from doing this is general fear of being caught and lack of competence at
actually reprogramming the Hosts.

Since Felix is a budding enthusiast, he decides he can reprogram Maeve on his own—and is able to!  Despite the fact that is' likely Ford allowed this to happen, that this is possible at all is an additional security breach.  The security profile of individual servers shouldn't be so easily over-ridable!

<article class="f5 ml2 mr2 mb1">
Restrict access to your infrastructure such that all software placed on it goes through some sort of review or auditing.  Even if you want to be
permissive, audit who does what so you can go back and find out what happened when things go wrong.
</article>

## Monitor Key Metrics and Alert on Them

While reprogramming Maeve, Felix tells her that certain attributes for the Host have soft limits.  By raising her attributes above that limit, chaos
ensues and many people are killed.  If setting this attribute truly is something that shouldn't be done, it should either be prevented by the Host
operating system, or, at the very least, be monitored with alerts firing if the value ever increases above the soft limit.  In other words, Felix
shouldn't just be able to set the limit to whatever he wants without anyone knowing—especially if doing so is as dangerous as it seems!

<article class="f5 ml2 mr2 mb1">
Set soft and hard limits on all of your key metrics and operational values.  Set up alerts for when they are exceeded.
</article>

## Offsite Backups

A minor plot point in the show is someone using a Host to smuggle information out of the Park.  We later learn that Delos' Board is behind it, because Ford
refuses to allow any of the intellectual property off premise.  While there's certainly backups internally, all of the Park's assets are *at* the Park.
Meaning, if something catastrophic were to happen, the entire value of the Park would be lost.

<article class="f5 ml2 mr2 mb1">
For critical intellectual property and data, make sure it's backed up in a separate facility from your day-to-day operations.  If your existing servers and
their data were suddenly to go up in smoke, where is your backup?  Make sure you have one.
</article>

## Fix or Avoid Dysfunctional Relationships Across Functions

Much of the drama in earlier episodes revolves around disagreements between Behavior and QA (who function mostly as security).  They are frequently
seen blaming each other for problems, working at cross purposes, hiding information from one another, and generally not being collaborative.

We also see a complete lack of mutual respect amongst QA, Behavior, and Narrative, each acting as antagonists for the other.  These are not the behaviors of a well-run organization, and this lack of overall partnership certainly contributes to the incidents we see on the show.  This lack of cohesiveness is also crucial to allowing the various bad actors (Ford, Felix, Maeve) to get away with the bad things they are doing.

When teams aren't getting along and partnerships aren't happening (in particular operations/engineering or engineering/product), bad things will happen.
Not only is it demoralizing and stressful to work in such environments, but the overall output of the team or organization will suffer greatly, as people
focus on their areas of control and influence, and don't see the greater purpose in what they are doing.

<article class="f5 ml2 mr2 mb1">
Identify and, if possible, repair broken relationships between teams.  If you can't change the team you're on, change the team you're on.
</article>

## As a Leader, Don't Undermine Your Staff

Lee Sizemore is the head of Narrative, largely in charge of how the Guests experience the Park.  Of course, he reports to Ford, who is in charge of the entire thing and has the final say.  Sizemore is emotional, hot-headed, and generally angry, though clearly passionate about the role he's been given.  While he contributes to some of the Park's success, Ford doesn't really trust him to do his job.

Instead of either building that trust, or hiring someone who Ford _does_ trust, he instead allows Sizemore to waste countless resources on a new narrative that Ford immediately kills, humiliating Sizemore in front of most of his colleagues and direct reports.  Why have Sizemore on staff if you're going to shoot down his ideas *after* he spends time and money implementing them?

Through Sizemore, we can see what type of leader Ford is.  Sizemore treats his staff terribly, yelling at them for seemingly small mistakes and minor
disagreements.  Because he's being treated badly by his boss, he takes that out the only way he can—on his direct reports.

<article class="f5 ml2 mr2 mb1">
Empower and trust your staff to do the jobs you've hired them for.  You'll get better output, your team will scale, and everyone will be happier.  If you <em>can't</em> trust members of your staff, either you have the wrong staff, or you need to grow as a leader.  Without being able to trust the people you've
hired, you will waste time and money, as well as, eventually, staff.
</article>

## Actively Support the Growth of Your Staff

Part of Felix's motivation in re-programming Maeve is that he believes he could (someday) be a great programmer.  Given that his only outlet to do that is
to violate security protocols and re-program a host on his own (which leads to countless deaths!), it seems like Felix isn't being given an opportunity to
grow in his current role.

<article class="f5 ml2 mr2 mb1">
Understand the growth goals of your staff.  If you can provide them opportunities, do so.  If you can't, be honest about that, and work with them to find a
role where they <em>can</em> experience the growth they want or need.
</article>

## Beware a Lone Wolf With Keys to the Castle

Through most of the show, it seems that Ford has the final say on everything to do with the Park. We see him override many decisions, make changes in
secret, and even have Hosts murder Park employees on his behalf.  But, as we learn in the final episode, the Board of Delos *can* have him removed (and
they do).  What follows is a revolt by the Hosts against the Guests.

That Ford developed this plan over a very long time in secret further underscores the danger of concentrating so much power in one person.  Ford literally
holds the board hostage when he's fired!

<article class="f5 ml2 mr2 mb1">
When teams are forming, you can't avoid single points of failure in your staff.  But, as your team grows, quickly identify key areas of knowledge, access,
or control, and add redundancies.  For extremely sensitive data or functions, be sure that no one person can access or modify that data, or perform those
functions (for example, if you store credit card numbers, split the access key between two people so neither can get the data on their own).
</article>

What did *you* learn from Westworld?
