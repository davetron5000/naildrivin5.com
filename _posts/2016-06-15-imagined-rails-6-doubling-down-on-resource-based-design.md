---
layout: post
title: "Imagined Rails 6: Doubling-down on Resource-based Design"
date: 2016-06-15
publish: false
---

This is a series of posts about [why I recommended the changes I did for Rails 6][rails6-why-intro], in my [imagined keynote
for Rails 6][rails6post].

In this one, we'll explore why I recommended changes that encourage a more resource-based design.

<!-- more -->

## Resourceful Design is Cleaner

I agree with DHH that [if you firmly stick to a resource-based design, and avoid RPC-style routes, you will have cleaner code and cleaner controllers](http://jeromedalbert.com/how-dhh-organizes-his-rails-controllers/).  Because of this, It's surprising to me that Rails requires you to use `config/routes.rb` for basic, resourceful routing.

To my mind, creating a class named `WidgetsController` in `app/controllers` that inherits from `ApplicationController` and contains a method `index` is a pretty strong and unambiguous message from a developer that they want the route `/widgets` to respond to an HTTP `GET`.

The way I see a lot of developers deal with this (admittedly tiny) boilerplate is to declare that a resource responds to all verbs, like so:

```ruby
# config/routes.rb

resources :widgets

# app/controllers/widgets_controller.rb
class WidgetsController < ApplicationController

  def show
    @widget = Widgets.find(params[:id])
  end

  # that's it
end
```

This tells Rails that your application responds to all the magic seven routes for a widget, yet implements only one of them.  It makes `rake routes` confusing.  Developers do it because doing `resources :widgets, only: [ :show ]` is a pain in the ass.

I also see developers rush through their controller design and add RPC-style endpoints.  For example, if we wanted to
distinguish archiving a widget from deleting it, most developers would make an `archive` method.  If, instead, you created a
resource called `ArchivedWidgets` and accepted a POST, that would be more resourceful and likely much cleander design.

If resourceful routes were derived from controllers, it would also make it very easy to spot deviations and have conversations around them.  In an ideal Rails application, `config/routes.rb` wouldn't change that often, so if it did, it's a big red flag to talk about the design of the feature that changed it.

One hard part about doing this is if your resource isn't an ActiveRecord, there is a bit of friction you have to fight through.

## Encouraging Non-ActiveRecord Resources

If it were just as easy to create non-ActiveRecord resources as it were ActiveRecord-based ones, this would further encourage resource-based design.  There are two problems to solve here.

The first is how to provide a non-ActiveRecord object all the needed functionality that Rails' form and URL helpers expect.  This can be achieved with Active Model, though Active Model is a pretty large interface.

The second problem is how to properly assemble such a resource using possibly disparite bits of Active Records.  In my post, I listed an "Account" resource as an example.  In our hypothetical application, the account view shows some user information, such as their name and email, but also information about their most recent order.

This is typically solved via some sort of presenter framework, and there are a **lot** of them.  Their existence says to me that Rails developers want such a framework, and Rails could greatly help us by providing one that was easy to use and full-featured.

The "presenter" situation in real Rails apps isn't good.  Where I work, across our Rails apps, we have:

* Hand-created presenters just using `class`
* Presenters using our [immutable-struct](http://github.com/stitchfix/immutable-struct) library
* View Models created by hand
* Mixins that add view-specific methods to ActiveRecords
* Methods in ActiveRecords only for displaying derived or formatted data in a view
* Classes that mix in some of Active Model's modules (these were created before Rails 4 added a single ActiveModel mixin)
* A base presenter that delegates to a wrapped ActiveRecord using `method_missing`.

My team has done a good job of keeping things consistent in many other areas, but none of these solutions are great, which is probably why we have used so many.

My post postulated a DSL to create these resources.  I'm not hooked on that, but I think the general needs developers have are:

* works with form and URL helpers
* allows delegation of methods directly to other objects
* easily use Rails helpers to implement methods for derived or formatted values

I don't think ActiveModel is this.  ActiveModel is both too much and not enough, and I think it fails at encouraging both
resource-based design as well as another Rails-ism that most people ignore: model-driven design.

Up until Rails 4.2, a model was a database table was a model.  With ActiveModel this isn't the case, however Rails has totally
failed at helping developers adopt model-driven design.

But, encouraging resource-oriented design for controllers, and providing a simple framework for creating non-ActiveRecord
models, I think this could be saved.

Taking our account example, suppose that the account screen wants to allow users to modify some of those details.  Suppose further that we show a user's subscription frequency on this page, too, and that it is modifiable.

Most Rails developers would solve this in one of these ways:

* Put the update logic in the controller - call into the `User` and then the `Subscription`.
* Create a service object or command object that does the work
* Put it all into either `User` or `Subscription`

The Rails way is to put the logic on a model, and if we could create an `Account` model just as easily as we created our `User`
and `Subscription` models, we could do this the Rails way, but without bloating our ActiveRecords:

```ruby
class Account < ActionResource
  def update(params)
    User.transaction do
      user.email = params[:email]
      subscription.cadence = params[:subscription_cadence]
      if valid? # provided by ActionResource
        user.save
        subscription.save
      end
    end    
  end
end
```

This very much follows the Rails Way of "model-driven design" and/or Rails' interpretation of what OO is.

To be clear, I don't think this is necessarily the best way to write code in a Rails app, but this is *much* better than just throwing everything into your User model.  In fact, if a complex Rails app aggressively pursued this sort of design, it might result in fairly clean code, comprised of objects that don't do all that much (which is what we're all after by making services).

I can only assume this is the sort of thing DHH has in mind and why he tends to eschew any "blessing" of objects that aren't models.  It's too bad that there hasn't been clearer instruction and explanation as to how it would work for non-trivial cases.  But, by encouraging a resource-based view of controllers and making it dead-simple to create non-ActiveRecord models, Rails might more naturally encourage the type of design it seems to favor.


[rails6-why-intro]: http://naildrivin5.com/blog/2016/06/12/why-did-i-recommend-XX-for-rails-6.html
[rails6post]: http://naildrivin5.com/blog/2016/05/17/announcing-rails-6-an-imagined-roadmap.html
