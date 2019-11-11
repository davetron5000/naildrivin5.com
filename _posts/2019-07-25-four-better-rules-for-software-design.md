---
layout: post
title: "Four Better Rules for Software Design"
date: 2019-07-25 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "Coding without (many) Expressions"
  - "Creating a Culture of Consistency"
  - "Choosing Technology"
---

Martin Fowler recently tweeted a link to [his blog post][fowler] about Kent Beck's four rules of simple design,
which I think could be improved upon (and, which can lead programmers down the wrong path at times):

Kent's rules, from [Extreme Programming Explained][xpbook] are:

* Runs all the tests
* Has no duplicated logic. Be wary of hidden duplication like parallel class hierarchies
* States every intention important to the programmer
* Has the fewest possible classes and methods

In my experience, these don't quite serve the needs of software design.  My four rules might be that a
well-designed system:

* is well-covered by passing tests.
* has no abstractions not directly needed by the program.
* has unambiguous behavior.
* requires the fewest number of concepts.

To me, these flow from what we do with software.

<!-- more -->

## What *do* We Do With Software?

We can't talk about the design of software without first talking about what we intend to do with the software.

Software is written to solve a problem.  It is executed and has behavior.  That behavior is observed to reinforce
correctness or identify problems.  Software is also changed to give it new or different behavior.

So, any approach to the design of software has to be centered on predicting, observing, and understanding its behavior, and making it as easy as possible to change that behavior.

Testing is how we verify behavior, and I would agree with Kent that first and foremost, well-designed software
must pass its tests.  I would go further, however, and insist that the software have tests (thus “well-covered”).

After behavior has been verified, the remaining three items on both of our lists concern themselves with understanding the software (and thus its behavior). His list starts with addressing duplication, which is fitting. In my experience, an over-focus on reducing duplication comes at a high price.  To remove duplication, one must create abstractions to hide it and it's these abstractions that make it hard to understand and modify a software system.

## Removing Duplication Requires Abstractions and Abstractions Breed Complexity

“Don't Repeat Yourself”, AKA _DRY_ is used to justify some questionable design decisions.  Have you ever seen
code like this?

```ruby
ZERO = BigDecimal.new(0)
```

Surely the value of zero won't be changing, right?  More likely, you've seen something like this:

```java
public void call(Map payload, boolean async, int errorStrategy) {
  // ...
}
```

When you see methods or functions with flags, booleans, etc, it's usually because someone has “DRYed” up some
code, but the code wasn't *exactly* the same in both places, so the extracted code needed flexibility to
accommodate both sets of behavior.

<div data-ad></div>

Such generalized abstractions are notoriously hard to test and understand because they must handle many more use-cases than the original (potentially duplicated) code.  Said another way, abstractions support more behaviors than  might actually be needed for the system to function properly.  Thus, the removal of duplication *can* introduce new behaviors to the system that aren't required.

That said, it *is* important to centralize certain types of behavior, however it's difficult to know what behavior
really is identical.  Often, bits of code look similar, but are only similar by happenstance.

Consider how much simpler it is to remove duplication than to re-introduce it (e.g. after a poorly-thought-out abstraction was created).  Thus it stands to reason we should err on the side of leaving duplication if we aren't totally sure the best way to eliminate it.

The creation of abstractions should make us all wary.  If, in the course of removing truly duplicate code, you create a highly-flexible generalized abstraction, you may be going down the wrong path.

This leads to the next point about intent vs behavior.

## Programmer Intent is Meaningless—Behavior is Everything

We often laud programming languages, constructs, or bits of code for “revealing programmer intent”.  But what value is knowing the intent if you cannot know the behavior?  And when you know the behavior, how much does the intent really matter?  Granted, you *do* need to know how the software is *supposed* to behave, but this is not the same as “programmer intent”.

Consider this degenerate example that is very revealing of programmer intent, but that does not behave as intended:

```jsx
function LastModified(props) {
  return (
    <div>
      Last modified on
      { props.date.toLocaleDateString() }
    </div>
  );
}
```

