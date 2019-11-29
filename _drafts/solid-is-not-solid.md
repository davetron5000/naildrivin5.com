---
layout: post
title: "SOLID Is Not Solid"
date: 2019-10-13 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta:"Buy Now $25"
---

The SOLID principles are a very commonly referred-to set of guiding principles for doing good object-oriented
design. I have previously sworn by them and seen other developers do the same.  I have observed many designs
that are done in particular way because SOLID said to. While it is a common refrain that these principles are
just guidelines, and that there is nuance, and you should only apply them when you need them, I find this
wanting. 

A _principle_ is not a guideline or a pattern. What a principle is has a very
specific meaning:

> [a principle is a ] fundamental truth or proposition that serves as the foundation for a system of belief or behavior or for a chain of reasoning.  

To this end, I find the SOLID principles wanting. In some cases, their absolute
adherence can lead to systems that are hard to understand and change, and in
others there is actually no real design guidance at all.

And when I dug into them,reading the formative papers upon which they are based, I find a combination of specious reasoning, occasionally-needed design patterns, and a bit of dogma, all wrapped up in the very real problems of doing object-oriented programming in C++ or Java.

So what I'd like to do is go through each principle, one by one, and talk about what the problems are.  What is
the basis for these prciniples, and is that basis sound?  What solutions do these prinicples drive us toward,
and are those solutions alwayst he best?  Or are the sometimes the best? Or just worthless.

What we'll find, beyond the flimsy assertions and questionable solutions *is* a kernel of truth. These
principles have their hearts in the right place, because designing code (OO or not) is not easy. It's difficult
to know what decisions are better than others.

In my almost 25 years as a professional developer, I have come to realize that pithy principles, rules of thumb,
or other context-free protestations can lead people down the wrong path if they don't understand the underlying
reasoning.  My feelings are that we should be talking about those reasons and why they are important, and
we should talk about them in the context of the code and the application and the system and the product and the
users.

There is just so much context that a principle cannot account for, that to drive our discussions of design
around these principles seems misguided at best, and dangerous at worst.

What you will learn is partly that these SOLID principles aren't really that solid to start with, but I hope
you'll also learn a bit of critical  thinking, and feel emboldened to question authority and seek the truth and
reality behind what you hear and are told.

Unfortunately, much of the source material where these principles were developed is not online.  Some of it is
available in the Internet Archive, and that is where I've referenced much of the material.  Reading this source
material adds a ton of context to where these things came from, because their principle author was working a lot
in C++ (and later Java), and if you have used these languages, they do not conform to several norms of what
object-oriented is.  And you begin to see these patterns as defense mechanisms against the constraints of those
languages.

As patterns, some of what is layed out in SOLID *are* useful. But patterns and principles are not the same
thing.


## A Note on Robert C Martin

Much of the work around SOLID came from Robert C Martin AKA Uncle Bob.  He has been prolific in the world of
software engineering, object-oriented design, and agile software development. There is no denying that he has
shaped many things that those of us that came after him take for granted.

This does not mean that his ideas are beyond criticism, and it also does not mean we must hold him in any
particular regard.  In fact, appeals to authority are highly dangerous in my view, and since I am in every way
less of an authority on this subject than Martin, the existence of this criticism should demonstrate this.
Either you are persuaded by my arguments, or you are not.  But just because Uncle Bob said something does not
make it inherently correct.

I would be remiss in not stating that I am aware of much of Martin's Twitter postings unrelated to technology
and am aware of many of his talks and their contents. For me, they paint a picture of someone who says things in
conflict with my personal values. I won't tell you how to feel and in the spirit of appealing to evidence,
reason, and reality, I would encourage you to form your own opinion. To be clear, whatever your opinion is, I'm
not interested in it, and no matter how awful you think he is, or how great you think he might be, it has no
bearing on the contents of this book.

If you are an Uncle Bob fan, I'd ask you to set that aside and join me as we critically examine some of his work
that has been quite prolific.  The remainder of this book will be quite technical and will not have anything to
say about Martin's twitter stream or conference talks.  If you have feelings the other way-as I do-I'd ask that you do the same, because there are kernels of wisdom in this that we shouldn't be blind to.

With that out of the way, let's tear open the first SOLID principle, the Single Responsibility Principle and see
what it's all about.

## Infantilisng Agilisms That Lead Us Astray

A theme running across my criticism of the SOLID principles is that, as written, they are unclear, vague, and open to potentially dangerous interpretations. It would be better for everyone if the advice they claim to impart was just stated clearly.

