---
layout: post
title: "Achieve Static Typing Benefits in Ruby with Keywords Args and Class Constants"
date: 2024-09-25 9:00
ad:
  title: "Build an Awesome Dev Environment"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

[Noel Rappin][noel] wrote [an article on static typing in Ruby](https://noelrappin.com/blog/2024/09/how-not-to-use-static-typing-in-ruby/) that does a great job outlining the various techniques to achieve the benefits often ascribed to static typing.  I have two more techniques that address the 80% case of typing problems in Ruby: keyword arguments and class constants.

In my experience, most typing issues in Ruby and Rails apps are the result of overuse of hashes as data structures, coupled with the
use of symbols to refer to classes instead of using the class itself.  Both of these patterns result in indirection between intention and behavior. When you get it wrong—use the wrong hash key, call the wrong dynamically-created method—you get errors that don't make
sense.

[noel]: https://noelrappin.com

<!-- more -->

## Keyword Arguments Are Explicit and Ergonomic

Rails makes heavy use of options hashes. Consider
[`create_table`](https://github.com/rails/rails/blob/a11f0a63673d274c59c69c2688c63ba303b86193/activerecord/lib/active_record/connection_adapters/abstract/schema_statements.rb#L293)
which has this signature:

```ruby
create_table(table_name,
             id: :primary_key,
             primary_key: nil,
             force: nil,
             **options,
             &block)
```

`options` is documented as accepting a specific set of keys, and there is a fair bit of code written to validate these keys and
provide a decent error if you use one that's not supported.  This is a form of type checking.  This API was designed before keyword arguments were a thing, so there really wasn't a better way to do it.

Now, you could eliminate all that code by using this method definition:

```ruby
create_table(table_name,
             id:            :primary_key,
             primary_key:   :id,
             force:         nil,
             temporary:     false,
             if_not_exists: false,
             options:       {},
             as:            nil,
             comment:       nil,
             charset:       nil,
             collation:     nil,
             limit:         nil,
             default:       nil,
             precision:     nil,
             &block)
```

Ruby will now tell you if you are mis-using the method.  Rails would not need to provide any validation on the options because they
are part of the method signature (note the "escape hatch" `options:` option, which allows free-form options to still be used).

Another common use of symbols—beyond hash keys for options—is as a stand-in for a class.

## Classes Are Objects, too, and Darn Handy

Next, let's look at Rails' routing.  Here is a typical route:

```ruby
resources :widgets
```

This assumes there is a `WidgetsController` that implements `index`, `show`, `new`, `create`, `edit`, `update`, and `destroy`.  It
also dynamically creates methods like `widget_path` and `edit_widget_path`.

In complex apps it can be hard to predict the names of the methods that will be created.  It can also be easy to misspell something somewhere.  Because the symbol `:widgets` must carefully match substrings of various method names, be translatable into a class name, and match strings for URLs, there are a lot of ways this can be messed up.  The error messages when that happens aren't always helpful in understanding the problem.

What if we used the class itself, instead:

```ruby
# config/routes.rb
resources WidgetsController

# some_view.html.erb
<%= link_to WidgetsController.show_path(widget) %>
```

Here, same is same.  The `resources` call is given an actual class that must have been defined.  In that moment, `resources` can check
to see if `WidgetsController` has all the methods that it's going to create routes for.

In the view template, again note that the use of `WidgetsController` means that the class must exist.  This is hard to mess up. If you do, a far better error message can be produced.

Rails' configuration is littered with symbols masquerading as classes:

```ruby
config.active_job.queue_adapter = :resque
```

Why not use the class directly?

```ruby
config.active_job.queue_adapter = ActiveJob::QueueAdapters::ResqueAdapter
```

Yes, it's more code, but you really only have to type it once. It's easier for the developer to understand and easier for the framework to validate. See [a longer post on this topic](https://naildrivin5.com/blog/2016/12/06/configuration-is-user-experience.html) for more reasons why using actual structured code over indirection-through-symbols is a better user experience.

## Additional Benefits

By being more explicit where possible, it can make refactoring easier, allow for better documentation, and facilitate better type
checking if you need to actually do it.

### Lean On The Interpreter

<div data-ad></div>

In a statically-typed language, certain refactors require changing type signatures of methods.  When you do that, the compiler will
show you everywhere that the method is now being misused.  It's a TODO list of everything you need to fix.  When you've fixed
everything, it's often the case that most of the refactoring is done.  Certainly, you need tests to be sure, but it provides precise direction on what needs changing.

You can get these benefits in Ruby by using keyword arguments and class constants.

Suppose Rails 9 wants to require comments be provided to every call of `create_table`.  By removing the default value in the method
signature, every app that doesn't specify `comment:` to `create_table` will generate an error from Ruby that could not be
clearer: "`create_table: missing keyword: :comment`".

Suppose your company decides it's not in the widgets business, but in the doodad business.  No need to `grep` for `widget_` and
`widgets_` and `Widget` and `:widget` and `widget:` to find all the places someone could've referred to the resource.

Instead, change `WidgetsController` to `DoodadsController` and run the app.  Ruby will tell you that you are referencing non-existent classes.  It'll tell you exactly where.  You fix that and you might actually be done with what could've been a painful refactor.  And you don't even really need a test suite to do it, as long as you execute all the right code paths (though a test suite can make this much easier).

### Self-Documenting Code

If you look at the documentation for `create_table`, you'll notice that the documented options are fewer than the actually-accepted
options.  This is a benefit to using keyword arguments: at least their names will show up in documentation.

Using class constants is also a form of documentation.  The hypothetical use of `ActiveJob::QueueAdapters::ResqueAdapter` as the value
for the Active Job configuration option means you can look that class up easily and find its documentation. You can see how it's built
and not have to figure out what `:resque` actually means.

### More Powerful Type Checking Code

If you *do* find the need to write additional type-checking code, you can give much better error messages.  Suppose our imagined `resources` method above existed.  Instead of waiting until runtime to call methods and hoping the class was created properly, you can now easily check all that at the time of invocation:

```ruby
ALL_METHODS = [
  :index,
  :show,
  :new,
  :create,
  :edit,
  :update,
  :destroy,
]
def resources(klass, only: ALL_METHODS)
  not_implemented = ALL_METHODS - klass.instance_methods
  if not_implemented.any?
    raise ArgumentError,
      "#{klass} does not implement these methods: " + 
        #{not_implemented.map(&:to_s).join(', ')}. " +
       "use `resources #{klass}, only: [ ... ]` "+
       "to specify only those methods you support`"
  end
  if !klass.ancestors.include?(AbtractContoller::Base)
    raise ArgumentError,
      "#{klass} must be a subclass of " + 
        "AbtractContoller::Base. Instead, found " + 
        klass.ancestors.map(&:name).join(', ')
  end

  # ...
end
```

## Ruby is Awesome

Ruby is now quite powerful in a lot of ways.  Rails might be designed differently if it were created today, and it's easy to get
anchored into its way of doing things.  When you are designing APIs, consider keyword arguments and consider using classes themselves
to configure and set up parts of your app.  Avoid using hashes as data structures when the structure itself is known and well-defined.
