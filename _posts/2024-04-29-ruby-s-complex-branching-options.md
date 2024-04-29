---
layout: post
title: "Ruby's Complex Branching Options"
date: 2024-04-29 9:00
ad:
  title: "Fix Your Crappy Dev Environment"
  subtitle: "Docker and Bash Have you Covered"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

Working on some personal projects where I'm not constrained by older versions of Ruby or on Rails, I've been trying to learn and
use features of Ruby introduced in the last few years.  One feature is pattern-matching, and it's caused me to ask the question: what *is* the best way to create a branching control structure in Ruby?

Before going into this, I was solidly team `if` statements, but now I'm not so sure.


<!-- more -->

Let's say we are writing code to validate HTML forms, server-side.  The basic interaction we want, in Sinatra-esque pseudo-code
is:

```ruby
post "/widgets" do
  result = NewWidget.call(params)

  if results failed data validation
    render "widgets/new", widget: params,
                          errors: results' validation errors
  else
    redirect_to "/widgets", message: "Your widget was created"
  end
end
```

To say in words, we want to try to create a widget based on the form submission.  If the submitted data has validation errors, we
want to show those to the user and let them try again. If the submitted data was valid, we want the widget to be created.  This
is a basic structure we see in Rails apps all the time.

There are three ways to implement this that could be considered idiomatic Ruby, or at least could be done without introducing an
internal DSL<sup id="back-1"><a href="#fn_1">1</a></sup>:

* Using `if` statements based on a protocol the returned `result` object conforms to, e.g. `if result.valid?`.
* Using pattern-matching based on type, e.g. if we get some sort of `InvalidResult` object, we consider that a validation errors.
* Using deconstruction-based pattern matching on the *structure* of the object, e.g. if it "matches" `{ errors: ... }` we
consider that a validation error.

None of these are perfect, and each has problems, so let's see what they are.

## Good 'Ole `if`. Nothin' Beats `if`

This is the most basic way to do this and will result in code that pretty much anyone can understand, especially if they have
experience with Rails.  Our code would look like so:

```ruby
post "/widgets" do
  result = NewWidget.call(params)

  if result.invalid?
    render "widgets/new", widget: params,
                          errors: result.errors
  else
    redirect_to "/widgets", message: "Your widget was created"
  end
end
```

This assumes that `NewWidget.call(...)` returns an object that *must* respond to `.invalid?` and if `.invalid?` returns true,
that same object *must* respond to `.errors`, which we can assume is some sort of array or hash-like structure of errors
that allows the view to show the user what went wrong.

This has a lot going for it:

* Pretty much anyone with any programming experience can understand this code.
* The code is coupled to a *protocol* and not a particular type. As long as whatever comes back from `call` responds to
`invalid?` and, potentially, `.errors`, this code will be fine.
* The implementation of the protocol is also going to be pretty simple.

There *are* some downsides, however:

* Our business logic—`NewWidget.call`—is required to return an object related to form validations.  That's a somewhat odd
abstraction, and perhaps isn't that convienient.  What if we wanted the created widget to be returned if everything worked?
`result` would have to have some additional method to access that, and it could be vague like `.record`, or specific like
`.widget`, but it seems awkward.
* If we needed to do further branching based on the type of errors that were returned, that could lead to a complicated, nested
set of `if` statements, *or* a complicated set of query methods, e.g. `.error?(:name)`.

These trade-offs are usually fine—most conventional programming languages have the ability to write `if` statements and we manage
the downsides as best we can.

## Pattern-matching Based on Type

Before Ruby allowed structural-based pattern-matching, you could use a `case` statement and rely on the implementation of `===`.
In this instance, we could rely on `Class.===` responding true if the object passed is an instance of that class.  That turns our
code into the following:

```ruby
post "/widgets" do
  result = NewWidget.call(params)

  case result
  when ValidationResult::Invalid
    render "widgets/new", widget: params,
                          errors: result.errors
  else
    redirect_to "/widgets", message: "Your widget was created"
  end
end
```

This means that our back-end code would look like so:

```ruby
class ValidationResult::Invalid
  attr_reader :errors
  def initialize(errors)
    @errors = errors
  end
end

class NewWidget
  def self.call(params)
    errors = self.validate(params)
    if errors.any?
      return ValidationResult::Invalid.new(errors)
    end
    # create the widget
    widget
  end
end
```

Without this pattern-matching, our `NewWidget` class *is* akward: it returns a widget if things worked and a totally different
class if not.  But with the pattern-matching, it doesn't seem so bad.

Pros:

* The only return type that matters is when there were validation errors. If there were not validation errors, we can return
other classes.  This means that we can expand the possible results however we need without having to require that all return
values conform to the same interface.
* Because we are branching on type, we have a stronger guarantee that any methods we call are supported.  Given that Ruby has no
concept of an interface that a compiler ensures is implemented, showing the types directly should reduce mistakes.

