---
layout: post
title: "How Can You Be Responsible for Code You Don't Understand, Especially When You Can No Longer Program?"
date: 2026-11-11 11:00
related:
 - "Why Review AI-Generated Code?"
 - "You Cannot Trust the AI Code Generator"
 - "Why Even Write Code in a Professional Context?"
 - "I'm Gonna Write About AI So I Can Process What is Going On"
 - "The Death of the Software Craftsman"
---

If [AI is writing all the code](/blog/2026/10/19/why-even-write-code-in-a-professional-context.html) and [no one is reviewing it](/blog/2026/11/03/why-review-ai-generated-code.html), how the heck can anyone be responsible or accountable for code they not only don't understand and eventually *can never understand*?

<aside class="pullquote">
AI's primary purpose is to deskill its operators.
</aside>

The short answer is that programmers become responsible for outcomes, not code.  The longer answer is there are no programmers - AI is a
replacement, not an assistant, since it's primary purpose is to deskill its operators.

<!-- more -->

## Deskilling Before Our Very Eyes

[This post on Reddit](https://www.reddit.com/r/ClaudeCode/comments/1xq2n3t/a_year_after_the_100_ai_mandate_nobody/) was going around social
media and exemplifies what happens when a bunch of programmers stop programming.

> This month management started quietly asking us to "write more of it ourselves" again. Except half of us haven't written anything non
> trivial in a year and it shows. I spent 2 days on something I would have done in an afternoon in 2024. 

The post also talks about how the AI has generated poorly-constructed code:

> The agents struggle too, they keep re-implementing helpers that already exist somewhere else because there are 4 versions of everything. 

The OP's management team is likely surprised by this outcome, but I doubt any experienced programmer would be.  If you stop writing code
every day, two things happen: you quickly lose familiarity with the codebase you are working on, and you eventually lose the ability to even program at all. This is deskilling in action.

<aside class="please-be-aware">
<p>
I'm not using <em>deskilling</em> as an epithet.  In this context, AI is literally reducing the skill needed to do a job. That's its value
proposition. Whether this is a good or bad thing is another discussion entirely.
</p>
</aside>

## Welcome to the Product Management Team

The now-former programmers become part operators of the code generators and part junior product managers.  They aren't responsible for code quality—how could the be—but *are* responsible for outcomes, even if those outcomes aren't explicitly named or measured.

<aside class="pullquote">
Programmers become part operators of AI and part junior product managers.
</aside>

If those outcomes are implicit (or explicit but not measured), everyone is gonna have a bad time.  If I were on a team where AI was mandated or just being widely used, I would quickly map the value stream of the software I used to be writing. I'd
stop speaking about code quality, test coverage, or anything else and start tracking outcomes.

This is, at least in part, product management.

So what happens if someone needs to look at the code?  What would be the conditions under which that is required?

## The Ramifications of Deskilling

A manager of programmers, allowing or mandating the use of AI code generators, must accept that it creates a situation where no one can
reliably understand the code or even *come to understand* the code.  In the short term, experienced programmers will maintain some skills and
be able to navigate what, to them, is a brand new codebase, but over time there simply won't *be* any experienced programmers.

<aside class="pullquote left">
Over time, there simply won't <strong>be</strong> any experienced programmers.
</aside>

Is this situation avoidable? Can we a team get all the advantages of AI with none of the downsides that come with its deskilling? If we have to go into the code, is there a way to ensure we have the capability to do so?

I believe the answer is "no".  It might feel like if the AI writes "good enough" code, then it will be possible—even easy—for a programmer to
understand it.  But "good code" is not really a thing.  "Good code" is just "code I'm familiar with".

Sure, there are ways to write code that reduce conceptual overhead, but there's no way to create a codebase that a newcomer will magically be
able to understand<sup><a id="back1" href="#1">1</a></sup>.  But even if there were, stability is the key to gaining familiarity. When AI is generating code, there is immense churn. Speed has a cost.

## Plan for Code to be a Black Box

The only conclusion I can draw is that the team must be able to produce its needed outcomes without having to look at the code.  A team would
need to scope its understanding of the system's construction at some higher level than lines of code.

Classically, the layers of the system are managed and understood as follows:

<figure>
{% inline_svg images/ai-pm-classic.svg "A graph showing the layers of software with System going to Modules or Bounded Contexts going to Classes or Components going to Lines of Code.  Alongside that are Managers who own the outcomes of the System and understand its Modules, Product Managers who understand the System but own the outcomes the Modules or Bounded Contexts. Programmers then understand the System and Bounded Contexts, but own the outcomes of the Components and Lines of Code" %}
<figcaption>
Classic accountability for software systems.
</figcaption>
</figure>

Management is responsible for the system itself, with product managers responsible for different modules or bounded contexts.  Programmers
are then responsible for the implementation.

With no programmers or ability to understand or even manage the code, things change:

<figure>
{% inline_svg images/ai-pm-new.svg "A graph showing the layers of software with System going to Modules or Bounded Contexts going to Classes or Components going to Lines of Code.  Alongside that are Managers who own the outcomes of the System and understand its Modules, Product Managers who understand the System but own the outcomes the Modules or Bounded Contexts. AI Operators/Programmers then own the outcomes of an AI Code Generator and understand the System, Bounded Contexts, and Classes/Components.  The AI Code Generator produces the Classes/Components and LOC, with no formal ownership of either" %}
<figcaption>
Accountability for a deskilled team using AI.
</figcaption>
</figure>

Notice how the areas of responsibility change.  The team managing the AI code generators can hardly be considered *programmers* since they
aren't doing that much of it.  You can also see that the difference in skillsets of the Product Managers and AI Operators is far less
distinct than it would be between Product Managers and Programmers.

This isn't to say these roles are the same.  All the skills related to system design and operations would still be required. These diagrams
are missing details about the actual operation of these systems.

<aside class="pullquote">
You cannot deskill a team and expect them to bounce back.
</aside>

As to the manager of the Redditor's team: they are living in a fantasy world if they think they can just stop using AI and pick up where they
left off.  You cannot just deskill your team and expect them to quickly require those skills.  In fact, some team members might never regain
them!

<footer class="footnotes">
<ol>
<li id="1">
<sup>1</sup>
And, let's be honest, if someone did have to understand the code, they would just as an AI to explain it to them.
<a href='#back1'>↩</a>
</li>
</ol>
</footer>


