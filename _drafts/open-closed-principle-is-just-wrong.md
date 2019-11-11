---
layout: post
title: "The Open/Close Principle is Just Wrong"
date: 2019-10-13 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---

## Open/Closed Principle

The open/closed principle says that software should be "open for extension, but closed for modification".  I
have no idea what this means, and the Wikipedia article doesn't clear it up.

This principle was created by Uncle Bob Martin in a paper he wrote.  In it, he says that classes should be able to be extended, that we can "make the module behave in hew and different ways as the needs of the application change", but that classes should be closed for modification say "the source code...is inviolate. No on is allows to make source code changes".

I honestly don't know what to do with this one.  We certainly need to be able to change source code to fix bugs,
right?  If we can't change code to fix bugs, then we have to delete classes and rewrite them hopefully without
bugs.

We also would *like* to change source code to add features, and the same issue comes up if we can't - we end up
rewriting previously-existing features just to not touch the source code?  That just cannot be right.

Equally odd is the notion that we should design our modules and classes to have some sort of ultimate
flexibility that can allow us to reconfigure them to meet the needs of unknown changes the application will need
in the future.

That is *such* a bad thing to tell software developers to do.  I have personally observed so much waste from
developers (myself included) trying to make flexible, generic classes instead of just solving the problem in
front of them.

Based on this, the Open/Closed Principle should be entirely ignored.  It's stated so vaguely and any reasonable
interpretation leads to the opposite of what you want that I think it's actively harmful, and downright wrong.

Next up is the Liskov Substitution Principle.

## Liksov Substitution Principle

This principle states that "Objects in a program should be replaceable with instances of their subtypes without altering the correctness of the program".

This uses one of my least favorite computer science terms: correctness.  What does that even mean in this
context?  It's exceedingly difficult to talk in real terms about a software system's correctness. Sometimes,
that means "type checks", other times it can mean "no bugs", but even defining what a bug is requires an
unambiguous specification, which is almost always absent in most systems.

The Wikipedia article attempts to elaborate, stating that the replacement of one object for another should not
alter any "desirable properties", an example of which is "task performed".

Again, what is a "task" and what does it mean to be "performed" is highly ambiguous in a real system.  You've
probably read about the strategy pattern, where you externalize a computation so that you can provide different
implementations of that same computation.  For example, you might be sorting through a list of items and you
have one implementation that does it quickly using a lot of memory and another that does it slow, but uses less
memory.

From a certain point of view, both of these implementations perform the same task and thus adhere to the Liksov
Substitution Principle.  But from a different point of view, they are totally different - one uses a lot of
memory and the other doesn't; one is fast, the other isn't.  Those are behaviors of the system that matter.
From this point of view, swapping sort implementations violates the Liskov Substitution Principle, because
desirable properties such as speed and memory usage are changed.

It's possible that what is meant here is that you should program to interfaces or contracts.  I'm not sure I
agree with that, but it *is* a technique to allow substituting one bit of code for another.  And externalizing
bits of code *does* allow you to simplify your tests.

But it's hard to wrap this up into a pithy principle, and I think the Liskov Substitution Principle does not
lead us toward any obviously good advice, instead leading us into more ambiguity.  And this means teams will be
debating the principle and what it means instead of the code.  I can't see how that's a desirable thing.

Next up, the Interface Segregation Principle

## Interface Segregation Principle

The Wikipedia article states that "no client should be forced to depend on
methods it does not use".  It is intended to keep parts of the system decoupled.
This seems pretty reasonable, however the strength of this statement is a bit
questionable.

Consider a class that has two methods, and you pass an instance of this class to
another method, and *that* method doesn't need both methods.  It seems you have
"forced the class to depend on a method it does not use".

I have seen Enterprise Java systems that "solved" this by creating a ton of
interfaces, each having only one method.

```java
public interface Loader {
  public Object load(int id);
}

public interface Saver {
  public void save(Object)
}

public class Widget implements Loader, Saver {
  public Object load(int id) {
    // ...
  }

  public void save(Object) {
    // ...
  }
}
```

And then you use it like so:

```java
public void saveObjects(Saver s, Object[] objects) {
  // ...
}
```

