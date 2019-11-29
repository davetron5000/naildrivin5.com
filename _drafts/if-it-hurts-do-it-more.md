---
title: "If it hurts, do it more"
date: 2019-08-19 8:00
ad:
  title: "Make the Right Decisions"
  subtitle: "11 Practices to Help You Evaluate Technology"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "Configuration Design is User Experience Design…and it's hard"
  - "Explicit Code is Inclusive"
---
One of my favorite collegues (who does not use social media[]) often uses the aphorism “If it hurts, do it more”.
The [2019 State of DevOps](https://cloud.google.com/blog/products/devops-sre/the-2019-accelerate-state-of-devops-elite-performance-productivity-and-scaling) report only reaffirms this pithy phrase as one of the most impactful for engineering team excellence.  I want to talk about one simple way Stitch Fix used this to address security issues.

<!-- more -->

Most teams rely heavily on open source libraries and frameworks to do their work.  The DevOps report found that
high performing teams rely on open source more than low performs.  From page 59 of the report:

> The strongest concentration of fully proprietary software is seen in low performers, while the lowest concentration is seen among high and elite performers.

But open source isn't without cost.  If we install it and forget it, we create the seeds of a problem like the Equifax breach. It was an exploit of [CVE-2017-5638](https://nvd.nist.gov/vuln/detail/CVE-2017-5638), which was an unpatched deployment of Apache Struts (a Java-based web framework). Note that it was *caused* by mis-management and poor leadership, *not* by Apache Struts.

Updating dependencies can be painful.  GitHub [famously celebrated their Rails
upgrade](https://github.blog/2018-09-28-upgrading-github-from-rails-3-2-to-5-2/), a process that took several
senior engineers a year and a half. This pain mirrors my own observation at LivingSocial as an entire team was
dedicated to upgrading the monolithic Rails app there.

But keeping dependencies updated is critical, especialy when you consider that only some versions are maintained
actively.  For example, Rails will only apply most security patches to the [latest two releases](https://guides.rubyonrails.org/maintenance_policy.html).

If updating dependencies hurts, we should do it more often.  While I laud the efforts of GitHub to do such a
massive upgrade, they never should've been in that situation in the first place. Like all problems, it's a people
problem.  Poor management led to this situation and they are lucky that their brand attacts the type of engineers
that want to fix messes like this.

Several of the early engineers at Stitch Fix (myself included) had experienced this problem at previous jobs, and seen the drag it creates on the team. Internal libraries must support a myriad of ancient versions, security fixes go unpatched or require manual patching, and you end up just dreaded work in codebases using such old versions of technology.

So, we decided that every month we would upgrade all dependencies in all applications.  Dependencies don't change
all that much month to month (at least not with Ruby—JavaScript libraries usually include breaking changes every time since the community is more cavalier).

This forces a few good behaviors.  First, it puts you face to face with just how fragile your systems are and how
they might break.  If a point release of Angular stops your app rendering, you will learn a lot about your test
suite and how you built your app.  Second, it creates a culture of responsibility around application security as
well as acknowledging the importance of using modern versions of tools.  Only the most diligent product manager can undo something like this if it's done on a cadence.

Of course, it sucks having to do these upgrades, and it amazes me how short-sighted some senior engineers can be
about it.  I understand a less experienced person not seeing the across-the-board dangers of running on old tech,
but a more senior engineer should see the system view - we absorb the small pain of updates to avoid the
larger (and harder to fix) pain of running ancient versions for years.

The solution? Do it more often.  If I could send a message to the past, it would be to do upgrade dependencies
weekly.  Every Monday, you do your updates, see what breaks, and set expectations for the week about what's
getting worked on.  Week-to-week dependencies shouldn't break much, but if they do, it's a sign you might've made
[a poor choice of technologies](https://naildrivin5.com/blog/2019/08/08/choosing-technology.html).  Breaking
changes will always be there, but should be more isolated the more often you upgrade.

What else can you apply “if it hurts, do it more” to?  Some ideas:

* Sprints
* Releases
* Testing
* Deployment
* Incident Response

The key insight here is that an engineering team's job isn't just to produce working software. They must create a
sustainable ecosystem for that software's development—if they don't, who will?.  Yes, this is a form of [meta
work](https://naildrivin5.com/blog/2018/01/19/work-vs-meta-work-delivering-the-right-results.html), but the ROI is
clear.  And make no mistake, that same product manager that convinced you to deliver some feature instead of
upgrading dependencies will not be happy when the team has to stop what they are doing do fix security issues, or
when the team gradually leaves to work elsewhere in order to use more modern technology.
