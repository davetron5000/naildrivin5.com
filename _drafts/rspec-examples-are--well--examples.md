---
layout: post
title: "RSpec Examples are, well, Examples"
date: 2022-11-09 9:00
---
RSpec's internal DSL allows creating some difficult-to-sustain structures and code, but there is one guiding principle that has helped me avoid making tests that are *too* weird:

RSpec tests should be examples of how the code under test would be used.

Let's see a few examples: using `subject` and avoiding predicate matchers.

<!-- more -->

## `subject` is the heart of your test

RSpec provides the `subject` method, which it documents to [allow all kinds of odd stuff](https://relishapp.com/rspec/rspec-core/v/3-11/docs/subject/explicit-subject), but at it's core:

> Use `subject` in the group scope to explicitly define the value that is returned by the `subject` method in the example scope.

The problem is, you would never call your object `subject` in your regular code:

```ruby
# Yes, naming is hard, but it's not THIS hard
subject = user.orders.last

# You would almost certainly do this
order = user.orders.last

# or maybe this
last_order = user.orders.last
```

You would call the object being tested ideally the name that would be used in most common scenarios where the object is being used.  RSpec even recommends this (despite spending the rest of the docs explaining how to not follow this recommendation):

> We recommend using the named helper method over subject in examples

```ruby
subject(:order) { described_class.new }
```

This is better than `let` because it indicates that this particular variable is special: it's the object under test.

Using `subject` in this way means you won't be able to use the [one-liner syntax](https://relishapp.com/rspec/rspec-core/v/3-11/docs/subject/one-liner-syntax), which is a good thing. Tests that use it are not examples of the code under test and hide a lot of useful information inside implicit behavior:

```ruby
it { is_expected_to be_empty }
```

Absolutely none of that is an example of the code you would write, meaning you have to mentally translate this code into what would actually happen in order to understand what is being tested. That it reads like English—"it is expected to be empty"—is not nearly as useful as knowing what code is being tested.

Aside from the `is_expected_to`, the `be_empty` can be used in other contexts, however it is still problematic.

## Predicate Matchers mask Behavior For No Real Benefit

[Predicate matchers](https://relishapp.com/rspec/rspec-expectations/v/3-12/docs/built-in-matchers/predicate-matchers) allow you to write an expectation in a pidgen-like English:

```ruby
expect(order).not_to be_sent
``` 

What is being tested here?  Sure, we can say that the order is expected not to have been sent, but this is a test, not documentation. We need to understand exactly what invocations of what code should have what behavior. If the test isn't the place where that goes, I'm not sure what is.

This is better:

```ruby
expect(order.sent?).to eq(true)
```

*This* test shows the actual code being tested. This is good (it also tests precisely the behavior, which the predicate matcher does not. Read on).

A commonly-cited benefit of the predict matcher form is that it produces a better error message, something like

```
expected order.sent? to be truthy
```

The more explicit version would produce this:

```
expected false to be true
```

In both cases, the default error formatter would also show the line of code in the test that failed, so in both cases you would see the call to `.sent?` in the error output.  To me, this is fine. While "expected false to be true" is not a great message, since it's shown right next to the line of code being executed, it's not a problem for me to sort out what went wrong.

But note also what the predicate matcher is testing. It's not testing that `.send?` returned `true`. It's testing that it *didn't return false or nil*.  If that is not
what `.sent?` is supposed to do, the predicate-based test is *wrong*.  I like to assert the test results to be precisely what I mean them to be, and for Ruby that means
you have to use `eq(true)` if you want to test that a predicate method returned true (or false).

For me, the predicate matcher is all downside - it makes it hard to understand what code is actually being tested, it does not assert precisely the value you may think
it does, and the error message for the *non* predicate test has all the information the predicate one does.

There are a ton of other ways in which writing tests as *examples* of the code under test can lead to explicit, yet clear code.  It does mean you won't use several RSpec features, but this is fine.