But they have *nothing* on some of the other slogans used in the agile community. Let's learn more.

### KISS - Sorry, but I'm not stupid

"KISS" is often used when code is complex.  KISS stands for Keep It Simple Stupid.  You know what? I'm not stupid.  I'm just not. And neither are you. I don't need to be insulted in order to discuss code. Maybe you think it should be "Keep It Simple Silly", but I don't think it's silly to overcomplicate code.  It is, in fact, normal.

KISS is trying to tell us a good thing - keep your solutions simple.  And we often need to be reminded of this when thinking through solutions or writing code. And you know what? I don't think calling me stupid is the best way to do that.

I also don't think it's too hard to just say "Keep it simple" or "don't build software to solve problems you don't have" or "build for only what you need".  Sure, they don't create nice acronyms in English that we can scream at junior developers who are just trying their best, but if we just said directly what we mean and explain why, wouldn't that be better than calling everyone stupid?

### YAGNI - You Aren't Gonna Need It

You know what, Ron Jeffries (who coined the phrase)? You don't know what I need, do you?  And if you *did* know what I need, maybe talk about that instead of sloganizing me and shaming me?

Like KISS, YAGNI's heart is in the right place.  It says to not build things you don't need, or to not solve problems you don't have.  This is the same lesson taught to us by KISS.  Talk about not repeating yourself.

YAGNI is pernicious, because the words as written can't be properly understood without a ton of context.  Most developers lack this context, so they use YAGNI to excuse a lack of tests, lack of writing log statements, not improving variable names when writing code, writing messy code, etc.

As with KISS, it is far more useful to talk plainly about the issue, which is if you build software to meet needs you don't have, that software will have a carrying cost that might make it harder to add features or fix bugs later, and it is unlikely to save time in the future.  Thus, building for things you don't know you need is not a good tradeoff.

### DRY - Don't Repeat Yourself

These three words on their own are pretty terrible advice. It is super normal to repeat yourself when explaining something.  People don't necessarily hear you, or they don't understand something the way it's written, or it doesn't make sense the first time.  Repeating ourselves helps us explain ourselves.  Repetition is also a tool for mastery. Repetition is how we gain experience.

Of course, this isn't exactly what the authors of the Pragmatic Programmer meant when they put this in the book.  As with YAGNI, more context is needed.  But even that context is suspect.  That DRY principle states:

> Every piece of knowledge must have a single, unambiguous, authoritative representation within a system

Depending on how we interpret this phrase, it could mean different things.  Most programmers interpret this to mean "don't duplicate anything".  If we follow that to the letter of the law, we can't have caching.

Often developers will point at code that uses literal values and say "DRY this up", as if the value of `0` is going to change and thus must be abstracted into a constant called `ZERO`.

What's really going on with DRY is that you should avoid situations where you have to make the same change multiple times.  However even this can lead to problematic outcomes, because our test code often must duplicate some logic in some way as our real code. Often, if we "DRY up" our test code, we are left with tests woefully coupled to the code they are testing, which can result in tests that don't break when the code under test has a bug.

Instead of yelling "DRY" in a code review, we should be talking about the cost of a particular duplication and being clear that it is.  For example, when thinking about data in a database, there should be a single authoritative representation of a fact in the system, but there can be (and often must be) several non-authoritative representations i.e. caches.  That is duplication.  That is a form of "repeating yourself", but it is necessary.

### The Simplest Thing That Could Possibly Work

You know, I've had a lot of jobs as a programmer over my 24 years of Experience, and in all of those jobs, it was expected that I make—or try to make—software that *actually did* work. If I had turned in code and say "it's possible that this could work", I would've not lasted too long.

Again, the specific words of this phrase lead us astray.  We should be trying to write software that actually does work, and setting that part of this aside, we are left with "simple", and thus we have a *third* agile maxim telling us to keep our code simple and to not solve problems we don't have.  Perhaps of the progenitors of XP had just said this directly, we wouldn't have wound ourselves around *three* silly acronyms that don't provide real guidance.

### User Stories

What is a "story"?  According to the dictionary, it is:

> an account of imaginary or real people and events told for entertainment.

That does not sound like the basis for breaking down the requirements of a software system to me.  So already we are off on the wrong foot here, but the phrase "user story" has a quite murky definition.

The coiner of the phrase defines it as a "promise for a conversation".  Uh, ok? More conventionally, a user story is something written down about how the software should work, from the perspective of the user.

