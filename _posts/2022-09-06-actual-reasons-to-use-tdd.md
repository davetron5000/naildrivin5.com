---
layout: post
title: "Actual Reasons to Use Test-Driven Development"
description: "Test-Driven Developmen is about confidently check your app works, not
about good design or productivity"
card_image: /images/lots-of-testers.png
date: 2022-09-06 9:00
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
related:
 - "The Four Stages of Testing That Help Your Focus"
 - "Four Reasons Developers are Unproductive"
 - "On Slow Test Suites and CI Servers"
---

Test-Driven Development is often sold as a way to be more productive or produce better
designs, but it's these unprovable claims that make skeptics even less likely to adopt
the practice. Instead, TDD should be sold as a tool to reduce the risk of software not
working as intended without expending huge amounts of effort and time doing so. Because
that's what it does (yes, it's about testing).

<!-- more -->

You can't measure developer productivity, and you can't analyze a design to see if it's
good, or even better as compared to some other design.  You can't even get two engineers to agree on subjective traits of a good design.  I can't understand why TDD's proponents promise this stuff.  They don't need to.

What TDD—in the more literal interpretation of using tests to drive development—*can* do
is provide a process to produce reliable, automated tests that provide great coverage of
the software, while scaling pretty well as size of team and codebase increases.

To see how, let's start with the basics: how do we know our software is doing what we
expect?

## We Can All Agree Software Should Do What We Expect

