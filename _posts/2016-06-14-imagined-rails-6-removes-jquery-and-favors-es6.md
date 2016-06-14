---
layout: post
title: "Imagined Rails 6: Out with JQuery, in With ES6"
date: 2016-06-14
publish: false
---

This is a series of posts about [why I recommended the changes I did for Rails 6][rails6-why-intro], in my [imagined keynote
for Rails 6][rails6post].

In this one, we'll explore why I recommended the removal of jQuery, and the change from CoffeeScript to ES6.

<!-- more -->

## ES6 is Where It's At

I see the appeal of CoffeeScript.  I advocated hard for it on my team and we have a lot of code using it.  JavaScript ES5 is a very verbose language, wrought with easy-to-make errors.  CoffeeScript takes a lot of the pain away.  But, so does ES6. 

ES6 has the virtue of being somewhat standard and supportable in modern browsers without compiling down to ES5, but it compiles down to ES5 just fine.  It's the state of the art.  The reasons to use CoffeeScript all apply to ES6, but ES6 is more standard and has support for modules.  CoffeeScript (and the Rails asset pipeline) do not support modules in any direct way.

Modules in JavaScript are roughly equivalent to Ruby classes or perhaps gems, depending on how much you put in them.

Currently, Rails produces per-view CoffeeScript files similar to what it does with CSS.  So, for a widgets resource, we get `widgets.coffee`.  This does not create any artifact in JavaScript code related to widgets.  Similar to the sibling `.css` file, these files are compiled into one `application.js` at runtime and included *and executed* on every single page, not just the widgets pages.

Since it's run on every page, you have to be careful that any code that's executed and grabs DOM elements does so in a way that doesn't inadvertenly grab slimilar DOM elements that might exist elsewhere in your application.  The bigger your app gets, the harder it is to be sure you've done this right.  The only way to be sure is to maintain extensive browser-based tests—something Rails provides no support for out of the box.

Where I work, we solve this by doing two things:

* All code to be run on a controller action gets put into a shared namespace rather than executed, e.g. `window.StitchFix.widgets.show` is the function to run when the `show` page is rendered.
* We have boilerplate that sets up the necessary jQuery handlers to execute that function at the right time.

But that's not all!  Since the code gets wrapped in an immediately-invoked function, if you want to create library code to share, you have to put your code into `window`, which is global.  You have to be careful you don't squash something else.  Typically, you create a namespace.  We use `window.StitchFix.lib` where I work.

ES6 modules would solve these problems much more cleanly, and are the way most front-enders are solving it.  Modules are the state-of-the-art, and ES6's version is the standard.  Rails developers would benefit from this, and it would remove a source of bugs as well as several decisions to make about managing ap app's JavaScript.

I'm also advocated removing jQuery and a new library to interact with the Rails back-end.

## jQuery out, `rails.js` in

**Note**: Rails 5.1 will allegedly [ship without jQuery](https://github.com/rails/rails/issues/25208).  This is great news!  No word yet if the replacement will have user-facing features or will just implement Rails-provided features.

jQuery was great, and while it's powerful, it is not very Rails-like, and requires developers to make a lot of unnecessary decisions when used in earnest.  It also encourages a style of coding where view logic is intermixed with DOM manipulation and event attachment.  It's the equivalent of the "SQL statements in your `.php` files" that Rails got people away from.

It's also hard to unit test jQuery code, because you must either do a full end-to-end browser test, or a [JavaScript unit test using duplicative markup fixtures](http://naildrivin5.com/blog/2013/04/10/the-painful-world-of-javascript-testing.html).  Rails provides no facilities for either of these types of tests.

With the removal of jQuery, Rails could reasonably ship a simple `rails.js` library to allow interacting with Rails endpoints in a Rails-like fashion.

Instead of requiring developers to use `$.ajax()`, `rails.js` could have a simple and straightforward mechanism to trigger Rails endpoints:

```javascript
Rails.widgets.show(widgetId, (widget)=> {
  // do whatever with widget
});

Rails.frobnosticators.destroy(frobnosticatorId, (frobnosticator) => {
  // whatever
});
```

This would have a lot of advantages.  First, it's a better API to Rails than jQuery's `$ajax` function.  Second, it would be lightweight and dependency free, thus easily usable with other front-end frameworks if that meets the developer's needs.  It could work easily with React, Angular, or Ember, if a developer chose to use those frameworks.  Finally, it defines the AJAX interface to a Rails app the same way `config/routes.rb` defines the HTTP interface.

This would remove a decision developers have to make, and simplify a very common interaction.

[rails6-why-intro]: http://naildrivin5.com/blog/2016/06/12/why-did-i-recommend-XX-for-rails-6.html
[rails6post]: http://naildrivin5.com/blog/2016/05/17/announcing-rails-6-an-imagined-roadmap.html
