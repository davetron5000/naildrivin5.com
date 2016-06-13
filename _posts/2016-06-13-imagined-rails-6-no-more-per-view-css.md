---
layout: post
title: "Imagined Rails 6: No More Per-View CSS"
date: 2016-06-13
publish: false
---

This is a series of posts about [why I recommended the changes I did for Rails 6][rails6-why-intro], in my [imagined keynote
for Rails 6][rails6post].

In this one, we'll explore why I recommended the removal of per-view CSS and the inclusion of an "OOCSS"-style framework.

<!-- more -->

When you create a new resource/controller/scaffold with Rails, say one called “widgets”, Rails creates a lot of files.  One of them is `widgets.css` and, because of how the asset pipeline works, this file is included in the CSS bundle.

This gives a very false sense of encapsulation.  In no way are the CSS classes in that file encapsulated and in no way are they applied only to “widgets”.  This is unlike the Ruby artifacts the generator produces, which *do* have encapsulation: the methods in `WidgetsControllers` are not global to all of your app, nor are the methods in `Widget`.  Even the stuff in `WidgetsHelper` isn't global.

There are ways to do modular CSS.  They are nasty, but Rails could bake in support for them if it truly believed that modular CSS was the way developers should be working.

Modular CSS isn't quite the state of the art, though perhaps it will be some day.  Instead, many front-end developers are using something called "Object-Oriented CSS" or OOCSS.  While the technique has nothing to do with objects and bears no resemblance to "object-oriented programming", this is the term that's been adopted.  And, it's a vast depature from what many of us learned about how write CSS.

Instead of creating single classes per thing-you-want-to-style and then adding CSS to that class, you create single-purpose re-usable classes and apply them to your HTML.  Let me demonstrate.

Suppose we are styling the `widgets/show.html.erb` template.  We know that it will show the widget's name as the most important thing on the page outside of the general application layout.  That's enough to write some HTML.

```erb
<article>
  <h1><%= @widget.name %></h1>
</article>
```

Since we'll consider this content "self-contained", we use `article`, and the correct tag for the most important header in an `article` is an `h1`, so we use that for the widget's name.

Note that this completely describes the semantics of our content.  No additional markup is needed.

Now, suppose our designer (which is a role—we could be the designer, too) wants this displayed in bold, all uppercase, and using the second-biggest font in our [type scale](http://alistapart.com/article/more-meaningful-typography).

In "semantic" CSS (the type I'm discouraging in this post), we give our `h1` a single class, like so:

```erb
<article>
  <h1 class="widget-name"><%= @widget.name %></h1>
</article>
```

We then use that class to attach our needed styles:

```css
.widget-name {
  font-size:     $font-size-2;
  font-weight:    bold;
  text-transform: uppercase;
}
```

Note again that the addition of the `widget-name` class adds no semantics not already present in the original HTML.  It merely exists for us to use a hook for styling.  If we didn't need to style it, we would have no reason to add that class.

In OOCSS, we work in the opposite direction.  We start from a set of small, re-usable classes that we can apply and use anywhere.  So, we'd have CSS like so:

```css
.f1 { font-size: $font-size-1; }
.f2 { font-size: $font-size-2; }
.f3 { font-size: $font-size-3; }

.fwb { font-weight: bold; }

.ttu { text-transform: uppercase; }
```

With these re-usable classes, we can then style our widget header like so:

```erb
<article>
  <h1 class="f2 fwb ttu"><%= @widget.name %></h1>
</article>
```

Since our original HTML contains sufficient semantics for the content, these display-specific classes have no effect on the semantics of our markup.  Remember, we have no reason to add classes to this markup in order to clarify the semanatics.  The only reason we would ever have to add classes to this markup is to afford visual styling.

I know what you're thinking.  This is weird.  It's wrong!  We're mixing presentation and content!  This will not stand!

I had the same reactions. But, this way of styling markup is better than the "semantic" way we've all learned.
I've been working this wawy for over three years and have *very* rarely had to actually write any CSS, and have very rarely become confused about why my pages were laying out the way they were.

You may think that in a sizeable app, you'd end up duplicating a lot of classes.  For example, what if all of our headers were to be bold, upper-case, and set in the second-largest font?  Wouldn't we have `f2 fwb ttu` littered everywhere?

Don't forget: Rails includes a powerful templating framework that supports partials.  You can easily remove duplication by ust using that.

Further, because this type of styling doesn't use the cascade, it's always very clear why an element is being rendered in the browser a certain way and what the application of these classes will do to an element. Once you learn the terse classnames, you can look at any element and see immediately what the intention is for how it is to be displayed.

This is a deep topic and you should read [this post by Adam Morse](http://mrmrs.io/writing/2016/03/24/scalable-css/) and/or [this post by Nicolas Gallagher](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/).  If you have any feelings or opinions about what I've written here, you need to read these posts first.  And then take your issue up with their authors.  I'm just the messenger.

And the message is this:  writing CSS this way is awesome.  It's empowering.  It reduces the decisions you must make down to only those about your design and not how to structure your CSS.  It is very much the Rails Way.

I specified [Tachyons](http://tachyons.io) as it is a small full-featured framework that allows you to work this way.  You could also use [BassCSS](http://www.basscss.com/).  If Rails should include CSS and have an opinion on how to write it, either of these frameworks would be great.

If, on the other hand, Rails doesn't believe in having an opinion on CSS, it should not create blank `.css` files that imply encapsulation which doesn't exist nor should it include SAAS.


[rails6-why-intro]: http://naildrivin5.com/blog/2016/06/12/why-did-i-recommend-XX-for-rails-6.html
[rails6post]: http://naildrivin5.com/blog/2016/05/17/announcing-rails-6-an-imagined-roadmap.html
