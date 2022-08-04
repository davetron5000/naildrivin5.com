---
layout: post
title: "The Four Stages of Testing That Help Your Focus"
date: 2022-08-04 7:30
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images//sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
related:
  - "Four Better Rules for Software Design"
  - "Four Reasons Developers are Unproductive"
  - "On Slow Test Suites and CI Servers"
---

When writing tests, it's useful to consider that the tests are always in one of four distinct stages, and
knowing which stage they are in can direct your next steps.  This can make testing a bit less painful than it might
otherwise be.

The four stages are:

1. The code doesn't compile/build/parse
2. The tests produce an error (as opposed to a failure)
3. The tests are failing
4. The tests are passing

<!-- more -->

Working effectively with tests requires understanding the difference in these stages and being super careful to take only certain actions depending on what stage you are in.

When tests aren't passing, it can be extremely frustrating trying to figure out exactly why and what to do about it.
Sometimes a test fails on purpose, sometimes it passes when it shouldn't, and because tests are often an indicator
of progress when coding, if they aren't working, it can make programming feel especially chaotic.

Let's start with a hopefully infrequent stage of testing: the code isn't even valid.

## Stage 1 - Code is not compiling

In a language that's interpreted, like Ruby or Python, Stage 1 happens when there are syntax errors or missing
keywords.  For a compiled language, Stage 1 can happen for syntax errors too, but also for missing libraries or other
dependencies required to compile the code.

<div data-ad></div>

All that to say, it's usually obvious when you are in Stage 1, and it means you have zero information about your
tests or your system. You need to get out of this stage as quickly as possible and just focus on getting the code to
properly parse or compile.


This can lead to any of the other stages, depending on what code you've written.  The most frustrating stage is Stage
2, because it means your test isn't even failing, it's just not working right.

## Stage 2 - Your Tests Produce an Error, not a Failure

Here, your code compiles and parses, and your test runs, but it produces an error instead of a failure.

Consider this example test in Ruby where we are setting a customer's city, based on their zip code.  Let's assume we
have test fixtures set up, and a method named `fixtures` accepts a parameter and returns a pre-configured object:

```ruby
customer = fixtures(:customer)
city_lookup.lookup(customer.address.zip_code)
assert_equal "Washington", customer.address.city
```