Set aside "correctness" (a meaningless term if I've ever heard one). Don't worry about
"working software".  Instead think about the question on our minds as we write code, the
question we had from our first moment of coding, and that we still ask as we do our jobs
today: is the software doing what I expect?

<aside class="pullquote">Is the software doing what I expect?</aside>

The most obvious way to answer this question is to run the software and use it.  See if
it's doing what you were trying to get it to do. If it does, well, that's something.
This method of checking our software is pretty easy to understand and, at least when the
codebase and team are small, pretty easy to do.

However, we don't usually get the luxury of a small codebase and a small team.  We also
don't often write software that we ourselves use. Typically, we are part of a growing
organization building an increasingly large and complex software system for someone else
to use.

In that situation, running the software to see if does what we want becomes tedious, time-consuming, and, well, ineffective as a management practice.

## Manually Checking Everything Is Not Sustainable

The reason manual checking is so painful is that you can't check only the change you
made.  You really need to check if your change broke anything else that was previously
checked before the change was made.  Over time, the software does more and more things, so that's more and more things to check.

<figure style="float: left; padding-right: 0rem; padding-left: 0; width: 300px">
<a href="/images/lots-of-testers.png"><img src="/images/lots-of-testers.png" 
itemref="testers-image-acd-level testers-image-acd-level testers-image-acd-ai-name testers-image-acd-details"
alt="Picture of tons and tons of people at computer terminals"></a>
<data id="testers-image-acd-level"
      itemprop="ai-content-declaration:version"
      value="1.0.0-alpha1" />
<data id="testers-image-acd-level"
      itemprop="ai-content-declaration:level"
      value="total" />
<data id="testers-image-acd-ai-name"
      itemprop="ai-content-declaration:ai-name"
      value="DALL-E" />
<data id="testers-image-acd-details"
      itemprop="ai-content-declaration:details"
      value="A huge, bleak, room filled with thousands people working on computer terminals cyberpunk style." />
<figcaption>
Click to embiggen.  <a href="http://declare-ai.org/1.0.0-alpha1/total.html">Generated entirely</a> by OpenAI's DALL-E from the prompt “A huge, bleak, room filled with thousands people working on computer terminals cyberpunk style.”.
</figcaption>
</figure>

But even just checking the current change starts to consume more time. Using the
software to arrange *just* the right state of affairs becomes difficult.  What was once purchasing an item from a store is now specifying a postal code, choosing a carrier, deciding on gift wrap, and shipping to more than one address, all so we can check that our post-payment email confirmation gets sent with the right formatting.


The absolutely simplest way to try to sustain *this* method of checking that our software
meets our expectations is to write out all the checks we do every time, and hand them to
an ever-growing team of lower-paid testers.  When you change something, you throw it to the testers and they check it for you.

This increases the lines of communication and creates a significant coordination and management burden.  Who decides what is to be checked?  Who decides what constitutes a valid check?  Who decides what is a failure and what is a miscommunication of expectations? And who makes sure that all the checks check the changes they are supposed to check?

## Scaling a Manual Process Requires People Management, and a Lot of It

The only way to manage this is to have more people and more process for them to follow.  The developers and the testers and the "business people" all meet regularly to figure out what they want and how to test it.  The testers and the developers have to constantly try to align on what is being done and how.

You need managers for everyone and managers for those managers.  Everything has to be checked.  You end up spending most of your time trying to manage three key problems:

* **Reliability**: are the checks actually checking what they are supposed to?  When a check passes, how do we know it really asserted some desired behavior?
* **Coverage**: are we checking everything that's being developed?  When all the checks come back as passing, how do we know that we actually checked the new changes?
* **Scaling**: can we manage an increase in the size and complexity of the software without an exponential increase in time and people to check it?

<aside class="pullquote">The testers and the developers have to constantly try to align on what is being done and how.</aside>

This is how you end up with big QA teams and quarterly releases.  It's so much effort to
even check the existing features of the software that you have to only do it four times
per year.  That's an average of about 7 weeks delay for anything getting shipped.

In addition to delaying the delivery of value to users, it also means that valuable context is lost along a lengthy feedback cycle. When you check your own code right after you wrote it and it doesn't do what you think, you are in a great place to fix it.  If someone you just met tells you that a feature you built three months ago isn't working, you may not even remember working on it, but now you have to fix it.

We wouldn't need batch releases if it didn't take so long to develop, run, and analyze
all these checks.  If checks could be created reliably, covering new features without a
lot of overhead, and could be executed quickly, there'd be no reason to batch releaes.
We could deliver code as soon as all the checks were run because we'd be confident they
covered everything we wanted them to cover.

This is what most teams want to achieve, and it's possible.

## Reliably Checking The Whole System Without a Massive Team is Possible

A common way to address the issues with an ever-increasing team is to turn the manual
checking into automated checking.  The QA team becomes _software engineers in test_, and
they write programs that do the checking.

This *can* reduce the feedback time, but merely automating this process still won't help
issues with reliable checks that provide good coverage.  You still have to manage that
part manually, and that makes scaling hard.  Automated tests help, but they don't solve
the problem.

The way to do this is to invert the process of writing software like so:

1. Write an automated test of the system that fails *exactly* because the desired feature is not present in the system.
2. Write only enough code to make that test pass.

That's it.  It's only two steps.  Everyone knows how to do step 2 already.  Step 1 isn't
easy, but it can be learned.

Why does this address reliability and coverage and allow us to scale?  It's because we
see the tests fail, thus knowing they work, and we don't write code without a test,
meaning all features should have a test, thus achieving good coverage.

## Testing Tests By Watching Them Fail

When you see a test fail, you can be sure it's testing something.  You have to be
careful to make sure it [fails in just the right way][test-stages], and you may need several individual
tests to hone in on a larger behavior.  But a failing test is a reliable test.

Writing a test of already-working code doesn't tell you nearly as much.  Because an
empty test passes the same as a reliable test of working code, you have to examine
the test to make sure it works.  This is hard. And time consuming.

Take this test of calculating the radius of a circle:

```ruby
circle = Circle.new(radius: 5)
assert 78.5, circle.area
```

This test will always pass, and if you wrote it *after* you implemented the `area`
method, you might think your implementation is working.  Look closer.

We should've called `assert_equals`.  If we wrote this test *before* implementing
`area`, we'd see our fresh test of unimplemented behavior pass and we'd know our test
was wrong.

Now, imagine a system more complex than calculating the area of a circle.  You just can't
assert the reliability of tests by reading them.  You need to see them fail.  And it's
much simpler to see them fail before you write the code than after.

When you write the test first, and only write code to make that test pass, you can
then be sure your tests have good coverage.

## Writing Code Second Ensures That Code is Tested

When you write code only to make a failing test pass, you can be pretty confident that
all features are being checked.  If you write tests after the code, well, who knows
what's being tested?  Aside from the difficultly in assessing the reliability of the
tests, you also have to make sure to do it, perhaps writing several lengthy tests to
assert a specific behavior.

It's a subtle difference but it's important. We can't help but think we are done with
the code is written.  That's because in many ways we *are* done.  We could ship that
code without any tests.  To provide test coverage we have to remember to do it and also
feel like doing it.

<aside class="pullquote">
You cannot underestimate how well a process works where being done is the final step, not the first step.
</aside>

Granted, we have to remember to write tests first and feel like doing *that*, but writing
the tests first is much easier muscle to build because it always puts being done as the last step.  You cannot underestimate how well a process works where being done is the final step, not the first step.

This process scales. You don't need more and more testers as your codebase gets bigger.
You may not even need testers at all.

## Automated Tests That are Reliable and Have Good Coverage Scale

More software means more tests. There's no way around it.  When humans are running the
tests and coordinating about what they should do that means more humans are needed. And
when more humans are needed, more management is needed—it's not just a linear thing.

When the tests are automated from the start, written first so we can watch them fail,
and when code is only written to make them pass, you *don't* need more humans  to
run tests.  Yes, you need more humans to write tests (and write code), but it turns out
you can get the same person to do both.

That person doesn't have to coordinate about how to test something, and doesn't have to
negotiate about what is and isn't valid test.  This requires management and training of
the developers, but it's overall less of an investment than a dedicated testing team.

When the team is bought-in to testing first—with clear management expectations that they
do so—and are trained on who to think through testing as a practice (a nontrivial, but
one-time thing), the team will produce reliable tests with good coverage, and not
require an explosion of team members and managers to scale up development.

<div data-ad></div>

Some may bristle at having developers test their own code. They may think that you cannot trust the developers to do this and this is why you have a separate team. This line of thinking means that you don't have developers who care if their code works or, at best, should not have to check that their code works.

You don't have to create such a culture if you don't want it.  If you instead create a culture where developers only write code when a test is failing, you won't have to worry about it. They literally can't ship unless there is test coverage.  You can still have a small team of dedicated testers do exploratory testing to try to find bugs that make it out of development.

At this point, I've laid out the reasoning for a team to adopt driving their development
with tests instead of the other way around.  I would hope this is all not very
controversial: you need to check if the software is doing what it should, and you want
that done reliably, effectively, and without an ever-increasing number of people to do
so.

But, it's not a perfect system.  Don't let uncles and grandpas tell you you always have to work this way. TDD is a technique, not a religion.

## Test-Driven Development is a Tool, not a Way of Life

Some features are hard to test. When you write your tests first, it's much easier to
identify such features.  When you write your tests last, it's harder.  Writing tests
last means you can conflate a test that is possible, but requires a lot of effort, vs a
test that is going to be highly complex and perhaps not even possible.

Writing tests first requires you to think throw *how* you are going to test the code
before you write it. There are many ways to write code to solve some problem, but when
you write the tests first, you kinda have to write that code in a way that affords
testing. This is not the same as "good design".

<aside class="pullquote">You can discuss the issues making it hard to write a test before code is written.</aside>

When writing tests first, if you come across a feature that is hard to test, it's much
easier to discuss it. You can discuss the issues before any code is written. Perhaps the
feature can be re-thought to make testing easier?  Perhaps you'll need additional
monitoring in production to make up for the lack of coverage?  Perhaps you have to find
a better way to implement it so it can be tested more easily? This is all useful
discussion to be had before any code is written.

But in no way will you always write code to make a failing test pass. You'll just know
exactly why you aren't when you can't.

The harder part is that pesky first step - writing a test that clearly asserts the
behavior you want to add.

## Test-Driven Development Requires Learning How to Test

Programmers tend to have the mindset to think through alternatives and
exceptions the way a tester does, or at least they tend to have this ability
commensurate with their general ability to write code.  Placing the implementation
second will provide a natural incentive to refine their ability to test.

But, like any skill the team needs to have, mentorship, training, and critique are all
required to make sure the team is performing well.  Writing tests first doesn't really
change these fundamentals of management. If you want developers writing tests first, you
need to make sure they can learn how to do it.

And, to be clear, adopting test-driven development is a team decision. And that means
management has to make sure it's happening.

## Benefits Come From Team, Not Individual, Practices

The benefits outlined above only really work when the entire team is using the
practice.  Discussing a feature that might be hard to test is much more difficult to do
if half the team isn't writing tests first.  The entire notion of coverage goes out the
window if only some developers are writing tests first.

To get the entire team doing it is a management problem.  While it should take fewer
managers to get a team following a test-first process than to manage a sea of QA
engineers, it still requires someone to ensure that the team agrees to follow the
practice and then actually does it.

<aside class="pullquote">To get the entire team doing TDD is a management problem.</aside>

Pair programming, code reviews, retrospectives, and post-incident reviews are all ways
to manage this, and you may need to be doing some form of all of them. You can't have
managers look over developers' shoulders or require them to show you tests before
allowing them to write code.  The developers have to want to do this.

Fortunately, the reason the entire team should be working test-first applies to a
developer's personal process.  Each developer should want to check that their changes
are doing what they expect.  Each developer should want to know if their changes break
other parts of the system.  Each developer should understand that to do that requires
reliable tests and good coverage.

But this, too, is a process.  And it has nothing to do with going faster or getting a
good design.


[test-stages]: /blog/2022/08/04/the-four-stages-of-testing-that-help-your-focus.htm
