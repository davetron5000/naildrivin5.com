---
layout: post
title: "The Death of the Software Craftsman"
date: 2026-02-23 9:00
---



> The death of a software craftsman<br>
> Well, it happens a lot 'round here<br>
> You think quality is a common goal<br>
> That goes to show how little you know

Developers work hard over the years to cultivate tools and techniques to improve the quality of the construction of their software.  These tools and techniques are slowly becoming even more useless than they may already be. We must adapt, which could be simply opting-out.

<!-- more -->

## Software Quality Problems are People Problems

All techniques for improving the quality of software construction are aimed at solving the problem of allowing a person to understand the system they are changing so they can safely and correctly make a change to it.  Solutions either prevent certain classes of bugs (e.g. static typing), or make it easier to manage complexity (e.g. object-orientation)<sup id="back-1"><a href="#1">1</a></sup>.

<figure>
  <a href="/images/tradprog.png">
    <img src="/images/tradprog.png"
         srcset="/images/tradprog.png 629w,
                 /images/tradprog-320.png 320w,
                 /images/tradprog-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="alt text here">
  </a>
  <figcaption class="">
    The Traditional Software Development Process (<a target="_new" href="/images/tradprog.png">Open bigger version in new window</a>)
  </figcaption>
</figure>

Although we debate and discuss various techniques amongst ourselves, no non-programmer cares about them. They can't even conceptualize how software is made, so they have no way to know what quality construction is, how to value it, or even how to identify it. They just care about outcomes.

<blockquote class="pullquote">We tell ourselves that it's these skills that deliver those desired outcomes</blockquote>

We tell ourselves that it's these skills that deliver those desired outcomes. I myself have a very particular set of skills.  Skills I've acquired over a very long career.  I write about them, I use them, and I am truly convinced that careful construction of software is the best way to reliably create systems that can be easily changed over their lifetimes. Even if no one knows or cares.

However.

## Best Block No Be There

