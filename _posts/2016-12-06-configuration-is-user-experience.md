---
layout: post
title: "Configuration Design is User Experience Design…and it's hard"
date: 2016-12-06 9:00
---

In exploring the modern front-end ecosystem for my new book, I've gotten to experience some truly difficult configuration formats (Webpack) and to work around aspects of Rails that aren't configurable (Sprockets).  Configuration is hard, and it's an overlooked part of the user experience often designed to make the software library author's job easier at the expense of ease-of-use.

It doesn't have to be this way.

<!-- more -->

Rails is famous for popularizing “convention over configuration”, which boils down to two things:

* Don't make everything configurable.
* Set sensible defaults for everything that *is* configurable.

This is often referred to as “opinionated software”, but it's really “software that is easy to use”.  This is because I strongly feel developers should be
spending time solving problems for their users and not making pointless decisions like where files go, how to name database tables, or what HTML templating language to use.  No project failed because the developers didn't think long and hard enough about the merits of HAML vs Slim.

But, this concern is orthogonal to the _user experience_ of configuring software.  Software configuration is, on a whole, a total nightmare.  Rails shields
itself from some criticism because it doesn't make you actually configure things very often, but when you do, it's needlessly complex.

Here's how to configure the JavaScript minifier in Sprockets:

```ruby
environment.js_compressor  = :uglify
```

What does the symbol `:uglify` mean?  What does it do?  The documentation for `js_compressor` is:

> Assign a compressor to run on `application/javascript` assets.  The compressor object must respond to `compress`.

Although you can make a `Symbol` respond to `compress`, that's clearly that's not what happening here. Turns out there is a lookup table in the code that maps
that symbol to the actual compressor, `Sprockets::UglifierCompressor` (which, strangely, does not respond to `compress`; the docs are out of date and the
object must actually respond to `call`).  So, to specify another value than the default, you have to _configure the configuration_.

A UI like this isn't learnable.  You can't simply figure out what other options are available.  It's also not predictable, because you have no way to know
what different values will do (without reading the source code and even then it's not clear—what's being passed to `call`?).

Typically, a UI or API has to trade-off learnability with usability.  [vim](http://naildrivin5.com/blog/2013/04/24/how-to-switch-to-vim.html) is a classic
example of leaning toward usability.  It's very difficult to learn, but once you do learn it, you're more efficient than with most other editors.

Configuration APIs *must* lean toward learnability, because there is no steady-state where you are editing configuration every day.  The _usability_ of
configuration doesn't matter nearly as much as its learnability.

And, because Ruby uses code for configuration, I would argue it makes the framework developer's life easier.  Consider if *this* were the way to configure the
JS compressor:

```ruby
environment.js_compressor_class = Sprockets::UglifierCompressor
```

This is eminently more learnable.  We know that we're expected to provide a class.  We can also see that the default value is…a class!  We can much more
easily locate that class than we could a symbol.  In fact, if we're lucky, that class has documentation that we can consult instead of looking at the source.

I should note that you *can* pass a class to `js_compressor=`.  There's just all this extra code in Sprockets to handle a Symbol.  I can't understand why.
It's more work for the library maintainer and more difficult in every way for the user.

But, there is a strong culture in Rails for playing code golf at every turn.  Anything verbose is “ugly” and not “clean” and therefore must be eliminated.
This is not in the interest of users.

The way configuration is used is different than, say, Active Support.  I would argue that Rails is right to create APIs like `3.days.ago`.  But, these opaque
and undiscoverable affordances have no place in configuration.

Configuration should be explicit, and if making it more verbose is required to make it explicit, so be it. Note that explicit doesn't require being verbose.

An explicit configuration is more learnable and readable.  It also makes the library author's job simpler, meaning they can provide more help to the user in
properly configuring the library.

For example, what if `js_compressor_class=` worked like this:

```ruby
def js_compressor_class=(klass)
  method = klass.instance_method(:call)
  if method && method.arity == 1
    @js_compressor_class = klass
  elsif method.nil?
    raise "#{klass} does not implement `call`"
  else
    raise "#{klass} implements call, but it takes #{method.arity} " +
          "arguments.  It should take exactly 1"
  end
end
```

How helpful would that be?  A lot more so than being able to specify a Symbol to save a few seconds of typing.  I know that Ruby and Rails eschew this sort
of safety net, but, again, users aren't in the configuration very often and won't ever really learn the subtleties of how it works.  They *need* safety checks and helpful error messages far more than in the “regular” Rails API.

Leaving Rails, it's all downhill, but I think the same lessons could be applied.

Let's look at Webpack, the current asset-pipeline-du-jour.

Webpack is highly powerful and eminently functional.  But its configuration is bordering on performance art.  Here's how the docs recommend you get CSS into
your asset bundle:

```javascript
{
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader' 
      },
      // ...
    ]
  }
}
```

This is impossible for a newcomer to derive, and pretty difficult to retain.  Even if you understand the concept of loaders (which are, roughly, a way to
tell Webpack how to handle a file given to `require()`), this is still incredibly opaque and error-prone.  It doesn't have to be and, honestly, a
better format would likely make the code that manages this easier to write and maintain.

So, what is this configuration doing?  It says that if someone `require()`s a file whose name ends in `.css`, then to run it through some code attached to the string
"css-loader" and then run *that* result through some code attached to the string "style-loader".

Where did "css-loader" and "style-loader" come from?  And how do we know we can combine them in this way?  We have only documentation to tell us that this
could possibly work and is correct.

That the configuration requires a mini-language embedded in a string is telling us that there's a lot of room for improvement.

Whatever "style-loader" and "css-loader" mean, they eventualy lead to some piece of code we've brought down from NPM.  Why not use that piece of code as the
configuration?  Further, why are we hiding the idea of multiple loaders?  And why bury the ordering inside a string?  And why order the backwards from how
both UNIX and English-speakers read?

Instead, what if we were more honest about what's being configured.  We want to configure a pipeline of loaders, which are functions that we pull in from a
dependency:

```javascript
var CssLoader   = require("css-loader");   # a package from package.json
var StyleLoader = require("style-loader"); # a package from package.json

module: {
  loaders: [
    {
      test: /\.css$/,
      loaderPipeline: [
        CssLoader,
        StyleLoader
      ]
    },
```

This requires much less context to get right.  If we assume some knowledge of what a loader is as well as some basics of JavaScript, we can not only quickly
understand this configuration, but we can modify it more easily.  I can dig into the css-loader package and see what it exports.  I can also easily see the
ordering of how my loaders will be used, because we're using a data structure for ordering things: an array.

Notice how much more clear this actually is.  I would also be willing to bet that the code that interprets this configuration would be much simpler,
because it's being handed the actual pieces of code to execute and doesn't have parse out that ridiculous exclamation point or look up "style-loader" in
some internal data structure to find the actual code.

Designing a configuration system is like designing an API, but it's even harder, because it's an API that is crucially important to use properly, and
something that by definition developers will not be using very frequently.  It's one of the few cases where _learnability_ matters.

But, it could be worse.  Here's how to specify a project dependency in SBT, the Scala Build Tool:

```scala
libraryDependencies += "org.apache.derby" % "derby" % "10.4.1.3"
libraryDependencies += "org.scala-tools" %% "scala-stm" % "0.3"
```

Any ideas what those strings are?  Or why the first line uses single percent-signs and the second line uses one double-one?  Good luck googling that.
