---
layout: post
title: "The 'Type Wars' Are Far From Over"
date: 2016-05-03 12:00
---

Uncle Bob penned an [interesting piece called Type Wars](http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html).  It's ostensibly a history of the fashion around how types are handled in programming languages.  It, unfortunately, comes to the conclusion that "TDD and unit tests means you don't need statically-enforced types".  This is not true.

He initially describes how C had types, but they weren't enforced at compile- or run-time.  This is bad (he says and I agree) and then talks about two ways to enforce type safety (i.e. require that the you are using the correct types).  In Java, the compiler requires it or the code won't even run.  In Smalltalk, the runtime requires it only at runtime.  And, according to Uncle Bob, the latter is preferable because you have unit tests.  This is not true (he also overstates the burden required in having types enforced at compile time—just because Java is terrible doesn't mean the concept is).

In particular, he creates a false equivalence between unit testing and static type checking:

> You don't need static type checking if you have 100% unit test coverage.

Not true.

<!-- more -->

## It's Not True, but Suppose It IS

If this is true (it's not), it doesn't imply that 100% test coverage is a better method of ensuring program correctness than static type checking.  Consider a routine to format a name for a person in the US:

```ruby
class UsaNameFormatter
  def format(first_name, last_name)
    first_name + " " + last_name
  end
end
```

Here is a test that achieves 100% test coverage (I'm assuming Uncle Bob means "statement coverage" due to his assertion that "unit test coverage close to 100% can, and is, being achieved"; [other types of coverage](https://en.wikipedia.org/wiki/Code_coverage) are very difficult to achieve at 100% and very difficult to measure.).

```ruby
def test_format
  formatter = UsaNameFormatter.new
  assert_equals "Dave Copeland", formatter.format("Dave","Copeland")
end
```

Despite 100% test coverage, our `format` call still feels buggy, especially around the types of data we pass in.  If we pass in `nil` for either value, it blows up.  If we pass in non-strings, it blows up (unless those values support `+` in all the ways it's being used, in which case it returns a possibly unexpected value).

In order to ensure we aren't making these type errors, it's not sufficient to just test `UsaNameFormatter`, we must ensure that the unit tests of very single _use_ of this class pass in the correct arguments. This means at least one test per callsite and those tests must be carefully written so that if future changes to the code pass in nil or non-Strings, those tests fail.

Now consider if we had static type-checking, particularly something like Swift that prevents nil values if you haven't opted into them:

```swift
func format(firstName: String, lastName: String) -> String {
  return firstName + " " + lastName;
}
```

We still need a test that the name is formatted correct, but *that's it*.  We never have to worry about this being called incorrectly, and we don't have to test the _use_ of this function, because it's impossible to mis-use.

So, I would say that even _if_ you could obviate the need for static type checking by having 100% unit test coverage, it's not the best way to model correctness: it's difficult and costly.

Of course, it's not actually true that 100% unit test coverage obviates the need for static type checking.

## It's Not True

Consider `UsaNameFormatter` above.  Suppose that it's part of a name-formatting library.  In that case, our existing unit test provides 100% test coverage for our library.  If the "you" is "the person that wrote the library" then, I guess you could say that we don't need static type checks, because our hands are clean.  If you use the code the way we told you, it's fine.

If "you" is "the user of the library" then things don't look so good.  First, you don't have any way to know what you are supposed to pass in.  You could look at the code or unit tests to see what you _can_ pass in, but you can't possibly know what the intention is of the routine or library.  The library author has to tell you, with words and text and prose and hopefully in a way that you can understand.  And even then, if you mess it up, you can get cryptic runtime errors.  It's hard to think of this situation as "the program is correct".

Our unit tests should not test the correctness of our third-party name-formatting library.  This is a common rule of thumb and I don't know of any reasonable guidance that says the consumer of a third-party library should write unit tests for that library.  Instead, we tend to mock our use of said third-party library.


Suppose we used `UsaNameFormatter` in a presenter to format the name of our `Person` object.

```ruby
class Presenter
  def initialize(person)
    @person = person
  end
  
  def display_name
    UsaNameFormatter.new.format(person.given_name,person.sirname)
  end
end
```

To test it, we mock `UsaNameFormatter`, because again, we don't normally test our third-party code in _our_ unit tests.

```ruby
person = Person.new
presenter = Presenter.new(person)

expect_any_instance_of(UsaNameFormatter).
  to receive(first,last).and_return("Dave Copeland")

expect(result.display_name).to eq("Dave Copeland")
```

100% (passing) test coverage!  Unless the constructor of `Person` sets default names (and in almost all cases, it wouldn't), we have a passing test where we pass in `nil` to `UsaNameFormatter#format`—a situation that would certainly cause a runtime error.  We have a bug.  How could this be?  Both our code and the third-party library have 100% unit test coverage.  What could static typing have done here that we have not already done?

Consider a Swift version of this.  The compiler would see that our Person's `last_name` field is of type “nullable String”, and that our formatter requires the type “non-nullable String”.  It would refuse to compile or execute the code.  The bug would be impossible to write.

Therefore, it's still possible to write bugs (bad ones!) that would be caught by static type-checking, despite having 100% unit test coverage.

But it gets worse.

## Everything is A String, Right?

When you write code with the notion that "you don't need types because you have 100% unit test coverage" (a flawed, but not unreasonable, interpretation of what Uncle Bob is saying), you end up not using types, and instead making everything a String or a Hashtable.  And isn't this the problem with our name-formatting in the first place?

Think of every possible `first_name` a person in the US could possible have.  Is this the **exact same list** as every possible string in the known universe?  No it's not.  So why are we using Strings?!?!?  And if if that *were* true, the formatter code says that everyone must have a first name, so `nil` is not a valid first name, yet we have chosen types that allow it.

We do this all the time, because in dynamic languages, we don't get the full benefits of static type checking, and thus there is less incentive to create custom data types.  In some static languages, like Java or C#, the type system is weak and verbose, so this, too, puts up a barrier to using custom data types.  Instead, we use Strings for everything.  This is terrible.

Static type checking *can* be a benefit.  It can identify bugs that are difficult or impossible to detect with 100% unit test coverage, and do so much more simply and easily.  The Type Wars are far from over.