Cons:

* While the "any return type" feature is flexible, it can also be confusing. If the number of possible return types increases, the code might be hard to follow, predict or manage. Requiring an interface be used would constrain this problem.
* The code is coupled to a specific class. This means that the business logic must always use this exact class (or a subclass) to
communicate validation errors.  This tight-coupling could make refactoring difficult.
* This is fairly verbose. If you imagine that `Invalid` is part of some library you are using for validations, its class name
might be even longer than the one I've used here.  Typing that out all the time and having to read it could be tedious.

We can somewhat split the difference with deconstructing.

## Pattern-Matching on Shape with Deconstruction

Recent versions of Ruby enhanced pattern matching beyond the use of `===`. You can deconstruct a hash or array by default, but
you can also allow any object to be deconstructed by implementing `deconstruct` or `deconstruct_keys`.  This would allow our code
to look like so:

```ruby
post "/widgets" do
  result = NewWidget.call(params)

  case result
  in errors:
    render "widgets/new", widget: params,
                          errors: errors
  else
    redirect_to "/widgets", message: "Your widget was created"
  end
end
```

To make this work, the return type of `NewWidget.call` would need to use an object that could be deconstructed into a hash that
has an `errors:` key.

```ruby
  class ValidationResult::Invalid
    def initialize(errors)
      @errors = errors
    end

→   def deconstruct_keys(keys)
→     { errors: @errors }
→   end
  end

  class NewWidget
    def self.call(params)
      # as before ...
    end
  end
```

The `case` statement's `in` section will effectively call `deconstruct_keys` on `result`, then see if it matches `errors:`. If it
does, it assigns the value of that key in the Hash to a local variable of the same name.

This has some advantages over the other approaches:

<div data-ad></div>

* Not coupled to a specific class or implementation.
* No requirement that the return type conform to any particular interface.
* If the return type could be one of many different classes or with many different shapes *and* the code was called in a lot of
different contexts, being able to "pick and choose" what you wanted out of the return object based on use case could be valuable and reduce coupling.  For a [service wrapper](/blog/2022/10/31/wrap-third-party-apis-in-service-wrappers-to-simplify-your-code.html) of a complex HTTP API, this could be a really nice interface.

That said, there are some downsides:

* Because of the structural matching, an object that can be deconstructed into a `{ errors: ... }` Hash will match, even if that
isn't intended by the caller.  This could be addressed by being more specific, e.g. `validation_errors:` but the looser coupling
could result in unexpected matches, especially if highly dynamic data might be returned.
* It's conceptually dense, requiring knowledge of a lot of implicit behavior to understand.
* You lose almost all definition of the contract between the caller and the result of `NewWidget.call`.  Granted, `deconstruct_keys` is a stronger construct than using Hashes everywhere, but it's still basically using Hashes everywhere, which means your code works based on correctly typing out a lot of strings.

### You Can Do Both

It's possible to match on both class and structure, like so:

```ruby
  case result
→ in ValidationResult::Invalid(errors:)
    render "widgets/new", widget: params,
                          errors: errors
  else
    redirect_to "/widgets", message: "Your widget was created"
  end
```

This would eliminate the possibility of matching any old Hash with an `errors:` key, but of course create coupling to a specific
class and to the return value of a method of that class, which I would find somewhat confusing.

## Summary

I'm hard-pressed to choose the best construct here.  Using `if` statements is a very safe choice because it's the simpleset and
most widely understood.  Still, the pattern-matching deconstruction syntax does provide extremely loose coupling which can be an
advantage.

For me, I want to be able to understand how a piece of code works as quickly as possible, with as little context as
possible.  Time saved writing the code or on compactness isn't that valuable to me.  Generally, more abstractions means code is
harder to understand, however which of these approaches has more abstractions?

The `if`-based approach largely requires some sort of return type abstraction that can handle any outcome of the method call.
The pattern-matching approaches do not require these, even though they themselves are additional abstractions.  Of course, they
are abstractions provided by the programming language and thus easier to learn and more translatable to other projects.

For science, I'm going to try the deconstruction-based approach and see what it's like in earnest.



---

<footer class='footnotes'>
<ol>
<li>
<a name='fn_1'></a>
<sup>1</sup>At this point in the history of Ruby and programming in general, I think any introduction of an internal domain
specific language (DSL) is a serious code smell and should generally be avoided at all costs.  Rails is the only example I can
think of of a really well done internal DSL and I think it still has many flaws and can be very confusing due to this design
decision.  Creating a solid API, using the basic features of your programming language where one can easily trace callsites is
always going to be a better solution.
<a href='#back-1'>↩</a>
</li>
</ol>
</footer>
