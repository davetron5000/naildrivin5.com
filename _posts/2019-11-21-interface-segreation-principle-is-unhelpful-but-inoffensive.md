---
layout: post
title: "Interface Segregation Principle is Unhelpful but Inoffensive (SOLID is not solid)"
date: 2019-11-21 10:30
ad:
  title: "Want a Hotter Take?"
  subtitle: "Put On Your Oven Mitt"
  link: "http://bit.ly/buy-not-solid"
  image: "/images/not-solid-cover.png"
  cta: "Buy Now $5.99"
related:
  - "SOLID Is Not Solid - Examining the Single Responsibility Principle"
  - "Four Better Rules for Software Design"
  - "What is 'better' code?"
  - "The Open/Close Principle is Confusing and, well, Wrong (SOLID is not solid)"
  - "Liskov Substitution Principle is…Not a Design Principle (SOLID is not solid)"
---
As mentioned in the [original post][original], I'm realizing that the [SOLID][solid] principles are not as…solid
as it would seem.  In [that post][original], I outlined the problems I see with the Single Responsibility
Principle, and in the [second][open-closed], I recommended ignoring the Open/Closed Principle, since it is 
confusing and most reasonable interpretations give bad advice.  In the [third post][liskov], I talk about how the Liskov Substitution Principle is too narrowly focused on the wrong problem, and doesn't really give usable design guidance.

Now, I want to talk about the Interface Segregation Principle, which prescribes are very strange solution to the
problem of coupling, and the reality is, we should just be talking directly about coupling *and* cohesion and be
very careful about over-optimizing for one or the other.

[original]: /blog/2019/11/11/solid-is-not-solid-rexamining-the-single-responsibility-principle.html
[open-closed]: /blog/2019/11/14/open-closed-principle-is-confusing-and-well-wrong.html
[solid]: https://en.wikipedia.org/wiki/SOLID
[liskov]: /blog/2019/11/18/liskov-substitution-principle-is-not-a-design-principle.html

<!-- more -->

