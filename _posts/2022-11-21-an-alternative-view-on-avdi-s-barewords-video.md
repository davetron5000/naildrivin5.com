---
layout: post
title: "An Alternative View on Avdi's Barewords Video"
date: 2022-11-21 13:00
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

Avdi Grimm has created great videos about Ruby called Ruby Tapas, and put up an older one
as a video for his new [Graceful Dev](https://graceful.dev) offering.  The video is called [Barewords in Ruby](https://www.youtube.com/watch?v=9bIyldX-wEc) and it's a good demonstration how to make changes to a system without changing a core piece of logic.

While I like how Avdi approaches it, I'd make different trade-offs and make changes that result
in code with behavior more easy to predict than code that requires fewer changes.  Let's see.

<!-- more -->

The video centers around the following code as it goes through a series of changes.  It starts
like so:

```ruby
saluatation     = # ...
title           = # ...
full_name       = # ...
progname        = # ...
version         = # ...
designation     = # ...
service_inquiry = # ...

puts "#{saluatation}, #{title}, #{full_name}. ",
  "Welcome to #{progname} version #{version}. ",
  "My name is #{designation}.",
  "May I #{service_inquiry}?"
```

Avdi simulates changes to the system that affect where the various values are stored.  After
reacting to all the changes, he ends up with the following method that references each piece of data directly:

```ruby
def greet(title, first_name, last_name)
  puts "#{SALUATATION}, #{title}, #{first_name} #{last_name}. ",
    "Welcome to #{$progname} version #{DisOrganizer::VERSION}. ",
    "My name is #{@designation}.",
    "May I #{special_feature.service_inquiry}?"
end
```

The problem Avdi identifies in this approach is that each change to where the data was stored
required a change to this code as well. He then tries again, making the changes so that very few
changes to the `greet` routine are required. He does this by creating parameters, local
variables, or private methods on the class. These are *barewords* and by making the bareword
`progname` a method, instead of a local variable, the use of `progname` in the interpolated
string continues to work.

This is where he ended up by applying this strategy:

```ruby
  def greet(title, first_name, last_name)
    full_name = "#{first_name} #{last_name}"
    puts "#{saluatation}, #{title}, #{full_name}. ",
      "Welcome to #{progname} version #{version}. ",
      "My name is #{designation}.",
      "May I #{service_inquiry}?"
  end
```

He argues that each time the location of data had to change (for example, `salutation` needing to
be a class-level constant), the `greet` code had to change.  This increases the chance of
errors and requires changing more code than technically necessary.

Avdi recommends this approach. He says to ask yourself if you can replace a reference to some piece of data with a method in scope, local variable, or parameter instead of referencing it directly.  He says that this makes the code more flexible.

All of this is true!  But it assumes that flexibility is good, or at least that prioritizing flexibilty over clarity is.  Look at the two methods.  In the first one above (which is what Avdi wants to avoid), it's pretty obvious (at least to me) where the data comes from:

* `SALUATATION` is a constant of the current class
* `title`, `first_name`, and `last_name` are parameters
* `$progname` is a global
* `VERSION` is part of the `DisOrganizer` class
* `@designation` is an instance variable. We'll need to look outside this method to see where it's set.
* `special_feature` requires looking outside `greet` to figure out where it gets its value.

In Avdi's preferred implementation, it's less clear where the data comes from.  With the exception of `title`, `first_name`, and `last_name`, you have to hunt around to figure out where the values come from.  Some are methods of an included module, some are global private methods, and some are methods on the current class.

Imagine if the "version" part of the string output by `greet` is wrong.  In Avdi's preferred version, you'd need to do some hunting:

1. Is it a parameter? No.
1. Is it a method on the current class? No.
1. What does the current class extend or include?  `DisOrganizer`
1. Is `version` a method of `DisOrganizer`? Yes. That must be it.

<div data-ad></div>

Note that if the current class included more modules or has a base class, *all* of those would
have to be checked, as well as whatever *they* include or extend.

In the more direct version, you take one step: `VERSION` is a constant of `DisOrganizer`.

To me, the more direct code is better.  Its behavior is more easy to predict, and predicting the behavior of code is something we do quite a bit! Since the code is not very flexible, there's less research required to figure out how it works.  I would even prefix `special_feature` with `self.` to make it clear it's a method of the current class.

The two alternatives also say different things about the design.  In Avdi's preferred version, the code says the class has a concept of a `version` that is dynamic and potentially replaceable by other logic.  It's something to override or change as the need arises.

The more direct version, which I prefer, makes no such claim. It tightly couples the version part
of the string with `DisOrganizer`.  It's statement is that there is no concept of a version on
the current class, it's not something to configure or make dynamic, and it should not be
configurable.

But, you can see that this is a tradeoff.  The code I prefer *does* require constant changes
every time the source of the data changes.  The code *has* to be well tested in order to safely
do this.

Avdi's preferred version *does* isolate the `greet` method from changes. It also prevents some
classes of errors like mis-typing an instance variable name.

Understanding what trade-off you are making is a good thing, however.  If you find yourself wrapping an instance variable or other reference in a private method, ask yourself what problem you are trying to solve. Ask yourself if the resulting code meets your needs. Ask yourself if the resulting code has behavior that's easier to predict.

For each lever of flexibility you add to your class, ask yourself if you need it. If you don't, you may regret adding it.
