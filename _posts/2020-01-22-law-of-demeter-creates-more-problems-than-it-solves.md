---
layout: post
title: "The Law of Demeter Creates More Problems Than It Solves"
date: 2020-01-22 9:00
ad:
  title: "SOLID is Also Problematic"
  subtitle: "More Rules to Myopically Follow To Get Horrible Code"
  link: "http://bit.ly/buy-not-solid"
  image: "/images/not-solid-cover.png"
  cta: "Buy Now $5.99"
related:
  - "SOLID Is Not Solid - Examining the Single Responsibility Principle"
  - "Interface Segregation Principle is Unhelpful but Inoffensive (SOLID is not solid)"
  - "The Open/Close Principle is Confusing and, well, Wrong (SOLID is not solid)"
  - "Liskov Substitution Principle is…Not a Design Principle (SOLID is not solid)"
  - "Four Better Rules for Software Design"
---
Most developers, when invoking the "Law of Demeter" or when pointing out a "Demeter Violation", do so when a line of code has more than one dot: `person.address.country.code`.  Like the near-pointless SOLID Principles, Demeter, too, suffers from making a vague claim that drives developers to myopically unhelpful behavior.

<!-- more -->
<a name="more"></a>
Writing [SOLID is not Solid][solidbook], I found the backstory and history of the principles really interesting.
They were far flimsier than I had expected, and much more vague in their prescription. The problem was in their
couching as "principles" and the overcomplex code that resulted from their oversimplification.  Demeter is no different. It aims to help us manage coupling between classes, but when blindly applied to core classes and data structures, it leads to convoluted, over-de-coupled code that obscures behavior.

[solidbook]: https://bit.ly/not-solid

## What *is* this Law of Demeter?