Clearly, the programmer intends this React component to render a date along with the message “Last modified on”.
Is that how this behaves?  Not exactly.  What if `this.props.date` isn't set?  The entire thing blows up.  We
don't know if they intend this or just forgot, and it doesn't matter.  What does matter is how it behaves.

And this is what we must know to change this piece of code.  Suppose we are asked to change the string to be “Last
modification”.  While we can do that, it's still unclear what is supposed to happen if the `date` is missing.  If,
  instead, the component were written to make its behavior more clear, it would be better.

```jsx
function LastModified(props) {
  if (!props.date) {
    throw "LastModified requires a date to be passed";
  }
  return (
    <div>
      Last modified on
      { props.date.toLocaleDateString() }
    </div>
  );
}
```

Or perhaps

```jsx
function LastModified(props) {
  if (props.date) {
    return (
      <div>
        Last modified on
        { props.date.toLocaleDateString() }
      </div>
    );
  }
  else {
    return <div>Never modified</div>;
  }
}
```

In both cases, the behavior is more clear, and the programmer intent is meaningless.  Suppose the code looked as
it does in the second alternative (where it handles the missing `date`).  When asked to modify the message, we can see the behavior and double check that the “Never modified” message is correct, or if it must also change.

Therefore, the less ambiguous the code's _behavior_ is, the better chance we have of successfully changing it.
And this might mean writing more code or being more explicit, or even duplicating things here and there.

It also might mean we need more classes, functions, methods, etc.  Although it *is* desirable to keep the number
of classes et. al. to a minimum, we don't want to use that as our metric.  The problem created by having a lot of
classes or methods is one of _conceptual overhead_, and there are more concepts in play in software than just
units of modularization.  Thus, we should reduce the number of concepts, which may in turn reduce the number of
classes.

## Conceptual Overhead Creates Confusion and Complexity

To understand what code will actually do, we need to understand not only the domain, but also all of the concepts involved in that code (for example, our standard deviation code, you must understand assignment, addition, multiplication, `for` loops, and array lengths).  It stands to reason that the more concepts exist in a design, the harder that design will be to understand.

I've [written before][inclusive] about [conceptual overhead][timeline], and a nice side effect of reducing the
number of concepts in a system is that you increase the number of people who can understand the system.  This, then, increases the number of people who can make changes to the system.  Certainly, a software design that can be safely modified by a large group of people is better than one that can only be modified by fewer.<a name="back-1"></a><sup><a href="#1">1</a></sup>.

Reducing conceptual overhead will naturally reduce the number of abstractions *and* make it easier to understand
behavior. I'm not saying “never introduce a new concept”, but rather saying that there is a cost to doing so, and
if that cost outweighs the gains, the introduction of that concept should be questioned.

When we write code or design software, we have to stop thinking about _elegance_, _beauty_, or any other
subjective measure of code we might like to apply.  Rather, we have to constantly remember what we are planning to
do with the software.

## You Don't Hang Code on a Wall—You Change It

Code isn't art that you print out and put in a museum.  Code is executed.  It is observed and debugged.  And, most
importantly, it is _changed_.  A lot.  Any design that makes these things hard to do should be questioned and
revised.  Any design that reduces the number of people that can do these things should *also* be questioned.

Code has to work, thus it should be tested.  Code has bugs, and will need new features, thus we must understand
its behavior.  Code lives longer than a given programmer's tenure to maintain it, thus we want it to be widely
comprehensible.

As you write code or design your system, ask yourself if you are making it easier to prove the behavior of the
system?  Are you making it easier to understand what it will do?  Are you focused on solving the problem in front
of you, or a more abstract one?

Always err on the side of making behavior easier to demonstrate, predict, and understand, and keep the number of
concepts to an absolute minimum.



----

<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>This is why I think hardcore functional programming is not going to ever become mainstream—it requires
deeply understanding many highly abstract concepts.<a href='#back-1'>↩</a>
</li>
</ol></footer>

[timeline]: https://naildrivin5.com/blog/2019/06/29/simple-expressions-only.html
[inclusive]: http://naildrivin5.com/blog/2018/02/02/explicit-code-is-inclusive.html
[xpbook]: https://www.amazon.com/gp/product/0201616416
[fowler]: https://martinfowler.com/bliki/BeckDesignRules.html