If our `customer` doesn't have an address, the call to `lookup` will fail because we're trying to get the `zip_code`
of `nil` (Ruby's version of null).  Our assertion isn't even called!  The test has an error—not a failure—and we're
in Stage 2.

The biggest frustration about being in Stage 2 is that an error is not always easily distinguishable from a failure.

### Test Errors Can Look Like Failures

The main reason it can be hard to distinguish an error from a failure is that most test runners don't do much to help distinguish these cases.  Often, both a failure and an error are printed in red text and both provide a stack trace.  You have to read quite carefully to figure out what's what.

The reason it's important to know you are in Stage 2—as opposed to Stage 3 where you have a properly failing test—is that you can't safely change production code, since your test isn't really testing anything.

Getting out of Stage 2 requires not just a careful reading of the error message but a careful re-examination of the
code that sets up the test.  If the test setup is complicated or relies on data set up elsewhere (like our fixtures), this can be difficult.

The way I have navigated this is via *confidence checks*.

### Confidence Checks Test the Tests

A confidence check is code that makes assertions about the test itself, designed to fail before the test is run if the test's assumptions about setup aren't correct.

Some developers use their testing framework's assertion library to do this, but this results in error messages that
look like test failures:

```ruby
customer = fixtures(:customer)
refute_nil customer.address # <-- produces an assertion failure, but
                            #     we haven't run the test yet!

city_lookup.lookup(customer.address.zip_code)
assert_equal "Washington", customer.address.city
```

Instead of an assertion failure, we want a much more clear message that the failure is in our test itself.  Such a
check gives us confidence our test is valid.

You could achieve this like so:

```ruby
customer = fixtures(:customer)
if customer.address.nil?
  raise "CONFIDENCE CHECK FAILED: customer.address was nil"
end

city_lookup.lookup(customer.address.zip_code)
assert_equal "Washington", customer.address.city
```

The use of `raise` will cause the test to produce an error *and* the message will have the words "CONFIDENCE CHECK
FAILED" which should be hopefully a strong clue about what happened.  I've found this pattern so useful that I
extracted a Ruby gem for it called [confidence\_check](https://github.com/sustainable-rails/confidence-check) that
makes this check even more explicit in the code, and allows using the testing library's assertion methods, rather
than cumbersome `if` statements:

```ruby
customer = customers(:one)
confidence_check do
  refute_nil customer.address
end

city_lookup.lookup(customer.address.zip_code)
assert_equal "Washington", customer.address.city
```

I'd strongly encourage the development of tools like this to help navigate the various stages of testing. Unlike
using a debugger, confidence checks provide a clear and permanent record of what setup is meaningful in your test.

Now, once you understand why your test is creating an error, and with the help of confidence checks, you can fix the
test so that it's properly failing.

## Stage 3 - Your Tests are Failing

In this stage, you have a test that is not generating an error, but is failing.  What to do next highly depends on
how you got here.

If you got here by writing a test as part of doing Test-Driven Development, great!  Your next job is to write
production code to get that test passing.

But, it's possible to get to Stage 3 by introducing a regression. You may have written some new code that you believe is correct, but a test elsewhere is now failing.  This may seem like a simple problem to fix, but it's possible that your code change obviated the need for the test that's failing.  You now have to figure out if the failing test is still valid.

It's not always easy to know if you have introduced a regression, and it requires carefully reading both the code that's failing and the test, then thinking about both in the context of your change.

A few questions you can ask yourself might help:

* Is the test that's failing testing something related to what was just changed?
* Is there another way to make the change such that the tests don't fail?
* How broadly used is the code that the failing test is testing?

These answers can help figure out which of the three options available you should pursue:

* Fix the code that's failing so the test passes
* Change the test so that it no longer fails
* Remove the test

All three have risk, but I find it useful to assume that all tests are there for a reason and try not to change them
if I'm not specifically changing the behavior being tested.

Deleting the test is the highest risk option, because you are removing a signal about the code's behavior.  If you have production monitoring that might reveal a problem with the code in question, deleting the test is less risky. But it should still be a last resort that you are confident is the way to go.

In any case, once you have the test passing, you're in the hopefully final stage of testing!

## Stage 4 - The Test is Passing

Like Stage 3, the meaning of Stage 4 depends on how you got here.  If you got here from Stage 3, that's good because
it means you saw your test fail in an expected way and made it pass by writing code.

You may also get here by writing a new test for missing test coverage.  In this case, I would highly recommend
breaking the code under test to make sure your test is valid.  You can't really tell what a test is testing unless
you see it fail.

Where things get tricky is if you ended up in Stage 4 from Stage 1, 2, or…Stage 4. This means you've introduced a new
test that is not asserting any new behavior of your code.

Often, deleting the test and rewriting it can solve the issue.  Test code is the least exciting to write, and in my
experience, it tends to be a magnet for silly typos, reversed logic, and off-by-one errors.

Barring that, the techniques for getting out of Stage 2 can help.  It's almost certain that the test setup is not
sufficient to reveal the missing behavior.  Confidence checks are a great way to debug this and you can leave them in
if your test setup is complicated enough. They can be highly instructive for future programmers.

Hopefully, this will get you to Stage 3 where you can then get to stage 4 the right way.

## Using the Stages in Real Life Testing

Writing test code is not fun. I don't enjoy it, but I feel it's important.  Thus, it's important to make it as
painless as possible to work with.  Understanding what stage your tests are in can help you focus on the next steps
to get a reliable failing test and an implementation that makes it pass.