It's hard to find a real source for the Law of Demeter, but the closest I could find is [this page on
Northeastern's
webstie](https://www2.ccs.neu.edu/research/demeter/demeter-method/LawOfDemeter/general-formulation.html), which
says:

> Each unit should have only limited knowledge about other units: only units "closely" related to the current unit.

The page then attempts to define "closely related", which I will attempt to restate without the academic legalese:

* A *unit* is some method `meth` of a class `Clazz`
* *Closely related* units are classes that are:
  - other methods of `Clazz`.
  - passed into `meth` as arguments.
  - returned by other methods of `Clazz`.
  - any instance variables of `Clazz`.

Anything else should not be used by `meth`.  So for example, if `meth` takes an argument `arg`, it's OK to call a method `other_meth` on `arg` (`arg.other_meth`), but it's *not OK* to call a method on *that* (`arg.other_meth.yet_another_meth`).

It's also worth pointing out that this "Law" was not developed for the sake of object-oriented programming, but
for help defining [_aspect-oriented programming_](https://en.wikipedia.org/wiki/Aspect-oriented_programming), which you only tend to hear about in Java-land, and even then, not all that much.

That all said, this advice seems reasonable, but it does not really allow for nuance.  Yes, we want to reduce
coupling, but doing so has a cost (this is discussed at length in [the book][solidbook]).  In particular, it might be preferable for our code's coupling to match that of the domain.

It also might be OK to be overly coupled to our language's standard library or to the framework components of whatever framework we are using, since that coupling mimics the decision to be coupled to a language or framework.

## Code Coupling can Mirror Domain Coupling

Consider this object model, where a person has an address, which has a country, which has a code.

<figure>
  <img src="/images/demeter_model.png" alt="Class diagram of our object model" />
  <figcaption class="dn">
    Class diagram of the object model.
  </figcaption>
</figure>

Suppose we have to write a method to figure out taxes based on country code of a person.  Our method, `determine_tax_method` takes a `Person` as an argument.  The basic logic is:

* If a person is in the US and a contractor, we don't do tax determination.
* If they are in the US and *not* a contractor, we use the US-based tax determination, which requires a zipcode.
* If they are in the UK, we use the UK based determination, which requires a postcode.
* Otherwise, we don't do tax determination.

Here's what that might look like:

```ruby
class TaxDetermination
  def determine_tax_method(person)
    case person.address.country.code
    when "US"
      if person.contractor?
        NoTaxDetermination.new
      else
        USTaxDetermination.new(person.address.postcode)
      end
    when "UK"
      UKTaxDetermination.new(person.address.postcode)
    else
      NoTaxDetermination.new
    end
  end
end
```

<aside data-ad></aside>

If `address`, `country`, and `code` are all methods, according to the Law of Demeter, we have created a violation,
because we are depending on the class of an object returned by a method called on an argument.  In this case,
the return value of `person.address` is a `Country` and thus not a "closely related unit".

But is that *really* true?

`Person` has a well-defined type.  It is defined as having an address, which is an `Address`, another well-defined
type.  *That* has a country, well-defined in the `Country` class, which has a `code` attribute that returns a
string.  These aren't objects to which we are sending messages, at least not semantically.  These are data
structures we are navigating to access data from our domain model.  The difference is meaningful!

Even still, it's hard to quantify the problems with a piece of code. The best way to evaluate a technique is to
compare code that uses it to code that does not.  So, let's change our code so it doesn't violate the Law of
Demeter.

A common way to do this is to provide proxy methods on an allowed class to do the navigation for us:

```ruby
class TaxDetermination
  def determine_tax_method(person)
    case person.country_code
    #           ^^^^^^^^^^^^           
    when "US"
      if person.contractor?
        NoTaxDetermination.new
      else
       USTaxDetermination.new(person.postcode)
       #                             ^^^^^^^^
      end
    when "UK"
     UKTaxDetermination.new(person.postcode)
     #                             ^^^^^^^^
    else
      NoTaxDetermination.new
    end
  end
end
```

How do we implement `country_code` and `postcode`?

```ruby
class Person
  def country_code
    self.address.country.code
  end

  def postcode
    self.address.postcode
  end
end
```

Of course, `country_code` now contains a Demeter Violation, because it calls a method on the return type of a
closely related unit.  Remember, `self.address` is allowed, and calling methods on `self.address` is allowed, but
that's it.  Calling `code` on `country` is the violation.  So…another proxy method.

```ruby
class Person
  def country_code
    self.address.country_code
    #            ^^^^^^^^^^^^
  end
end


class Address
  def country_code
    self.country.code
  end
end
```

And *now* we comply with the Law of Demeter, but what have we actually accomplished?  All of the methods we've
been dealing with are really just attributes returning unfettered access to public members of a data structure.

We've added three new public API methods to two classes, all of which require tests, which means we've incurred
both an opportunity cost in making them and a carrying cost in their continued existence.

We also now have *two* was to get a person's country code, *two* ways to get their post code, and *two* was to get
the country code of an address.  It's hard to see this as a benefit.

For classes that are really just data structures, *especially* when they are core domain concepts that drive the
reason for our app's existence, applying the Law of Demeter does more harm than good.  And when you consider that
most developers who apply it don't read the backstory and simply count dots in lines of code, you end up with
myopically overcomplex code with little demonstrable benefit.

But let's take this one step further, shall we?

## Violating Demeter by Depending on the Standard Library

Suppose we want to send physical mail to a person, but our carrier is a horrible legacy US-centric one that requires
being given a first name and last name.  We only collected full name, so we fake it out by looking for a space in
the name.  Anyone with no spaces in their names is handled manually by queuing their record to a customer service
person via `handle_manually`.

```ruby
class MailSending
  def send_mailer(person)
    fake_first_last = /^(?<first>\S+)\s(?<last>.*)$/

    match_data = fake_first_last.match(person.name)

    if match_data
      legacy_carrier(match_data[:first], match_data[:last])
    else
      handle_manually(person)
    end
  end
end
```

This has a Demeter violation.  A `Regexp` (created by the `/../` literal) returns a `MatchData` if there is match.  We can't call methods on an object returned by one of our closely related units' methods.  We can call `match` on a `Regexp`, but we can't call a method on what that returns.  In this case, we're calling `[]` on the returned `MatchData`. How do we eliminate this egregious problem?

We can't make  proxy methods for first name and last name in `Person`, because *that* method will have the same problem as this one (it also would put use-case specific methods on a core class, but that's another problem).  We really do need to both match a regexp and examine its results.  But the *Law* does not allow for such subtly!  We could create a proxy *class* for this parsing.

```ruby
class LegacyFirstLastParser
  FAKE_FIRST_LAST = /^(?<first>\S+)\s(?<last>.*)$/
  def initialize(name)
    @match_data = name.match(FAKE_FIRST_LAST)
  end

  def can_guess_first_last?
    !@match_data.nil?
  end

  def first
    @match_data[:first]
  end

  def last
    @match_data[:last]
  end
end
```

Now, we can use this class:

```ruby
class MailSending
  def send_mailer(person)
    parser = LegacyFirstLastParser.new(person.name)
    if parser.can_guess_first_last?
      legacy_carrier(parser.first, parser.last)
    else
      handle_manually(person)
    end
  end
end
```

Hmm.  `LegacyFirstLastParser` was just plucked out of the ether.  It definitely is not a closely-related unit
based on our definition.  We'll need to create that via some sort of private method:

```ruby
class MailSending
  def send_mailer(person)
    parser = legacy_first_last_parser(person.name)
    #        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    if parser.can_guess_first_last?
      legacy_carrier(parser.first, parser.last)
    else
      handle_manually(person)
    end
  end

private

  def legacy_first_last_parser(name)
    LegacyFirstLastParser.new(name)
  end
end
```

Of course, `legacy_first_last_parser` has the same problem as `send_mailer`, in that it pulls
`LegacyFirstLastParser` out of thin air.  This means that `MailSending` has to be given the class, so [let's invert
those dependencies][solid-di]:

[solid-di]: /blog/2019/12/02/dependency-inversion-principle-is-a-tradeoff.html

```ruby
class MailSending
  def initialize(legacy_first_last_parser_class)
    @legacy_first_last_parser_class = legacy_first_last_parser_class
  end

  def send_mailer(person)
    parser = legacy_first_last_parser(person.name)
    if parser.can_guess_first_last?
      legacy_carrier(parser.first, parser.last)
    else
      handle_manually(person)
    end
  end

private

  def legacy_first_last_parser(name)
    @legacy_first_last_parser_class.new(name)
  end
end
```

*This* change now requires changing every single use of the `MailSending` class to pass in the
`LegacyFirstLastParser` class.  Sigh.

Is this all better code?  Should we have *not* done this because `Regexp` and `MatchData` are in the standard
library?  The Law certainly doesn't make that clear.

Just as with all the various SOLID Principles, we really should care about keeping the coupling of our classes low
and the cohesion high, but no Law is going to guide is to the right decision, because it lacks subtly and nuance.
It also doesn't provide much help once we have a working understanding of coupling and cohesion.  When a team
aligns on what those mean, code can discussed directly—you don't need a *Law* to help have that discussion and, in
fact, talking about it is a distraction.

Suppose we kept our discussion of `send_mailer` to just coupling.  It's pretty clear that coupling to the
language's standard library is not a real problem. We've chosen Ruby, switching programming languages would be a
total rewrite, so coupling to Ruby's standard library is fine and good.

Consider discussing coupling around `determine_tax_method`.  We might have decided that since people, addresses,
and countries are central concepts in our app, code that's coupled to them and their interrelationship is
generally OK.  If these concepts are stable, coupling to them doesn't have a huge downside.  And the
domain should be stable.

Damn the Law.