The [Wikipedia article](https://en.wikipedia.org/wiki/Interface_segregation_principle) states

> [Interface Segregation Principle (ISP)] splits interfaces that are very large into smaller and more specific ones so that clients will only have to know about the methods that are of interest to them…ISP is intended to keep a system decoupled and thus easier to refactor, change, and redeploy.

*This* seems quite reasonable, however the principle as stated says that "**no client** should be **forced** to depend on methods it does not use" (emphasis mine).

First, let's just state that a dynamic language like Ruby automatically complies with this principle because the
definition of what a client depends on is what it uses.  Ruby doesn't define types and so as long as the object
you pass into a routine responds to the methods that routine calls, the code "works"<a
href="#1"><sup>1</sup></a><a name="back-1"></a>.

So for people working in a dynamic language like JS or Ruby, this principle is wholly pointless as stated.

That said, the Wikipedia details present a different problem and solution, namely that your classes should not
have too many methods in them.  This gets at cohesion, which [we talked about][original], but it also starts to
get at another core concept: _coupling_.

## Perhaps, perhaps, perhaps…it's actually about coupling
  
[Coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) is:

> …the degree of interdependence between software modules; a measure of how closely connected two routines or modules are…

It's usually accepted that tightly coupled code—code that has lots of interdependencies—is worse than loosely
coupled code.  Wikipedia outlines the disadvantages with tightly-coupled code:

> * A change in one module usually forces a ripple effect of changes in other modules.
> * Assembly of modules might require more effort and/or time due to the increased inter-module dependency.
> * A particular module might be harder to reuse and/or test because dependent modules must be included.

These are all fair points, however there is a tradeoff with taking this to the extremes that the principle would
have us do.  De-coupled *systems* can be hard to understand, even if their individual parts are simpler.  Tightly coupled bits of code that are *cohesive* can be much simpler to understand than de-coupled code.

In fact, coupling is almost always mentioned with cohesion, because there is a tension there.  You want your code
to be de-coupled, but also cohesive.  You can't have it both ways—there is a balance to be struck, and advice
to "always decouple" is not going to find that balance.

## Design is About Balancing Cohesion and Coupling <span class="h3">(not blindly following principles)</span>

Let's take an example and see how over-emphasizing de-coupling can lead to a poor design.  Consider a class to access data about widgets in our database:

```java
public class WidgetRepository { 
  public Set<Widget> find(String query) {
    // ...
  }

  public Widget load(int id) {
    // ...
  }

  public void save(Widget w) {
    // ...
  }
}
```

This interface has a lot of cohesion—finding, loading, and saving widgets go together pretty well.  However, any
class that depends on `WidgetRepository` yet only calls some of these methods is technically being "forced to
depend on methods it does not use".

A solution—and I have seen this in real life applied to a real project—is to make every method its own interface:

```java
public interface WidgetLoader {
  pulbic Widget load(int id);
}
public interface WidgetSaver {
  public void save(Widget widget);
}
public interface WidgetFinder {
  public Set<Widget> find(String query);
}

public class WidgetRepository implements 
    WidgetLoader,
    WidgetSaver,
    WidgetFinder { 

    // ...
}
```

This is, in every way, compliant with the Interface Segregation Principle as stated. No client is required to
depend on a method it does not use. If you just need to call `find`, you depend on a `WidgetFinder`. If you need
to also call `save`, you depend on a `WidgetSaver`, too.

<div data-ad></div>

This is not a good design, especially applied broadly to your project (which the principle says you should do!).
This would create an explosion of naming, and tons of objects with no cohesive concepts.  But we will have
decoupled and avoided violating a SOLID principle!

That said, the interface is a lens through which we can evaluate coupling and cohesion, so let's see that.

## Interfaces Tell the Story of Coupling and Cohesion

Suppose we have a need to re-order all widgets where our supplies are running low.  The logic for this is to query the database for all widgets with a quantity less than 10, and then make an API call to our fulfillment provider.

Let's say we add this to our `WidgetRepository`:

```java
public class WidgetRepository { 
  public void reOrderWidgets() {
    for (Widget w: this.find("quantity < 10")) {
      // call the fulfillment API
    }
  }

  public Set<Widget> find(String query) {
    // ...
  }

  public Widget load(int id) {
    // ...
  }

  public void save(Widget w) {
    // ...
  }
}
```

This doesn't seem ideal.  Re-ordering widgets doesn't have as much to do with accessing the database of widgets,
so our interface is less cohesive.  It also means that any user of a `WidgetRepository` now has access to reorder
widgets and this is a form of coupling we don't want.  It's hard to be precise about *why* we don't want this, but
a way to think about it is cohesion and coupling.

The `reOrderWidgets` method reduces the cohesion of the `WidgetRepository`'s interface, and it increases the
coupling of concepts in the system. Clients that just want to access the widgets database now also are coupled to
the re-ordering logic.

Maybe we are OK with this.  But maybe we aren't. We now have a way to discuss the actual impact of this proposed
change.  And supposing we are *not* OK with this, we don't want to just segregate the interface. We want to make a
totally different class:

```java
class WidgetReOrdering {
  private WidgetRepository widgetRepository;

  public WidgetReOrdering(WidgetRepository widgetRepository) {
    this.widgetRepository = widgetRepository;
  }

  public void reOrderWidgets() {
    for (Widget w: this.widgetRepository.find("quantity < 10")) {
      // call the fulfillment API
    }
  }
}
```

Although our solution was to segregate the interface and implementation, it's hard for me to see how the Interface
Segregation Principle as stated really helped.  Instead, we avoided a troubling design by talking directly about
cohesion and coupling. Importantly, the coupling we were concerned about was conceptual, not code. If our
`WidgetRepository` needed a new method to delete widgets, that would've increased coupling of code, but not of
concept.

*This* is the way to approach design. Reducing coupling at all costs is not the right way.

My advice: **segregating interfaces is a technique to reduce coupling and increase cohesion, however it can also
reduce cohesion if carried to the extreme.  Don't always do it. Focus on balancing the cohesion and coupling in
your system.**

Now we come to the last principle, the Dependency Inversion Principle.

<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>Of course, you could also say a language like Ruby makes it <strong>impossible</strong> to comply
because in Ruby you can call any method you want any time, including private methods and instance variables.
Conclusion is still that it's useless for Rubyists.<a href='#back-1'>↩</a>
</li>
</ol>
</footer>