I may relish the solutions to building quality software, but the best solution to any problem is to eliminate the problem. [Don't bet against Mr Miyagai's wisdom](https://en.wikipedia.org/wiki/The_Karate_Kid). 

Let's imagine a hypothetical tool that could take, as input, a software system and a description of a change. The system produces, as output, an updated system with that change incorporated.  This hypothetical system would not rely on any particular software construction technique.
<figure>
  <a href="/images/aiblackbox.png">
    <img src="/images/aiblackbox.png"
         srcset="/images/aiblackbox.png 629w,
                 /images/aiblackbox-320.png 320w,
                 /images/aiblackbox-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="alt text here">
  </a>
  <figcaption class="">
    A Hypothetical Brave New Way to Make Software (<a target="_new" href="/images/aiblackbox.png">Open bigger version in new window</a>)
  </figcaption>
</figure>

If software was created this way, would anyone know what, say, dependency injection was?  Would anyone go to a conference to learn about the latest features of Ruby on Rails?  Would anyone buy a book about carefully designing database schemas?

They would not. There would be no reason to.  It literally would not matter what the code was like. Our hypothetical system could handle whatever it's given and produce the requested changes. 

This hypothetical system isn't magic. Using it would certainly require skill, perhaps
deep skill. While there might be overlap with the skills we've built up around quality software construction, most of those skills become obsolete.

This system is not so hypothetical.

<blockquote class="pullquote">We know that in at least some cases, they do exactly what I described above.</blockquote>

We've seen what AI code generation systems are capable of.  We know that in at least some cases, they do exactly what I described above.  In some cases, they can take an existing system, a description of a change, and produce a system with that change.  And they seem to be improving quickly.

And yet.

## Soylent Green is People

My visceral reaction to these tools has a combination of disgust and boredom. Here are the things I have told myself about why this technology can or should be ignored:

* It was created unethically.
* It consumes an unreasonable amount of resources (such as electricity and hard drives).
* It is owned and sold by some of the worst people in the world.
* Its true cost is hidden by investor money. Once its price must support its cost, no one could afford it.
* Being non-deterministic, it can never be as a good as a person.
* There's no way to hold anyone accountable for its output.
* A real programmer will still need to go into the code. Practices around software construction will always matter.
* It's shit at anything that's not a popular technology applied to a common use case.

As of this writing, these are all true.  But are they intrinsic problems?

<blockquote class="pullquote">AI code generation's problems aren't actually as intrinsic as they may seem</blockquote>

Unlike crypto, which is literally made of intrinsic problems preventing it from widespread adoption (please don't email me), AI code generation's problems aren't actually as intrinsic as they may seem.

* AI models *could* be created ethically. There could be (and perhaps are?) systems created that comply with the licenses of their training materials.
* Systems that use AI models *could* be done with less power and resources.  DeepSeek demonstrated that even minimal performance tweaking can give real benefits. Not enough, but enough that I cannot say with certainty that these resource problems are unsolvable.
* AI code generation tools could be required to operate within a system of accountability.  We've all seen that CEOs will comply with the government when threatened.  And someday, we all might live under a functioning government that works for its people.
* Their price *may* be bearable when investor money runs out. Uber still exists as a going concern, despite being more expensive than ever.
* People are non-deterministic, too, so it's not clear me that AI coding agents are necessarily worse than people at producing results. Coding agents are already better at programming than the vast majority of the population. I can't say with certainty that every living programmer is the embodiment of [John Henry](https://en.wikipedia.org/wiki/John_Henry_(folklore)).
* While AI coding agents may never be able to handle every imaginable task, it's not clear to me that there is a limit on what they can do or that any given limit is unreasonable. Most of us are putting spreadsheets in a web browser or wrapping a database in a front-end, so if all that work is automated, that doesn't seem necessarily bad to me.

In other words, all the problems of this technology *could* be addressed.  I'm not saying they will be, or that it will happen on any particular timeline.  But, it seems entirely possible to have a tool that produces software by taking in an existing system and written request as input, but without the problems that currently exist.

Not inevitable, but *possible*.

This means it's worth considering a world where AI code generation is commonplace. In fact, one *must* consider such a world.

As a thought experiment, imagine if all the issues above were addressed.  Who *wouldn't* use these systems to produce software, at least in the context where it actually works? It's just so obviously better than what we do now (assuming the identified problems are addressed).

<blockquote class="pullquote">Almost everyone in the orbit of software development only cares about outcomes</blockquote>

Remember, almost everyone in the orbit of software development only cares about outcomes and results, not the process by which they were achieved.  It doesn't mean *you*
can't care, but most people don't.

So what's a lonely programmer to do?

## Ce n'est Pas un Griefpost

I've been a professional software developer for 30 years, and this technology basically obviates a big chunk the skills I've developed. But I *like* using those skills. I like writing code. How do I navigate a world that no longer values that?

I like the process of building software. Yes, I'm results-oriented and am good at communicating with non-programmers. I can manage teams and projects, and keep focused on business outcomes.  I don't get lost in the process despite enjoying it. But, my least happy professional eras were when I wasn't involved with code.

Up until now, the never-ending need for programmers has given me a nice career.  Thankfully, I'm on the tail end of that career.  But I'm not retired yet.

I see three paths in front of me: Hard Pass, All In, and Embrace Tradition.

### Hard Pass

The problems I listed above are real.  And while they could be solved, there's no guarantee they will be solved in any given timeframe, or even at all.  The problems compound and create what many believe to be an easy choice: don't support unethical systems created by terrible people that quickly exhaust our resources.

This is how I felt initially. It's just easy to write this entire thing off as awful, useless, evil, of poor quality, and not something I want to be involved with (like crypto!). Unlike ignoring crypto, the Hard Pass has consequences to the career of a
software professional.

In the short term, it's still possible to be gainfully employed in software while abstaining from AI.  There'll be fewer and fewer such jobs as time goes by, but there should be at least a few years of generally available jobs writing code by hand.
Ultimately, however, a position of abstinence means exiting from professional software development.

<blockquote class="pullquote">A position of  abstinence means exiting from professional software development</blockquote>

This might seem extreme, but be honest: not enough people are going to come around on
the ethical issues. The country I live in is 350+ million people who tolerate the sexual exploitation and murder of children (as just one example).  I say this not to encourage you to give in or sell out, but just to understand that the world of software development as you know it is going to become very small very fast.

This is the consequence of the moral dilemma.  You *can* opt-out. Almost every job that ever was or ever will be is something other than writing software. Most people make a living without writing software.  But if you want to give AI a Hard Pass, you will eventually be giving your career as a programmer a hard pass, too (though please stick around for option three, below).

If this is you, start figuring out how you're going to make a living otherwise.

Or, you could go all-in.

### All In

Going all-in is to accept that the profession is changing so radically that you'll
need to retrain yourself.  You'll leverage your experience and incorporate these new
tools in the same way as you would any other advance in the field. Except you may
leave a lot of your existing skills behind.

<blockquote class="pullquote">It's hard to live a life free of compromise</blockquote>

It's hard to live a life free of compromise. Going All In is to compromise. It means you must tolerate the downsides of this technology, assuming you view them as downsides. I know I do, but I also know that tolerance is not support, and that everyone, everywhere, every day must weight their needs against what their conscience can bear.

If your priority is to stay working in software development, especially if you have a long career ahead of you, going All In is the safest, simplest, most practical option. The consequence is that aforementioned compromise.  

Beyond that ethical compromise, I find this option depressing for two reasons.
<figure class="small-figure left">
  <a href="/images/prettyplease.jpg">
    <img src="/images/prettyplease.jpg"
         alt="A picture of Harvey Keitel's character 'The Wolf' from Pulp Fiction with the text 'Pretty Please with Sugar On Top Validate the Fucking Email' overlayed">
  </a>
</figure>

One is as I mentioned above: I *like* coding. I like writing code and everything about it.  I like the control it gives me, and I do not enjoy "coding" by writing Markdown and feeding it to a compiler that sometimes works and sometimes doesn't until I ask it nicely to do what I need.

<div class="cf"></div>

<figure class="small-figure right">
  <a href="/images/i-like-coding.jpg">
    <img src="/images/i-like-coding.jpg"
         alt="A four-panel meme comic showing me in panel one saing 'I like coding'. Panel 2 shows someone else saying 'Here's some React and Tailwind'. The third panel just shows me with no text. The fourth panel is me looking angry">
  </a>
</figure>

Two is related to the "common technology" problem.  These tools produce code using the popular frameworks, techniques, and libraries.  While it's possible I won't have to review or modify the code these tools produce, that is not the state of the art. And I just really, really don't want to write React or Tailwind.  I don't really want to learn Python.  And the creator of Rails can go fuck himself.

<div class="cf"></div>

But that's me.  If I were younger, smarter, and less concerned with the ethical
issues, I'd embrace this new world, and not worry so much about what code was being
produced. The whole point is that it won't matter in the end.

All this being said, flat-pack furniture made of fiberboard did not eliminate the skill of putting a chisel to hard wood. The time of the software craftsman could be coming.

## Reject Modernity, Embrace Tradition

I always though the "software craftsman" movement was dumb. Uncle Bob is a terrible person with bad ideas, and Agile Thought Leaders seem more focused on their billable rate than improving outcomes for users.  And, really, effective developers shouldn't spend so much time navel-gazing - results really *do* matter!

<figure class="small-figure left image-border">
  <a href="/images/tradition.jpg">
    <img src="/images/tradition.jpg"
         alt="A two panel meme with the top panel titled 'Reject Modernity' and contents of the text '> npm install -g typescript-language-server typescript'. The bottom panel is titled 'Embrace Tradition' and as the text 'hjkl' in it">
  </a>
</figure>

But what is a craftsman, really? Someone with deep skills honed over many years, who can produce amazing results using a process that's almost as engaging to observe as the results themselves.  There are certain outcomes that only a highly trained human hand can deliver.

<div class="cf"></div>

There are still craftsmen being trained and employed to this day, across a wide variety of industries.  Although few people have hand-made furniture, you can still commission it if you like. And don't forget that even uninspiring chain restaurants like The Cheesecake Factory still make almost all their food from scratch.

Thus, it's not unreasonable to think that such an industry will exist for writing software.  In the short term, there's still a ton that AI coding agents simply can't do very well.  And in the long term, there will be at least some demand for software written to a higher standard than what AI is producing.

But AI is under constant change, which requires the new breed of Software Crafter<sup id="back-2"><a href="#2">2</a></sup> to stay knowledgable about AI.  To be marketable and make a living, you have to know what gap you are filling. And that gap is changing often.  Thus, you cannot avoid AI if this is the way you go.

We don't get to live our lives free of compromise.

Maybe in the next world.

---

<footer class='footnotes'>
<ol>
<li id="1">
<sup>1</sup>I'm not saying static typing and object-orientation achieve the results they think promise they do, especially in a general sense, but they do exist to prevent bugs and manage complexity, respectively.<a href='#back-1'>↩</a>
</li>
<li id="2">
<sup>2</sup>In  this new era, we can ditch the gendered language. "Craftsperson" is cumbersome, but would also work. "Maker" can go straight to hell.<a href='#back-2'>↩</a>
</li>
</ol>
</footer>
