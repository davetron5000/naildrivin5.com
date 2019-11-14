---
layout: post
title: "SOLID Is Not Solid - Examining the Single Responsibility Principle"
date: 2019-11-11 10:30
ad:
  title: "Get Things Done"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "Four Better Rules for Software Design"
  - "What is 'better' code?"
  - "The Open/Close Principle is Confusing and, well, Wrong (SOLID is not solid)"
---
Been thinking about the SOLID principles recently, and I'm questioning their usefulness.  They are vague, over-reaching,
confusing and, in some cases, totally wrong.  But they come from the right place.  The problem is that they attempt to
reduce nuanced concepts into pithy statements and lose a ton of the value in translation.  This sends programmers down the wrong path (it certainly did for me).

As a review, the [SOLID](https://en.wikipedia.org/wiki/SOLID) principles are:

* Single Responsibility Principle
* Open/Closed Principle
* Liskov Substitution Principle
* Interface Segregation Principle
* Dependency Inversion Principle

In this article, I'm going to pick apart the Single Responsibility Principle, and in four subsequent posts tackle the other
principles.

<!-- more -->

## Single Responsibility Principle

[Wikipedia states](https://en.wikipedia.org/wiki/Single_responsibility_principle) that

> A class should only have a single responsibility, that is, only changes to one of the software's specifications should be able to affect the specification of the class

This is fairly ambiguous.  What is a "specification"?  I've never worked on a piece of software that had one in 23 years.  And
what does "affect" mean here?

The Wikipedia article clarifies in the Example section (emphasis theirs):

> Martin [Robert Martin<a name="back-1"><a href="#1"><sup>1</sup></a></a> who coined the term] defines a responsibility as a <span style="font-style: normal">reason to change</span>

This only raises further questions, because *all* code has at least *two* reasons to change - to fix a bug or add a feature.  So if those aren't considered separate reasons, then what is a "reason"?

This ambiguity makes code reviews where the Single Responsibility Principle gets invoked quite muddy, as everyone starts
talking about how to interpret the principle and not the quality of the code under review.

That said, it does *feel* right that code should only have one job/thing/responsibility.  Consider this Rails controller:

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

  def widget_params
    params.require(:widget).permit(:name, :price)
  end
end
```

<div data-ad></div>

This is a very vanilla implementation that saves a new widget to the database if it's valid, and if it's not, it
sends the user back to the form to fix the validation problems.


Setting aside the "bug fix and new feature" reasons to change, this class sure sounds like it has lots of reasons to change.  We
might add more params needed to require a widget.  We might decide we need to route the user somewhere else when a widget gets
created.  We may decided that we should send an email to an admin every time a Widget is created.  So clearly this code
violates the Single Responsibility Principle and thus is bad and should be changed. Right?

It's hard to accept that here.  Not only is this code canonical with how Rails encourages you to write code, but it's short, direct, and to the point.  Sure, we could add more code to this controller over time, and over time, the controller might become bigger and more complicated, and some of that might be result of giving it additional responsibilities, but to say that this code should have *exactly one* or it needs changing?  That doesn't make sense.

For science, let's try to change this code to reduce the number of responsibilities it has.

```ruby
class WidgetsController < ApplicationController
  def create
    @widget = WidgetCreator.create(params)
    WidgetRouter.route(self, @widget)
  end
end

class WidgetCreator
  def self.create(params)
    Widget.create(params.require(:widget).permit(:name, :price)
  end
end

class WidgetRouter
  def self.route(controller, widget)
    if widget.valid?
      controller.redirect_to :index
    else
      controller.render :new
    end
  end
end
```

Each class certainly has fewer responsibilities and fewer reasons to change.  But it's hard to see this as an improvement.
Certainly if the way we create widgets become complex, there might be value in having a separate class, or if routing during
creation was subject to a lot of nuanced rules, extracting that could have value, but that's not the case here.  In no way is
this code better.

What this tells is me that the Single Responsibility Principle is not useful as it stands, and if we blindly adhere to it, we might create more problems than we are trying to solve.

That said, the Single Responsibility Principle is coming from the right place.  It's trying to give us direction about
[cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science)), which is the degree to which elements of a module
belong together.  The problem is that cohesion isn't that cut and dried.

## Cohesion

_Cohesion_ is a long-discussed concept in computer science that says that modules (meaning any grouping of code) whose
elements (parts of the code) belong together is more maintainable and easier to understand than modules whose elements don't
belong together.

Like the Single Responsibility Principle, cohesion is vague, but it's not presented as a *principle*, and it's not presented
as an objective measure that must be adhered to.

The lack of a strong prescriptive measure means we can stop counting responsibilities and start talking about the code we have
and the change we want to make to it.  Let's look at two changes to our original controller.  These changes will both violate
the Single Responsibility Principle, because they add responsibilities to the class.  But only one materially affects the
class' cohesion.

In our first example, we add a line of code to send an email every time a widget is created.

```ruby
class WidgetsController < ApplicationController
  def create
    @widget = Widget.create(widget_params)
    if @widget.valid?
      WidgetMailer.widget_created(@widget) # <------
      redirect_to :index
    else
      render :new
    end
  end

  def widget_params
    params.require(:widget).permit(:name, :price)
  end
end
```

Creating a widget and sending an email about it sound like they belong together, so I would argue this change doesn't
materially affect the cohesion of this class<a name="back-2"><a href="#2"><sup>2</sup></a></a>.

Let's look at a different change, where we record database statistics about the table that holds our widgets:

```ruby
class WidgetsController < ApplicationController
  def create
    @widget = Widget.create(widget_params)
    if @widget.valid?
      DatabaseStatistics.object_created(:widget) # <-----
      redirect_to :index
    else
      render :new
    end
  end

  def widget_params
    params.require(:widget).permit(:name, :price)
  end
end
```

The controller has nothing to do with databases, so this change feels like it reduces the cohesion of the class enough for us
to question this change.

Yet in both cases, the Single Responsibility Principle has been violated.  This tells me that framing the concept of cohesion as the Single Responsibility Principle is absolutely wrong.

My advice: **Stop talking about Single Responsibility and start talking about cohesion**.

In the next article, I'll tackle the [Open/Closed Principle][ocpost], which is so confusing as to be utterly useless.

[ocpost]: /blog/2019/11/14/open-closed-principle-is-confusing-and-well-wrong.html#more

---

<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>Robert Martin AKA “Uncle Bob” has made statements online that are inconsistent with my personal values, so I do not follow his work closely and do not hold him in any high regard.  Nevertheless, he has been influential in the world of software and object-oriented design and there is value in criticizing his ideas, since they are taught to many developers.  If you would like to know more about Uncle Bob's online behavior, find him on Twitter.<a href='#back-1'>↩</a>
</li>
<li>
<a name='2'></a>
<sup>2</sup>Also note how this change would've complicated things in our refactored version.  We'd have to add this code to
the <code>WidgetRouter</code>, which should feel very wrong, and thus require a larger refactor to add this one line of code.<a href='#back-2'>↩</a>
</li>
</ol>
</footer>
