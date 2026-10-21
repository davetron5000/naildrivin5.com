---
layout: post
title: "Why Even Write Code in a Professional Context?"
date: 2026-10-19 9:00
related:
 - "I'm Gonna Write About AI So I Can Process What is Going On"
 - "The Death of the Software Craftsman"
mcdouble:
  mastodon:
    id: '117467941283412667'
    url: https://ruby.social/@davetron5000/117467941283412667
    posted_at: '2026-10-19T14:02:17Z'
  bluesky:
    id: at://did:plc:5qa544tzvkfohwvc34r37z2c/app.bsky.feed.post/3myabv5y3go2e
    url: https://bsky.app/profile/did:plc:5qa544tzvkfohwvc34r37z2c/post/3myabv5y3go2e
    posted_at: '2026-10-19T14:02:17Z'
---

I wish I'd retired before the industrial revolution of computer programming happened, but I have not and cannot. So I must come to grips with
the fact that in many cases, AI-powered tools can do a perfectly fine job of writing code.  The following is a brief pursuit of the facts as I
see them and I just can't see how in any professional workplace, it makes sense to write code by hand any more.

<!-- more -->
<article class="social-media-excerpt">
This is the thought process that lead to me deciding to write about AI.  I hate the conclusions I've drawn here.
</article>

<aside class="please-be-aware">
<p>
This is not an AI-boosting post, but something I'm writing to process the realities of being a professional software developer.  Read <a href="/blog/2026/10/15/i-m-gonna-write-about-ai-so-i-can-process-what-is-going-on.html">my original post</a> for where I am coming from and why I'm writing this.
</p>
</aside>

This realization came when I accepted that the coding part of software development doesn't matter as much as us programmers like to think
*and* that AI-generated code is probably fine (but certainly not great).  I just can't come up with a convincing reason to write code by
hand, even if "code quality" (a specious term at best) matters.

## Does Quality Matter and How Close Can the AI Get?

In [a previous post](/blog/2026/02/23/the-death-of-the-software-craftsman.html), I posited that if AI is a black box that accepts a software system and requirements, producing a new system that meets those requirements, does it matter how it does that and what the code looks like?


<figure>
{% inline_svg images/ai-does-code-matter-1.svg "Flow chart showing 'Any System' and 'Description of Change' going into 'Black Box', out of which comes 'Updated System with Change'. A note points to the last node and says 'Does the code in here matter?'" %}
<figcaption>
A question that's on my mind (<a target="_new" href="/images/ai-does-code-matter-1.svg">Open bigger version in new window</a>)
</figcaption>
</figure>

Let's suppose the way the code is written and structured *does* matter (I'm not sure it does, but I want to believe it does).  If the
AI-generated code doesn't meet our standards, wouldn't the natural  response be to include those standards as part of the instructions and
provide it with a static analyzer that gives it a yes/no on compliance?

<figure>
  {% inline_svg images/ai-does-code-matter-2.svg "Flow chart showing 'Any System', 'Description of Change' and 'Code Quality Rules' going into 'Black Box'.  'Black Box' goes to a node labeled 'Updated System with Change' that goes to a decision node labeled 'Static Quality Checks'.  From there an edge labeled 'Checks failed' goes back to 'Black Box'. An edge labeled 'Checks passed' goes to a node labeled 'Updated System with Change Satisfying Quality Construction Rules'" %}
  <figcaption class="">
    A better black box? (<a target="_new" href="/images/ai-does-code-matter-2.svg">Open bigger version in new window</a>)
  </figcaption>
</figure>

Let's further assume that code generated this way is still of lower quality than the code a programmer might write. I am not convinced this is
true, but suppose it is.  How much lower is the AI's code quality?  Is it low enough to actually matter in a professional context?

When we take a system view of software development, it is not.

## A System View of Software Development

I have seen experienced developers spin their wheels unable to ship. I've seen inexperienced developers apply zero design patterns and best
practices ship code without incident that went on to never cause a problem.  And every combination in between.

