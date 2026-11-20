---
layout: post
title: "The Answer to Slop is Accountability"
date: 2026-11-18 9:00
related:
 - "A Framework for Product Design Beyond the Happy Path"
 - "How Can You Be Responsible for Code You Don't Understand, Especially When You Can No Longer Program?"
 - "Why Review AI-Generated Code?"
 - "You Cannot Trust the AI Code Generator"
 - "I'm Gonna Write About AI So I Can Process What is Going On"
mcdouble:
  mastodon:
    id: '117638061576549629'
    url: https://ruby.social/@davetron5000/117638061576549629
    posted_at: '2026-11-18T15:06:07Z'
  bluesky:
    id: at://did:plc:5qa544tzvkfohwvc34r37z2c/app.bsky.feed.post/3n2ltgw5nzg2m
    url: https://bsky.app/profile/did:plc:5qa544tzvkfohwvc34r37z2c/post/3n2ltgw5nzg2m
    posted_at: '2026-11-18T15:06:07Z'
    cid: bafyreihrcpwacunylt4rtkotzwxzjac22atafkql34oeb27ucpz455bgmm
---

"Slop" is low-quality output from an LLM.  When slop is part of a user-facing product, it pulls down the quality of the product.  The way to
fix this is by consequences to the product owner.

<!-- more -->

I don't believe all LLM output is slop, though I understand that achieving high-quality output is largely the function of the LLM vendor's
models and not anything under my control.  That being said, an LLM's output as part of an overall product offering **is** under the control
of people: product managers (primarily) and programmers (less so).

## Terrible Features are Made by People

We've all experienced AI-powered product features that make the product worse.  From macOS's constant nagging you to "write with Siri<sup><a href="#1" id="back1">1</a></sup>" to full-blown support chatbots that give poor advice, AI-powered product features are hit or miss at best.

<aside class="pullquote left">
Before AI, shitty product features fall to the PMs…I see no difference when AI is available.
</aside>

Before AI, shitty product features fall to the product managers (PMs).  Assuming the programmers built what was asked, then what was asked of them is the problem. That's on the PM.  I don't see any difference now that AI is available as a tool for building features.

Imagine if a PM proposed a solution to reduce customer support cost. The only catch? It gave wrong answers sometimes *and* and there was no
way to measure how wrong it was.  That PM would have a tough time selling that solution to their superiors.  Programmers probably wouldn't
want to build it.  Who likes building software that doesn't work by design?

That said, you could imagine some sort of cost/benefit analysis that showed some percentage of wrong answers were acceptable if it reduced
support cost by some other amount.  How many PMs did that analysis before AI?  How many are doing it now?

<aside class="pullquote">
We are not a real profession.
</aside>

Software and technology famously has no system of ethics or accountability.  We are not a real profession.  We don't even hold companies accountable for quantifiably harmful security incidents, so we are a long way from holding PMs accountable for shitty user experiences brought on by AI slop. Say what you will about lawyers, but [they can be held accountable](https://www.reuters.com/legal/litigation/florida-lawyer-referred-possible-discipline-over-filing-that-judges-called-ai-2026-10-21/).  

## Evaluate Your Feature Without Using the Term "AI"

A way I'd try to manage this would be to design features so that a user could understand and use them but without saying the feature was
"AI-powered". I'd want features that weren't just a thin layer on top of a chatbot.

Consider the New York Times Cooking app's [proposal to add AI-powered recipe
modification](https://www.theverge.com/ai-artificial-intelligence/1022193/nyt-cooking-app-ai-recipe-modification-tool).  Given the public
sentiment in general, and the [existing terrible outcomes regarding recipes](https://www.bbc.com/news/articles/cd11gzejgz4o), why would the
product manager (or product designer) design this feature this way?

Is it useful to have a recipe app that can help with substitutions? Of course! We've all had to search the Internet for "what if I don't have any cornstarch?" or whatever.  Being able to do that in our recipe app and get structured results instead of Reddit posts seems good.  So how do we explain the product idea without using the words "AI" or "LLM"?

> The user types text describing the change the want to make. The system then responds with its own text describing your ingredients in detail
> and describes how the recipe will change.  The user then sees a recipe updated with their change.

So far so mediocre. Nothing offensive, but my spidey sense is already tingling about a UI designed around a wall of text the user must read.
But still, seems better than just searching the Internet.  There's more:

> The proposed implementation will provide incorrect information some unknown percent of the time.  We can't measure this directly,
> however we can set expectations with a "beta" tag, ask for user feedback, and place text on the feature that says 'our recommendations may
> contain mistakes'.

<aside class="pullquote">
Including the text “our recommendations may contain mistakes” is ridiculous.
</aside>

We've gone from a magical experience to something more questionable.  Including the text "our recommendations may contain mistakes" is ridiculous<a href="#2" id="back2"><sup>2</sup></a>.  Why would we ship a tool that we know makes mistakes? Why does someone cooking a meal want to follow a recipe that may contains mistakes?

Without using the terms "AI" or "LLM", it becomes much more clear who is responsible for the behavior of the software: the New York Times.
And that makes the potential mistakes worse. It's not Sam Altman's fault, it's the NYT's fault!

## Only People Can Be Held Accountable

I would personally be embarrassed to ship the NYT Cooking app's recipe substitutions feature without at least *some* way of measuring those mistakes so they could be managed and reduced.  I would not pawn those mistakes off on someone else.  I would own the decision to include a sometimes-wrong-technology in the feature.  A PM bringing me this idea as-is would need some serious correction about what their job is.

Imagine a system of feedback and incentives where the outcomes of product features were tied to the performance evaluation of the PMs
(and, where applicable, the programmers).  Most companies don't have anything like this, even pre-AI.  This is the only way to curtail
this nonsense.

<aside class="pullquote">
If PMs are on the hook for slop, you can be sure there will be a lot less of it.
</aside>

Instead of rewarding PMs for [just changing shit to get promoted](https://mastodon.social/@mcc/117607410513383159), the
efficacy of features they propose should be monitored and used as feedback for them to improve at their jobs. And if they are on the hook for
low-quality AI output—slop—you can be sure there will start to be a lot less of it.

After all, if the New York Times tells me that I can make buttermilk biscuits with oil instead of butter, that's on the New York Times, not
some AI vendor whose product they voluntarily chose to integrate.

<footer class="footnotes">
<ol>
<li id="1">
<sup>1</sup>I almost always select text on iOS to fix spelling mistakes brought on by autocorrect.  Why on earth is “write with Siri” an
option in that case?  How many ways does Apple envision I can write two consecutive words that I need an LLM to help me?<a href="#back1">↩</a>
</li>
<li id="2">
<sup>2</sup>Slapping a “beta” tag on something is not a software beta test.  It's as if an entire generation of product managers equates a “beta” tag with a free pass for the software not working.  An <strong>actual</strong> beta test includes a subset of users who are expected to find and report problems. Just A/B testing them and seeing where they click is not that. <a href='#back2'>↩</a>
</li>
</ol>
</footer>
