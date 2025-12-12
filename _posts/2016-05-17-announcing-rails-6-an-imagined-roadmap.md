---
layout: post
title: "Announcing Rails 6: An Imagined Keynote"
date: 2016-05-17 12:00
ad:
  id: "sweng"
---

Just got back from RailsConf.  It was a great Ruby & Rails conference, but I was struck by the dearth of talks about new features of Rails 5—because there just aren't many.  I thought back to what excited me about Rails in the first place—the baked-in conventions, convenience, encouragement of good practices.

Justin Searls gave [a talk](http://blog.testdouble.com/posts/2016-05-09-make-ruby-great-again.html) not about RSpec but about how Rails is losing mindshare, losing favor.  Is Rails losing relevance?  I hope not, but it's easy to see how someone less emotionally invested than me might see it that way.

I'm trying to write about this without complaining.  This is my fifth attempt.  It's hard not to just rant about Rails' failings, so I'm going to try to be constructive by outline a fantasy roadmap for Rails 6.

I tried very much to think about this without going against the “[Rails Doctrine](http://rubyonrails.org/doctrine/)”, and have written this as if it were an Apple-style keynote.  The theme is Progress.

<!-- more -->

----

## Rails 6: Progress

Good morning.  I'd like to share with you all the exciting changes we have in store for Rails 6.  Since Rails was first launched 11 years ago, a lot has changed in the world of web development.

Billion-dollar business are being run on Rails.  These business—along with countless others—have been able to use Rails to solve problems we never imagined.  Rails not only enables small teams to ship great software, but it works for big teams, too.

We've seen Rails move beyond its role as "the single application" to being a part of highly distributed systems.  The productivity gains developers get in the small, and in the simple, they get in the large and complex, too.

Meanwhile, there have been tremendous strides in what is possible in a web browser.  Rails was born of a love of the web, and the web has gotten so much better over the years.  The front-end has blossomed.  We can now deliver amazing things to our users, and the community of web developers both inside and outside Rails has produced amazing tools and techniques for doing so.

Finally, the community of Rails and Ruby developers have over a decade of experience using Rails.  A _decade_!  We've learned so much about what it's like to maintain Rails applications over long periods, and how to best use developers of all levels of experience in working on Rails applications.

Rails 6 is the most revolutionary release of Rails ever, and we've rallied around seventh pillar of the Rails Doctrine: Progress.

Let's start with the front-end.

## Front-End 2.0

Sprockets was way ahead of its time.  Using `remote=true` was, too.  Rails was one of the first web frameworks to actually acknowledge the front-end and include powerful tools for managing your assets.

The rest of the industry has not embraced these tools or techniques, but has instead solved the problems of front-end development in other ways.  Although the tools used for front-end development are in constant flux, there are stable, mature techniques that have proven results.

Rails 6 will bake in the best of these techniques, and create an updated, modern set of front-end tools.

In Rails 6:

* No more per-view CSS.  Rails 6 encourages OOCSS and ships with [Tachyons](http://tachyons.io/), allowing developers to style their views without any CSS from day 1.
* No more per-view JavaScript. Rails 6 supports ES6 and ES6 module syntax to allow developers to structure their front-end code however they see fit.
* Rails 6 no longer includes jQuery by default.  Instead, Rails includes a library called `rails.js` that provides a simple and standard way to access Rails resources via AJAX without using jQuery.  Rails.js can be used standalone, or in conjunction with existing front-end frameworks like React.
* Source maps will be generated for any front-end compiled assets or code, if the source language supports it.
* A new focus on simple plugability and transparent behavior.  The one constant in front-end tooling is change, and a full-stack web application framework like Rails should give you the ability to keep up.

<div data-ad></div>

What Rails 6 doesn't ship with is a front-end framework. There's value in server-generated views, and a light sprinkling of JavaScript can get you a long way.

Next up, the controller layer.

## Doubling-down on Resource-based Design.

Rails strongly believes in resource-based design.  It's been a part of Rails since Rails 2.  Too often, however, developers deviate from this design when without a strong reason.  We've realized this happens for two different reasons.

First, it's largely the same amount of work in your routes and controller to use RPC-style routing as it is to use resourceful routing.  Second, it's too difficult to create resources that work with Rails but that aren't ActiveRecords.

In Rails 6, developers who embrace resource-based design no longer need to specify routes explicitly.  The "special 7" routes are configured automatically by declaring the needed methods in the controller.

```ruby
class UsersController < ApplicationController
  def index # automatically sets up GET /users
  end
  
  def create # automatically sets up POST /users
             # also sets up GET /users/new
  end
  
  opt_out :new # remove GET /users/new
  
  def destroy # configure DELETE /users/:I'd
  end
  
  def deactivate # does not introduce any route
  end
end
```

Developers unnecessarily using RPC-based designs now have more work to do than if they stick with a resource-based design.  The old way of declaring routes still works, but we feel this method will be much simpler.

We also want to make it easier to describe resources that work with the Rails View layer but that aren't Active Records.  We introduced helper modules in Rails 3, and an explicit Active Model in Rails 4, but we still see developers struggling to adopt these technologies.

Instead, developers use presenters, decorators, and view models either hand-rolled or from one or more third-party gems.

Rails 6 will build on ActiveModel by providing a base class called ActionResource.

An ActionResource makes it easy to totally describe your resource, with support for:

* delegating to an underlying object.
* create derived fields.
* formatting values.
* interoperability with Rails form and URL helpers.

Suppose we want to display a user's name, signup date, email, and most recent order (a date and description).  We'll call this an *account*.  We'll implement it using ActionResource, which we can use in our controller like so:

```ruby
class AccountsController
  def show
    @account = Account.new(customer: current_user)
  end
end
```

We create `Account` like so:

```ruby
class Account < ActionResource
  from :customer, show: [ :email, :name, :created_at ]

  format :created_at, with: :short
  format :email, with :downcase
  
  def last_order_date
    time_ago_in_words(last_order.created_at)
  end
  
  def last_order_description
    last_order.items.count + " items"
  end
  
  private
  
    def last_order
      @last_order ||= customer.orders.last
    end
end
```

As with much of Rails, how this works should be obvious by the API we've designed.

The resulting object can be used like any model object:

```ruby
customer = Customer.new(name: "Bob Jones",
                        email: "Bob@JONES.net")
customer.orders << Order.new(created_at: 3.days.ago,
                             items: Item.new)

account = Account.new(customer: customer)

account.email                  # bob@jones.net
account.name                   # Bob Jones
account.created_at             # May 13
account.last_order_date        # 3 days ago
account.last_order_description # 1 items
```

We hope this will allow Rails developers to effectively use resourceful design without needing third-party gems, and to do so with minimal, beautiful code.

We're also discouraging the use of helpers in Rails 6.  Helpers are still a fully supported feature, but when scaffolding or creating new resources with the Rails generator, you will no longer be given an empty helper file.  ActionResource can replace most need for helpers.

Next, let's talk about the code that makes your app special: the business logic.

## The Business of Logic

Over the last ten years, it's become clear that every Rails application needs to manage code that doesn't belong to a controller, model, job, or mailer.  While there are many opinions on exactly _how much_ code should go where, there's no debate that sometimes code has to go somewhere else, and Rails hasn't had an opinion.  Until now.

Rails 6 supports _services_, as we felt this was a good enough nudge regarding where code could go, but without being overly prescriptive, or requiring developers to opt-in to a complex DSL.

Make now mistake: this is a radical change in how Rails thinks about your application's architecture.

By default, `app/services` will be created when you run `rails new` and any code you place there will be auto-loaded the same as for your controllers or models.  The code in your services can be anything.

However, when writing good services, it's often required to bring together lower-level libraries, third-party code, and other services to get the job done.  Testing this code can be challenging.

To help organize your services, we're also introducing _ActiveService_, which is a lightweight library that makes writing and testing services as easy as it can be.

Suppose you want a service for charging customers some money using your `Customer` and `Order` models.  To do this, we need to locate the customer's credit card, charge it the amount of their order, and then email them a receipt (or a notification about failure).  To do this, we need access to our payment processor's Ruby library as well as our `OrderMailer` Rails mailer.

While you could access these classes in the normal way of referencing their global symbols, we can use less code that's easier to test by using Active Service.

```ruby
class Purchaser < ActiveService::Base
  needs :payment_transaction
  needs :credit_cards
  needs :order_mailer
  
  def purchase!(customer:, order:)
    card        = credit_cards.find(customer.id)
    transaction = payment_transaction.new(card,order.amount)
    if transaction.success?
      order_mailer.receipt_email(customer,order).deliver_later
    else
      order_mailer.card_failed(customer,order,transaction).deliver_later
    end
  end
end
```

As you can see, ActiveService provides a way to manage all your services at runtime.  This is especially useful for third-party libraries like our payment processor.  Instead of configuring a global constant like `BRAINTREE_TRANSACTION`, we can let ActiveService handle it:

```ruby
# config/initializers/braintree.rb
service :payment_transaction do
  Braintree::Transaction.new(api_key: ENV["BRAINTREE_API_KEY"])
end

service :credit_cards do
  Braintree::PaymentCard.new(api_key: ENV["BRAINTREE_API_KEY"])
end
```

This way, any other service that needs access to this can be sure to get the properly configured objects.  The real benefit, however, is in our tests.

Instead of mocking classes, or using code like `allow_any_instance_of`, Rails takes care of all that.  Since Rails now knows what your services needs to do its job, it can intelligently mock the behavior of
those objects and allow you to test your code in isolation.

For example, to test our `purchase!` method, we need to arrange for `payment_transaction` to return a successful result, and check that the right mailer method was called.

```ruby
class PurchaserTest < ActiveService::Test::Base
  
  def test_purchase_succeeded
    successful_transaction = stub(success?: true)    

    order    = orders(:any)    # we'll talk about these
    customer = customers(:any) # later on in the presentation
    
    purchaser.payment_transaction.on(:new).returns(successful_transaction)

    purchaser.purchase!(customer, order)
    
    purchaser.order_mailer.verify(:receipt_email).with(customer,order)
  end
end
```

No matter how much code you write as services, Rails 6 will make it easy to keep your code clean, simple, and tested.

We'd like to talk about the fixture-like code above, but first we need to learn about how Rails 6 treats your database.

## Rails and Databases: It's Complicated

One thing we've come to understand over the years is that Rails is just a piece of your technical architecture.  The days of one company having exactly one Rails app that controls one database are increasingly rare.  What we've also seen is that in most cases, the _data_ is more important than code.  Many companies use Rails to create applications that, at their core, manage the data in a database.  This is very much what Rails was originally designed to do!

Rails 6 is now much more opinionated about how you should manage your data and interact with your database.  Instead of a "common denominator" approach, Rails 6 is designed to get the most out of your data
store—whichever brand it might be.

To state this another way, we want good database design to be easy but bad design to be possible.

In Rails 6, we're making the following changes:

* Columns are no longer nullable by default.
* Numeric-based enums are deprecated.  If your database supports enums, those are used, otherwise string-based enums are the default.
* Foreign keys have constraints by default, if your database supports it.
* Primary keys are UUIDs by default, if your database supports it.
* There is a new DSL for check constraints, if supported by your database, that also create equivalent ActiveRecord validations in the related model.

These new defaults and features will keep the migrations DSL just as easy to use as it's ever been, but result in a consistent, resilient, well-designed database that works great with Active Record.

Making this happen isn't easy, and the biggest trickle-down affect it had is the way we manage test data.

## Test Data

Test data comes in two flavors: reference data that is mostly immutable throughout an app's lifetime (think: country codes), and transactional data, which is the data the app exists to manage (for example, orders).

Reference data can be managed with fixtures, however transactional data will now be managed with *factories*.

It's too difficult to manage one single set of test data that works for every test case.  Instead, each use-case for your data will be described by a factory.  You can create a global repository of factories—similar to what you might do with FactoryGirl—or you can create factories directly in your test cases.

By default, however, objects created with factories won't be written to the database.  This will make your tests run much faster, because you typically just need to test logic—not Active Record.

One problem with this approach, however, is that it's possible to create use-case-based factories that could never happen in production.  This is why Rails 6 includes a standard linting task that will write all your factories to the database, to ensure that your scenarios actually could exist in the real world.

We also have a few more changes in how to write tests for Rails apps.

## Testing 2.0

In Rails 6, there will now be only three types of tests.

*Unit Tests* do not use the database by default, and are where the majority of your tests should be written.  The code tested here would be any of your business logic in your models or services.  These are in `test/unit/{models,mailers,jobs,services}`.

For testing scopes, or other code that runs database queries, Rails 6 supports *active record tests*.  We expect these to be infrequent, but it's difficult to test database queries without executing against real data.  These live in `test/active_records`.

Finally, Rails 6 integration test support will be based on end-to-end in-browser testing using PhantomJS.  You'll never have confidence in your web application until you've used it in a real web browser.  We realize these types of tests can be slow, but we've rarely seen a Rails app that doesn't need them.  They will live in `test/integrations`.

## That's It!

We hope you're as excited for Rails 6 as we are.  This is going to be the best release of Rails yet.

----

## Afterword

I know this is a fantasy.  I also know that the amount of work outlined here is massive.  But I strongly feel that features _like_ the ones I've made up would address common things faced by all Rails developers.  Heck, these are issues faced by any web application developer, and Ruby is one of the few languages where solutions can be easily provided out of the box.

Maybe my particular solutions aren't the best, and there are certainly many issues my hand-wavy features aren't addressing that might make them really difficult to actually implement.

But, wouldn't it be amazing if Rails 6 shipped with features kinda like this?  Wouldn't it be awesome if Rails 6 acknowledged the community's collected learnings over the last 10 years, and acknowledged that Rails is actually really awesome at things other than what a small team can accomplish?  Wouldn't be great if Rails acknowledged advances made outside the Rails community?

I do wonder if this is even possible.  Can Rails make such fundamental changes any longer?  Even if we set aside the technical challenges—which are huge—could the culture of Rails (and its maintainers) allow these things to happen?  _Should_ they?

Let's say it *did*.  Let's say Rails 6 was the revolutionary release I'm pretending it is.  Would that put Rails back in the spotlight?  Would that make Rails the go-to web framework for web development?  Would CTOs start thinking about Rails again?

I don't know.  

What I do know is that we all better prepare ourselves to write a lot more JavaScript if things don't change.