Being user-focused is a good thing, and coercing requirements to be written from a user's perspective makes sense.  But we are not children attending grade school who must be coddled into doing our jobs, nor are the people asking us to write software.  In fact,we are all adults and professionals.

I'm actually not sure why we can't just saying "user requirements".  The barest interpretation of this phrase is "stuff that the user requires of the software", and that *is* what we are trying to suss out, right?

A secondary goal of user stories is to encourage developers to break down complex requirements into small, shippable units that can be demonstrated.  The reality of software is that users don't exactly know what they want until they have something to react to.  So the way user stories are defined encourages that.

But again, why must we mis-use language and be overly cute and dance around the point?  Is it *really* so hard to explain it directly? "Let's break this feature down into small, shippable chunks we can demonstrate because then we can get feedback quickly about how well we're doing"

If you've been on an agile project, you have no doubt wasted a sizeable chunk of your life debating what is a "story" and what is a "task" and what is a "chore" and on and on.  This is telling you that the language we've chosen to adopt is failing us.

Would it not be simpler to call each and every thing a developer does a "task"? A "task" is "a piece of work to be done". Simple, right?  Aren't we all about simple? 

And how do we figure out the tasks?  We write down what the requirements are in plain language, and try to ship some of that.  Calling those "user stories" and fitting them to a template isn't exactly helping.  We really do have to think it through, and no cutesy language is going to keep us from having to do that.  And no templates will make us magically good at it when we otherwise aren't.  We have to do it.  We have to repeat ourselves, right?

























----

Been thinking about the SOLID principals and I don't think they are actually
that solid; I don't think they represent necessarily good advice and I think following them can have some
unintended consequences.  Part of the reason is that some of them are stated so unclearly that it becomes hard
to even know if the principal is being adhered to, but some or just, well, wrong.


<!-- more -->

As a review, SOLID principles are:

* *S*ingle responsibility principle
* *O*pen-closed principle
* *L*iskov Substitution Principle
* *I*nterface Segregation Principle
* *D*ependency Inversion Principle

Let's talk about each one and what the problems are.

## Single Responsibility Principle

Wikipedia states that "A class should only have a single responsibility, that is, only changes to one of the
software's specifications should be able to affect the specification of the class"

This is full of ambiguous concepts.  What is a "specification"? What if there isn't one? 
What about stuff in my software that isn't a class?  What is the unit of "thing" that should have only one
responsibility?

It does feel good to think about a bit of code having only one job, but it's actually quite difficult to agree
on what a "job" even is.  Consider this Rails controller:

```ruby
class WidgetsController < ApplicationController
  def create
    @widget = Widget.create(widget_params)
    if @widget.valid?
      redirect_to :index
    else
      render :new
    end
  end
end
```

This is a very vanilla implementation that saves a new widget to the database if it's valid, and if it's not, it
sends the user back to the form to fix the validation problems.

Sounds like this class has more than one job, right?  You might think "well, the job of this class is to save
new widgets", but it definitely does more. It routes the user through the application, too.  So it doesn't seem
to have a single job, but it also seems like there's nothing wrong with this class.

Suppose now that we need to send an email whenever a widget is created and we choose to add that code to the
controller:

```ruby
class WidgetsController < ApplicationController
  def create
    @widget = Widget.create(widget_params)
    if @widget.valid?
      WidgetMailer.notify_on_new_widget(@widget)
      redirect_to :index
    else
      render :new
    end
  end
end
```

Even if the previous version had only one responsibility, this new one *definitely* has a new responsibility. Is
this a problem?  Not obviously, no.

So what do we make of this Single Responsibility Principle?   It seems fairly difficult to apply in a general
way.  We could say that the above code "violates" this principle, but there's nothing wrong with the above code.

That said, The Single Responsibility Principle *is* trying to address a real problem, namely having classes,
functions, modules, etc. that do too much.  It's just pretty hard to say what that is in a general way.

And why, exactly, *is it* a bad thing when code does "too much"?  It can make the code hard to read, hard to test, hard to change, etc.  But these concepts are similarly fraught with ambiguity.  What is "hard" in this
context?  It probably depends on who is trying to read, test, or change the code as much as the code itself.

Ultimately, I think it's better to speak about a specific bit of code and what is problematic about that.  It's
likely going to produce a better outcome if everyone discusses the code itself and not what the Single
Responsibility Principle actually means or how to apply it.

Next is the most confusing of the SOLID principles: the Open/Closed Principle.

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