When you look at software development from a whole system view, not just the coding part, you'll see the coding part doesn't affect how, when, or if things get done nearly as much as developers might think it does.

Software development is a process in three parts:

1. **Selection** - which features are going to be built? 
2. **Scoping** - refining the details of what the feature is
3. **Delivery** - building the feature

We often think this process is a flow, which seemingly gives equal weight to each part of that flow:

<figure>
  {% inline_svg images/ai-process-simple.svg "A flow chart showing 'Selection' going to 'Scoping' going to 'Delivery'" %}
  <figcaption class="">
    Three phases of delivering software shown as a misleading diagram (<a target="_new" href="/images/ai-process-simple.svg">Open bigger version in new window</a>)
  </figcaption>
</figure>

But software delivery is not a flow. It's a filter.  What you filter out has a far greater impact on the efficiency and effectiveness of the system than how you have your editor set up or whether or not you use dependency injection:

<figure>
  {% inline_svg images/ai-process-filter.svg "A chart showing 'Selection' going into four boxes, two labeled 'Project (rejected)' one labeled 'Feature (rejected)' and one labeled 'Feature'. The 'Feature' box and leads to 'Scoping'.  'Scoping' then goes to four boxes two labeled 'Requirement (rejected)' and two labeled 'Requirement'.  The two labeled 'Requirement' go to 'Delivery'" %}
  <figcaption class="">
    Software development as a filter (<a target="_new" href="/images/ai-process-filter.svg">Open bigger version in new window</a>)
  </figcaption>
</figure>

It's not just about choosing high-value projects. You must also say "no" to low-value projects.  And you can't just build every requirement of a chosen feature. You must eliminate requirements that aren't valuable.

*This* is the core skill of a so-called "10x engineer".

<div class="pullquote" aria-hidden="true">
Different ways of doing the coding part don't tend to have a large effect on the overall output of the software delivery system.
</div>

What it means is that different ways of doing the coding part don't tend to have a large effect on the overall output of the software delivery system.  You simply get more value saying "no" to worthless projects than you do by e.g. using command/query separation as your system architecture.  A big ball of mud that makes the company money…makes the company money.

Despite this, the delivery part is the most abstract part of the process, and represents a complete hand-off by stakeholders from stuff they
understand—project definition—to something they do not.  And so there is always desire to make this part go faster.

## Constant Pressure to Deliver Faster

Until recently, however, there simply wasn't a credible way to "go faster" beyond cutting scope.  Even  doing stuff like skipping tests, writing sloppy code, or cutting other corners rarely increases the speed of delivery. In fact, it often makes it slower!

Experienced developers learn very quickly to never offer two ways to do something. Stakeholders always pick the quicker way, and the team can
be stuck with an unreasonable deadline.  Instead, the best strategy has been to work quickly, focus on shipping, and get things done before
anyone has a chance to wonder why delivery is taking so long<a id="back1" href="#1"><sup>1</sup></a>.

But now, there *is* a credible option to make delivery go much faster.  We can use the AI to vastly speed up delivery.  To the extent that code quality matters, the AI can conform to at least some of our quality requirements.  Or, we write it all by hand, taking longer and hope that the code quality improvements actually make up for the delivery slowdown.  They probably don't.

<figure>
  {% inline_svg images/ai-system-quality-diff.svg "A flow chart showing the node 'Requirements' feeding into two notes: 'Black Box of AI' and 'Programmers'. 'Black Box of AI' then feeds into 'Updated System AI-level of code qualitiy' while 'Programmers' feeds into 'Updated System Hand-crafted-level of code quality'. There is a note pointing to both system nodes that says 'Is the differences in these two systems significant?'" %}
  <figcaption class="">
    Two systems, one important question (<a target="_new" href="/images/ai-system-quality-diff.svg">Open bigger version in new window</a>)
  </figcaption>
</figure>

<div class="pullquote" aria-hidden="true">
“Code quality” tends to be a way to breed familiarity without developers having to actually be familiar with the code.
</div>

