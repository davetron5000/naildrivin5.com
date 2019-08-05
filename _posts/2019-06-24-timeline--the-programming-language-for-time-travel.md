---
layout: post
title: "Timeline: the programming language for time travel"
date: 2019-06-24 8:00
ad:
  title: "Rails is Productive"
  subtitle: "Focus on the problem you are soling"
  link: "http://bit.ly/dcrails6"
  image: "/images/rails6.jpg"
  cta: "In Beta for $29.95"
related_posts:
  - link: /2018/05/06/creating-a-culture-of-consistency.html
    title: Creating a Culture of Consistency
  - link: /2019/07/25/simple-expressions-only.html
    title: Coding without (many) Expressions
  - link: /2019/07/25/four-better-rules-for-software-design.html
    title: "Four Better Rules for Software Design"
---

I gave a talk at Pittsburgh Tech Fest that I'd been wanting to do for a while, which is a talk about how to program a time machine and what the programming
language for it might look like. I re-recorded the talk.

<!-- more -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/WKN-wh3S6Yg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I wanted this to feel as real as possible, so there is a website, <a href="https://timeline-lang.com">timeline-lang.com</a> that talkes about Timeline, the
programming language.  I even built a [syntax
highlighter](https://github.com/davetron5000/timeline-lang.com/blob/master/src/js/server/highlighters/timeline.js) for it as well as a [vim syntax file](https://github.com/davetron5000/vim-timeline)

<div data-ad></div>

Some of the concepts I like about it are that instead of having a free-wheeling syntax, upon which you must place "best practices", the language simply
requires them.  For example, rather than debate putting spaces around operators…you have to.  Rather than discuss how to extract expressions into well-named
variables or functions, you just can't use expressions in `if` statements - you have to use a variable.  And instead of having discussions about using good
variable names, you simply can't use a word in a variable that isn't defined in the dictionary.

These are features I think any language could implement.  The other part of what I imagined about timeline was baking in observabililty.  We tend to litter
our code with log statements, stat measurements, and the like, and it not only creates distracting code, but it also requires some deep thinking about *what*
to instrument.

What if the language runtime simply logged everything that happened in your app?  What if execution of your app produced a “black box” that you could
visualize to understand what your code actually did?  We usually are far more interested in what a program does (or will do) than what the programmer intent
was.

I've come to believe more and more that consistency around how we work, and simple rules about undifferentiated work, enforced by tooling, is the way to
scaling and productivity.  Why cant our programming languages work this way, too?
