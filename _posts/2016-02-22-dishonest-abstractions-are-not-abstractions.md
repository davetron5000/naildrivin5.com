---
layout: post
title: "Dishonest Abstractions are Not Abstractions"
date: 2016-02-22 9:00
---

[Ernie Miller][ernie] started a tweetstorm on Friday that really rang true to me, about how certain abstractions are "dishonest".  In my mind, the dishonesty
is calling them abstractions in the first place.

<!-- more -->

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;ve been thinking a lot about honesty in software development lately. Not just honesty from people, but from technology.</p>&mdash; Ernie Miller (@erniemiller) <a href="https://twitter.com/erniemiller/status/700705128484106240">February 19, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">I think this general sense of honesty is at the core of my feelings about, e.g., HAML/SASS/CoffeeScript vs ERB/SCSS/ES2015.</p>&mdash; Ernie Miller (@erniemiller) <a href="https://twitter.com/erniemiller/status/700706138581561345">February 19, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I had embraced them for their aesthetic appeal, but realized that I was really running from the technology I perceived them to replace.</p>&mdash; Ernie Miller (@erniemiller) <a href="https://twitter.com/erniemiller/status/700711070919426048">February 19, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">But it was very surprising to me, then. I&#39;d get a stack trace listing JavaScript I hadn&#39;t written, or inspect an unexpected HTML element.</p>&mdash; Ernie Miller (@erniemiller) <a href="https://twitter.com/erniemiller/status/700712371606704128">February 19, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

These tweets really spoke to me, but I don't think abstractions are “lies” per se.  Rather, I feel that the technologies listed (and others like them) are
just really weak.  They don't deliver complete solutions to the problems they are there to solve and are built on poor (or no) abstractions, such that they
require more of the user than they ultimately give.

CoffeeScript is the simplest example of this. It's a programming language that produces stack traces in a different programming language.  It requires almost the same amount of code as JavaScript and it doesn't obviate the need to completely understand JavaScript.  Why would I want this?

In a sense, HAML, SASS, CoffeeScript, etc. are nothing more than sophisticated `sed` scripts (or macro languages).  But this problem isn't specific to
front-end technologies.  AREL and Rails Migrations are two back-end examples.  They profess to “save you” from SQL, but you really can't use them without
understanding SQL, you can't access the full power of your database with them, and you can't debug what they are doing without knowing SQL.

Compare this to writing C.  Do you need to know assembly language to write C?  For almost all cases, the answer is “no”.  Sure, there may be cases where you have to dig into the assembly to figure out a problem, but these are vanishingly small.

Compare that to AREL or CoffeeScript where, as a matter of course, you must break through the “abstraction” to find out what's going on.  You spend almost as much time in the “assembly language” (SQL, JavaScript), as you do in the “higher-level abstraction”.  

The scare quotes are intentional: to call HAML, CoffeeScript, and friends “abstractions” is to almost render the term meaningless.  They don't
abstract anything away from you on any real level.

In [my book][book], I encourage the reader to use JavaScript and learn SQL, because the tools given to you by Rails aren't abstractions—they are extra things
to learn that provide at best a marginal increase in productivity, and that productivity only applies during the least time-consuming part of software
development: typing in source code.

These tools don't meet [any higher-order need][needspost] a developer has.  They provide the ability to execute code only and when compared to the
technologies they replace, they appeal more to aesthetics than the ability to better deliver quality software.

Web front-end technologies seem woefully stuck in this quagmire.  React gives you the ability to type markup that looks like a higher-order abstraction, but
it's still just a macro language for producing HTML that you must debug directly.  Yes, source maps and other browser extensions exist to make this less
painful, but your job at the end of the day is still trying to figure out what events are firing on what DOM elements, and how CSS is being applied to them.

I'm not sure what it will take to produce truly higher-level abstractions for powerful technologies like JavaScript and SQL.  If the tools we have now are
guilty of dishonesty, it's mostly in overstating what problems they really solve.

[ernie]: https://twitter.com/erniemiller
[book]: https://pragprog.com/book/dcbang/rails-angular-postgres-and-bootstrap
[needspost]: http://naildrivin5.com/blog/2016/01/13/hierarchy-of-software-needs.html


