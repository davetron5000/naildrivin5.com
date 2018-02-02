---
layout: post
title: "Explicit Code is Inclusive"
date: 2018-02-02 9:00
ad:
  title: "Leverage Yourself"
  subtitle: "11 Practices to Be Your Best"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---

Python [famously holds as a value](https://www.python.org/dev/peps/pep-0020/#id3) “Explicit is better than implicit”. This is not
something Rubyists (or many functional programmers) value, instead favoring compactness or “elegance”. I believe senior
developers undervalue explicit code that uses fewer features than it could.  Compact code that uses many language, library, and
framework features excludes people from understanding and contributing to it, and I believe this is a serious consideration when
writing code.  What better judge of a codebase's maintainable could there be than “fewest concepts needed to understand it”?

<!-- more -->

Let's look at some code that takes a bunch of financial transactions and sums up the refunds.  Here's our `Transaction`:

```ruby
class Transaction
  attr_reader :amount,
              :transaction_type # :charge, :refund, :correction

  def initialize(amount,transaction_type)
    @amount           = amount
    @transaction_type = transaction_type
  end
end
```

Here's how we'd do this in a fairly “functional” way (and that way I'd likely write this):

```ruby
refund_amout = transactions.select { |transaction|
                 transaction.type == :refund
               }.map(&:amount).reduce(&:+)
```

That's pretty compact!  Do you know how it works?  If you are a seasoned Rubyist, it's possible you do.  If you are *not* a
seasoned Rubyist, you likely aren't sure about some of what's going on there.  If you are not a Rubyist at all, you might have no
clue.

How about a different version:

```ruby
refund_amount = 0
transactions.each do |transaction|
  if transaction.type == :refund
    refund_amout = refund_amout + transaction.amount
  end
end
```

I would wager that just about *any* programmer could understand what is going on here.  Think about that.

In the first example, almost anyone will need to upack what is going on to figure it out.  Some programmers might *never* figure
it out, because how do you google `&:+`?

In the second example, anyone can almost immediately figure it out.  Meaning almost anyone can change it if needed.  There is
power in that.

You could argue that the first example is “better” in some way.  You might even be able to apply [some objective
measures](http://naildrivin5.com/blog/2012/06/27/what-is-better-code.html) to it.  Doing so would likely reveal the first example
to be less complex (fewer branches, fewer lines of code), which is implied to mean “easier to understand”.  Yet, it's not easier to understand at all.


What if we counted up all the concepts you have to know to understand the code?

In our first example, you must understand:

* What `select` does
* What the block of curly brackets does
* What a variable inside pipes means
* What `map` does
* What `&:foo` does
* Why that also works on `+`
* What `reduce` does

In our second example, you must understand:

* What `each` does
* What `do` does
* What a variable inside pipes means
* How an `if` statement works
* How `+` works

<div data-ad></div>

Not only does the second example require fewer concepts to know, but many of these concepts are fairly universal: most programmers understand `+` and `if`.

You could argue that a Ruby programmer *should* know `select`, `map` and friends, and that by avoiding them we're “dumbing down” the code. This is a perfect example of the [No True Scotsman fallacy](https://en.wikipedia.org/wiki/No_true_Scotsman).  Even if you *do* believe that we must code to some base level of Ruby knowledge, such a belief excludes non-Ruby programmers.

And this is the point: fancy code is exclusionary.  The cost of changing that code is higher because the pool of developers that can work on it is lower, and the cost of increasing the size of that pool is higher.

This isn't to say that inclusivity is the *only* criteria we should use to examine code, but it's something we often forget, and
it's pretty important.  If your team plans to grow, the more programmers out there that could join your team and be successful,
the easier it will be for you to grow that team.  If you require deep expertise in a language or framework to be productive,
you either have to filter for that in your interview process, or be prepared for a long onboarding to get new people
productive.

The next thing you work on, try writing the code more explicitly. Try using fewer concepts to get the job done.  You will find it
easier to get feedback and help, and the code might actually be simpler.