This is not an AI-advocacy post! But, I'm unable to think of a convincing reason not to use it in a professional context. To the extent that
*code quality* matters, it mostly matters to the other humans who have to read and write it.  Even then, *quality* usually means
*familiarity*.  Naming, code style, code organization, design patterns all make the code look similar to people who didn't write it.

No matter our measure of code quality, I've never worked on a team where they fully achieved the highest levels of quality.  This is no
indictment, just the reality of teams being made of different people with different levels of experience and motivation.  Is the AI-generated
code really *that* much worse?  And if so, is it enough to matter?

<aside class="please-be-aware">
<p>
Yes, I am setting aside the ethical issues with AI tools for this discussion. These systems were created unethically and are operated by some truly terrible people.  They create many negative externalities. Stakeholders <strong>do not care</strong>, so any argument that hinges on moral and ethical issues is doomed to fail.  We don't get to live lives free of compromise<a id="back2" href="#2"><sup>2</sup></a>.
</p>
</aside>

This line of thinking requires a few assumptions, and leads to open questions.

## Assumptions

In 2023, a statement that AI can generate working code reliably simple wasn't true.  That's not the case any more.  Here are some important
assumptions that underpin my thinking above, remembering that this is all in the context of a professional organization of people being paid
to write software, not an open source project, and not a hobby project.

* **The AI can actually generate code that works and do so much faster than a regular programmer.** This has not always been the case and is still not the case for all domains/systems/languages. But for "putting a spreadsheet on the Internet", this assumption almost certainly holds.
* **There is budget to pay AI vendors whatever is needed.** This doesn't mean "tokenmaxxing", but it does mean that you must have budget for all the code you want the AI to generate. 
* **The price of the AI vendor is significantly less than the cost of developers who would otherwise be required.** Said another way, if a real human developer costs $30,000/month all-in, could $30,000 worth of tokens with an AI vendor produce more value?  This feels true, even if I wish it weren't.
* **The price and access for the AI will be relatively stable.** Over the short-term, AI prices haven't been that stable, but they also haven't been as unstable as, say, cryptocurrency.  Pressure from "open" models will keep costs stable until the vendors need to actually show a profit. At that point, who knows what will happen?

If any of these assumptions fail to hold in your situation, the case for AI-generated code becomes weaker.  But if they *do* all hold?  What is the reason to write code by hand? And is your boss or your boss' boss going to find that reason convincing?

What we **can** say is that stakeholders will, when asked to choose between a small team using AI to ship quickly and a large team that moves more slowly, will always choose the smaller, faster option.  You had them at "fast".  If you want to justify doing it by hand, you have an uphill battle.

## Open Questions

If you've ever managed a team of contractors building software, you have no-doubt encountered the behavior where they will do what you ask
and nothing more.  So you end up needing to specify a lot more about what they should do than you would for a co-worker.  I think AI tools
are going to be like that.

* Can we describe our quality requirements and actually check them?
* What is the point of reading AI-generated code before shipping it? 
* How can we monitor the behavior of code in production?
* When diagnosing an issue, how can we quickly navigate the code to understand what's wrong - or does the AI do that, too?
* If code is going to need to be read, how can anyone ever learn to do so if they've never written it by hand?
* If AI can generate software so quickly, why filter out low-value requests? Why not have it all?

I don't think these questions are unanswerable, but I do think they change the nature of what it means to work in software development.  And
I think it makes everything a lot less fun.

<footer class='footnotes'>
<ol>
<li id="1">
<sup>1</sup>
This is why lower-case-agile can be effective. You work in small increments so instead of discussing how to go faster, you simply demonstrate
your progress frequently.
<a href='#back1'>↩</a>
</li>
<li id="2">
<sup>2</sup>
That said, I do wonder if there is a competitive advantage for some team out there that <strong>does</strong> care about the ethics, doesn't use AI, and hires developers who refuse to use it.  It would be a helluva sourcing method. Could such a team create a valuable niche for themselves?
<a href='#back2'>↩</a>
</li>
</ol>
</footer>
