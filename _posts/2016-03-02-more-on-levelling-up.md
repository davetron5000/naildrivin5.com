---
layout: post
title: "More on Leveling Up"
date: 2016-03-02 9:00
---

This interesting piece from Will Hughes titled [How to Level up as a Developer][level] was a great read, but it focuses too much on
[“developer-as-producer-of-diffs”][diffpost] and not enough on “developer-as-solver-of-problems”.  Although I've written in detail in my book [“The Senior
Software Engineer”][sweng] what I think you need to do to be a great developer, I'm going to augment and modify some of the specific points Will makes.

<!-- more -->

## Level 1: Reduce Unnecessary Distractions

I totally agree with the advice here in spirit, however the guidance given isn't quite right for me.  Chapter Ten in my book is titled “Be Responsive and Productive” and it
addresses this issue.  First, you have to understand that your job as a developer is not entirely about producing code.  As a developer, you have
expertise that no one else has, and you must often share that expertise in ways *other* than writing code.  This means emails, conversations, and, yes,
meetings.

If you push back on “all recurring meetings” as the developer quoted in Will's piece maintains, you will limit your effectiveness and end up being a ticket-taker with no real agency or input into the work you are
doing.  Here are the regular meetings developers at Stitch Fix have:

* 1-1 with their manager (weekly or bi-weekly)
* All-team tech meeting (every other week)
* All-hands engineering meeting (every other week)
* Team roadmap planning with business partners (every week)
* Sync with business partners on project (weekly)

This may seem like a lot, but these meetings are crucial.  Having dedicated time with your manager every week is important.  So is having a
weekly time to talk with the people for whom you are building software about priorities.  And if you aren't part of these discussions, they are still going
to happen, but they will lack your input.  That could go bad for you.

That said, some people *do* default to meetings instead of trying to use email.  In those cases, it's fine to “push back” and try to solve the issue
asynchronously, but you also have to understand that not everyone is effective at written communication.  So, while you could lead such a person through a
multi-email exchange to get to the issue ta hand, it might be easier to have a 10 minute conversation.

The rest of the stuff in “Level 1” is great.  As I've mentioned many times, using Test-driven development is a great way to save state when you need to get
interrupted.  It's also worth spending time [getting really good at email][emailpost] so it's never a distraction.

## Level 2: Write “Better” Diffs

While I don't disagree with the advice here, it misses the forest for the trees.  Your job as a developer is not to get your code changes “easily
accepted”.  Your job is to solve the problem in front of you, and sometimes it takes a larger diff to do that.  If you focus, instead, on breaking up your
work as a series of small “digestible” diffs, there will never be an occasion to review your _actual_ change.  It might be possible to ship something
terribly designed—or just plain buggy—by obscuring the true nature of what you are doing as a bunch of small diffs.

Of course, spending weeks in a hole and producing an enormous diff is also not good.  You should strive to deliver a series of tiny solutions to tiny
problems, but at the end of the day, the size of your diff will be commensurate with the size of the problem you are solving (or bigger, depending on the quality of the codebase).  Do not optimize for getting a
thumbs-up.

In terms of getting feedback, it highly depends on the culture of your company, but there are three techniques I find useful:

* Write clean code as much as possible.  Spend a bit of extra time [making it right][rightpost].
* Write tests. Will calls this out, but couches it as optional.  Tests are not optional.  They are the way you know your code works as intended.
* [Comment on your diff/pull request][crpost] before asking for feedback.  This allows you to attach plain language explanations of what's going on without using code comments. It also allows you to ask pointed questions about specific bits of code, which helps reviewers know what to look for.

The advice in “Communicate” is spot-on.  Throwing up a diff without context does no one any good.  Spend 10 minutes of your life making things easier for your team-mates.

Which leads to Will's Level 3.

## Level 3: Being a Team Player

This is all good, particularly, “Admit What you Don't Know”.  You should become very comfortable with this, because a) you'll learn things this way and b) it's a good signal to a code's author that maybe there code isn't clear enough.

I would also not shy away from “nitpicky” code comments.  If a change is mostly pretty good and there are no major issues, nitpicky comments about
formatting and consistency are fair game.  Most developers want their code to be consistent like most writes want to be using proper grammar and spelling.
Point it out—politely—and most developers will fix.  If they disagree, don't die on that hill, but most of the time it's appreciated.  That said, if a pull request or diff has larger issues, do not waste time on
nitpicky stuff; let the author deal with the larger issues first.

## Level 4: Organize & Hustle

This section is great, too.  I want to expand on “work/life balance”.  You need to establish early on what the expectation is of the hours you should be
online and responding to email or interacting with others.  Whenever that is, you absolutely *must* do your best to be present during those hours.
_Hopefully_, they are fewer than eight hours, so you can allocate the rest of your work time to whenever suits you best.

Beyond that, you have to set boundaries with your co-workers and manager about when you will and won't be working.  Unless your manager is *very*
conscientious, they will not complain about you working “too many” hours.  You have to limit it.  You can do this by simply setting strict work hours.  Or,
if you tend to work at different or odd times of the day, be vocal about that.  Make sure everyone knows that e.g. just because you were working at
10:00pm, that didn't mean you were working all day.

## Parting Thoughts

I say this a lot, but the best thing you can do as a developer is to understand the problem you are trying to solve.  And be honest about it.


[level]: https://medium.com/@willh/how-to-level-up-as-a-developer-87344584777c#.nxkkh5mz6
[diffpost]: http://naildrivin5.com/blog/2013/12/03/org-charts-and-diff-production.html
[sweng]: http://theseniorsoftwareengineer.com/
[emailpost]: http://naildrivin5.com/blog/2013/07/23/agile-email-management.html
[rightpost]: http://naildrivin5.com/blog/2012/10/05/making-it-right-technical-debt-vs-slop.html
[crpost]: http://naildrivin5.com/blog/2012/04/02/a-protocol-for-code-reviews.html