It's hard to see code like this as a benefit.  An obvious downside is that you have an explosion of naming to
deal with.  Each method must be placed into a well-defined interface that has a good name.  That is super hard
to achieve (and it's not lost on me that in a functional language you don't have classes so you have to solve
this problem).

More problematic is how much code like this ossifies decisions and makes changes more difficult.  Suppose
`saveObjects` needs to change and now must call `load`?  That is a pretty big refactor.  If, instead,
`saveObjects` depended on `Widget` directly, it could change more easily.

Guessing the sorts of changes you might need *is* problematic, but it *is* possible to know the sorts of changes
that might be more or less likely, and so a principle that requires you to ossify the current thinking into code
at the expense of making future changes more difficult does not sound like a good principle.

Granted, it is good to make decoupled systems, but to continue the refrain of this post, it seems much better to
look at the code in question and talk about how decoupled it is and how decoupled it should be, rather than
reducing that discussion to an oversimplification of "code should not depend on methods it doesn't use".

Now we come to the last principle, the Dependency Inversion Principle.

## Dependency Inversion Principle

The summary states that code should depend on abstractions, not concretions. The
Wikipedia article further states that modules are either "high level" or "low
level" and that abstractions should not depend on details.

All of this is super vague.  Bucketing code into "high level" and "low level" is
a gross oversimplification, and urging developers to "depend on abstractions" makes
the implicit case that abstractions should be created, and as discussed above,
this is not usually a good idea, because you end up creating generic flexible
code that you don't need.

That said, there is something to do this. For example, you don't want your
database code depending on your controllers.  So there is a need to be clear in
the application architecture what is supposed to depend on what, but I don't
think you need a "principle" to guide this sort of design, and it certainly shouldn't require that you abstract
details at ever corner.

Developers will be more effective if we instead talk about why certain parts of the application should (or
should not) depend on others.  Talk about  why, in your application, database code should not call methods on
the controllers. Talk about why the view layer should not make database calls directly.

There is a somewhat practical matter to this with respect to, at least, the Java programming language.

When a class in Java depends on other classes, it can become hard to test.  For example, if your Java class
makes HTTP calls, it's difficult to write a test for that code because you end up making HTTP calls which you
might not want to do.

In a dynamic language like Ruby, you can simply mock the classes that make HTTP calls, because classes in Ruby
are objects, and you can simply change any objects' behavior whenever you want.

Java does not allow this, so to deal with this limitation, you write your code to depend on an interface for making HTTP calls, and you provide the code with an implementation at runtime.  At test time, you provide a mocked implementation.

```java
public interface HttpService {
  public String get(String url);
}

public class MyService {
  private HttpService httpService;

  public void doSomething() {
    String result = this.httpService.get("/foo");
    // do something with result
  }

  public void setHttpService(HttpService httpService) {
    this.httpService = httpService;
  }
}

public class RealHttpService impelments HttpService {
  public String get(String url) {
    // real implementation
  }
}
```

The Dependency Inversion Principle wants you to always write code like this.

And it can feel very appealing to do so, because it feels good to have that clean separation of `MyService` and
"however we make HTTP calls".  It feels good for `MyService` to not have to care about how HTTP calls are made.

But in reality, `MyService` will only ever be used with a single, real implementation of the `HttpService`
interface.  There is no actual need for flexibility, and it obfuscates the code's actual behavior by introducing
it.  *And*, you create a situation where you have tested code that will behave differently in production than in
your test.

It's very hard to see that this is desirable.  I understand that it can be hard to test code that is coupled in
this way, but it's not a definitely always good choice to inject every single dependency behind an interface.

And focusing on something called a "principle" encourages that bad behavior.
being simpler to talk about how coupled the system is and how coupled it should be, rather than trying to
interpret a vague principle.

## Conclusion

So where does this leave us?  I think it leaves us in a pretty honest, if uncomfortable place.  Software design
is difficult, and highly dependent on context.  Broad, vague, "principles" to drive good design just aren't
realistic and can create churn, confusion, or bad behavior when applied.  I think it's much better to simply
talk about *what* software is supposed to do, how well it does (in real terms), and how to keep it that way.

<div data-ad></div>

Yet more content 
