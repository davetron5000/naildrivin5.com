---
layout: post
title: "Dealing with Flaky Tests"
date: 2022-11-29 9:00
ad:
  title: "Stable and Sustainable Web Development"
  subtitle: "A Deep Dive into Ruby on Rails"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

Jason Swett [asked on Twitter](https://twitter.com/JasonSwett/status/1593653078829457409) if anyone has an app with 2000+ tests that does not have a severe flaky test problem.  I have two such apps, and I want to share the lengths I've gone to to make the tests not flaky.

In a nutshell, you have to build and design for testability at all levels, plus ensure your tests
are clear about what is the cause of a failure.

<!-- more -->

## Why Are Tests Flaky?

In my experience, tests are flaky for one of three reasons:

* Tests that use random data either allow invalid data or have implementations that make assumptions about data input
* Tests that integrate with an uncontrollable third party (e.g. Stripe Test Mode) will not pass if anything is out of whack with the third party.
* Browsers in browser-based tests react very differently and sometimes the test gets ahead of what the browser is doing, but sometimes not.

The browser stuff is the hardest to deal with, but let's look at the first two issues first.

## Dealing with Random Data

I like using randomized data for tests.  Any piece of data that is input to a test that isn't
relevant to the test behavior should be randomized, specifically to create a flaky test that
demonstrates your assumptions about the code or the test are wrong. If certain values truly don't
matter to the test, it should make no difference if they are randomized or not.

<div data-ad></div>

Your test framework should allow setting the random seed so you can recreate the specific data
causing the problem. You then re-run the test with the same input data to figure out why that
specific set of data is causing a failure.

In my experience, this can find bugs in the code, where the code assumed certain data that it
doesn't check or guarantee, e.g. assumes it always gets a positive integer or a string with no
special characters.  Sometimes, this reveals a bad test setup.

Either way, this sort of flakiness is a feature and is usually easy to fix.

## Flaky Third Parties

I find value in running integration tests against third parties where possible.  This is part of
the previously-discussed [service-wrapper pattern](https://naildrivin5.com/blog/2022/10/31/wrap-third-party-apis-in-service-wrappers-to-simplify-your-code.html).  The downside is that these tests can fail because the third party fails.

Usually, the third party isn't so flaky that you can't run the tests, and since these tests
actually integrate with the third party, they are extremely useful.  If the third party really is
unreliable, one option is to tag the test as "flaky" and the omit it by default.  If you are
doing work around the third party, you can still use the test to get signal that your integration
is good.

But, because I use service wrappers, the *only* tests that might be flaky due to third parties
are the service wrapper tests and because *those* are very simple, I can still get reliable
confidence on the behavior of the system since the rest of it mocks the servide wrappers.

This leads to the real problem: browser tests.

## Browser Tests

The simplest way to illustrate flakiness is if your app has some JavaScript interaction.  Suppose
You click a rating button on a product, which triggers an Ajax call, which will update the DOM
without refreshing the page.  Your test wants to assert that a message acknowledging the rating happened. In Capybara, you might write this:

```ruby
visit product_path(product)
click_on "5 Stars"
expect(page).to have_content("Thanks for rating!")
```

The problem is that after `click_on` the browser is executing JavaScript that may or may not
complete by the time `expect(...)` is called.  Sometimes it does, but sometimes not. Flaky.

A common solution is to wait for a specific bit of markup to appear.  Suppose our JavaScript will
arrange to insert a DOM element with `data-testid="acknowledgement"` after it's done working.
Given that, Capybara will wait:

```ruby
visit product_path(product)
click_on "5 Stars"

# `within` will wait for its given selector to appear
within("[data-testid='acknowledgement']") do
  expect(page).to have_content("Thanks for rating!")
end
```

Of course, even this can be flaky because Capybara will only wait so long.

**DO NOT USE `sleep` TO SOLVE THIS PROBLEM**

Instead, tell Capybara to wait longer via `Capybara.using_wait_time` like so:

```ruby
visit product_path(product)
click_on "5 Stars"

Capybara.using_wait_time(10) # seconds
  within("[data-testid='acknowledgement']") do
    expect(page).to have_content("Thanks for rating!")
  end
end
```

If a previously-passing test becomes flaky, here is what I do:

1. Fire up the app and make sure the feature is still working.  It can extremely hard to tell the difference between the feature being broken and not enough time waiting.
2. If the app is working, add `using_wait_time` or change the value to be higher, then re-run.
3. Intentionally break the code to see the test fail.
4. Un-break the code

You *have* to stay on top of this, because you want the test to fail when your code is broken.
And, in order to be able to this, your code and markup has to do things that allow your tests to
unambiguously understand the state of the app.  You have to design testability in.

I have a feature that relies on a lot of animation.  The user clicks a button and a new component
animates in to allow another selection, then it animates out.

I created a class to wrap JavaScript's animation API. This class accepts a start state and an end
state and has methods like `animateForward()` and `animateBackward()`.  This fully implements the
needs of the feature.  But the resulting feature cannot be tested, at least not reliably.

The animation class had to add extra features to allow modifying the DOM to understand when
certain events happen. In my case, adding a callback to run after the animation completed was how
I solved this.  I use that callback to set `data-` elements like so:

```javascript
this.animator.animateForward().then( () => {
  this.element.dataset.emailFieldAnimatedIn = true 
  delete this.element.dataset.emailFieldAnimatedOut
})

// or...

this.animator.animateForward().then( () => {
  this.element.dataset.emailFieldAnimatedOut = true 
  delete this.element.dataset.emailFieldAnimatedIn
})
```

The test is then coupled to this. It knows that when it clicks something that will animate
forward, it must do:

```ruby
find("[data-email-field-animated-in]")
```

Each feature has to be designed not just to meet its functional requirements, but also to be
testable, even if making it testable is complicated.

This all starts by simply committing to not having flaky tests. It should be a value your team holds: no flaky tests.  A flaky test *must* be fixed immediately. Otherwise, you have a test that provides no value (in fact, it's less valuable than no test).
