# Rails, The Good Parts

For the past couple of years at Stitch Fix, we've created a lot of Rails applications, both for user-facing features and for headless
HTTP services.  Our “stack” has also included Postgres, Angular, and some sort of CSS framework (either Bootstrap or Humblekit).  We've
also scaled a lot in terms of what our software does, who might work on it, the types of changes we need to make.

Originally, there was a certain _accent_ to how we wrote Rails code.  It's now clear that there's a particular application architecture
we use that _includes_ Rails, but isn't dominated by it.  I'd like to document that.

## What This Isn't

This isn't about describing the “One True Way” to write Rails code.  This isn't an indictment of design decisions that Rails has made, or
even a list of things Rails does poorly.

Instead, I want to talk about how to get a lot of value out of Rails, in light of some realities that we faced at Stitch Fix, but that
I think are common in any large organization that's developing tools to run a business.


## The Realities

Here are some things that we hold as sacrosanct:

* Our data is one of our most precious assets.
* Bias toward ease of maintenance and change, even if it sacrifices ease of onboarding.
* There are many agents accessing our data and systems, not just a single Rails app.
* Specialists should not be required by default.
* Engineers are aligned with business units (not technology), and this is the way we scale.
* Junior engineers need to be both effective and safe.

What this mean early one was a few decisions around our technical architecture:

* There would not be one monolithic Rails app.  Instead, we would build products around user communities within the company.  Stylists
and warehouse associates would use different applications, based on their needs.
* We would initially use the database for integration, but we knew this would eventually not scale, and we'd need a more service-oriented
architecture.
* We would not optimize for changing data stores without code changes, but instead embraced Postgres and all of its features.
* Shared code would go in gems based on use-case, not domain object.
* ActiveRecord models would not contain business logic.

These decisions were made almost three years ago, and I believe they were the right decisions.

As our architecture has evolved, there's some common patterns that have come up that either deviate from, or build upon, aspects of 
Rails. This has lead to what I think is an ideal application architecture for our use case.

## User Interface

As a general rule, if you are writing a lot of CSS while building a feature, something may be wrong.  Meaning, you should be able to
create the user interface you want with existing, re-usable CSS classes.  When using Bootstrap, this is very easy to achieve.  One of our
engineers created HumbleKit that is more specific to our tools, and it operates under the same principle.

If you are writing a lot of CSS, this indicates either a missing feature of the CSS framework or your ignorance of an existing feature
(andn possibly an indiactor of poor documentation).

Our CSS is very much rooted in the OOCSS mindset, which goes against the Rails way of creating a `.css` file for each resource in your
`config/routes.rb`.  The value of this:

```html
<header>
  <h1 class="h3 mt0 mb1">Shipments</h1>
</header>
<section class="bord bord-b bord-gray">
  <table>
    <!-- ... -->
  </table>
</section>
```

over this:

```html
<style>
.shipments h1 {
  font-size: 23px;
  margin-top: 0;
  margin-bottom: 10px;
}
.shipments section {
  border-bottom: solid thin gray;
}
</style>
<div class="shipments"
  <header>
    <h1>Shipments</h1>
  </header>
  <section>
    <table>
      <!-- ... -->
    </table>
  </section>
</div>
```

Requires a **lot** of backstory, but suffice it to say, it's so much better to use small, reusable CSS classes, that I now get
viscerally angry when I see CSS more like the latter.

The other thing I've learned is that for the JavaScript parts of the UI, it's much simpler to use a framework.

## Interaction

We have a fair bit of code that uses jQuery.  That code is unit-tested, thoughtful, organized, and clean.  But it is not good.
Understanding it is very difficult, because it's coded to very low level of abstraction: locating DOM elements and attaching or firing events.  This is not the level of abstraction that you need when doing interaction design and implementation.

Although Rails 5 attempts to address this, the Rails 4 story on AJAX, JavaScript, and interaction design is pretty weak.  Rails makes it
easy to trigger a remote endpoint and execute JavaScript when the endpoint responds, but that's it.  Everything else requires you to
essentially design your own front-end framework.

So, we used Angular, but not in the way you think.  Our applications are not “single page apps”.  They very much use Rails routing and
static navigation.  But when you *do* arrive at a screen to do work, it's often the case that screen is entirely powered by Angular.

This has been a boon.  When faced with the interaction you need on a single screen or feature, the resulting code isn't complex.
Although it's highly complex using jQuery, with Angular, it's not much at all.

And Angular provides you the tools you need to manage your code just like you do back-end code:

* `$resource` to avoid callback hell
* Service extraction to create re-usbale components or just manage complexity
* Full unit-testing support without a browser
* Clean separation between markup and front-end logic

You can think about structuring your front-end code just like you your back-end code, and you can write it using TDD fairly easily.

You do lose some things you get from Rails form helpers.  Many of our use cases are not a simple matter of filling out and validating a
form, however, so those helpers aren't germaine to a lot of our problems.  

Of course, we don't use Angular for every single view.  A lot of our applications follow a "search for data, see a list, click a button
to operate on that data" paradigm, and we use Rails views for that, because it's typically much simpler.

So, we have a mix that is largely like this: navigation to data on which to operate is most expdiently done in Rails, while complex
interactions with data would be better-suited to Angular.

Which leads us to the middleware/business logic/back-end.

## The Rails App

In the Rails front-end, we use helpers that are similar to the ones rails provides.  For example, if we need to generate a URL to an
external application, that would be a helper.  If we have some system-wide formatting routine, that would be a helper.  But we try to put
all use-case or view-specific logic into presenters.

Before we get to presenters, we have to talk about routes.  We try to stick to resourceful routes, just as Rails intends.  We do *not*
necessarily create routes that match the names of Active Record objects.  We instead think of the thing the user is operating on and what
they call it, and not how it might be stored in the database.

For example, we have a need to process returned shipments.  We have a database table for shipments, but not for returns, as it isn't
needed.  Nevertheless, `/returns` is a resource of our Rails app.  I believe this is what Rails intends, even if it's not clearly
outlined.

The thing we *don't* do is create routes that route to all actions. We would almost never write this:

```ruby
resources :returns
```

This will generate more routes than we respond to.  I believe this is a flaw in Rails—there is a disconnected between what's in
`config/routes.rb` and what the controller implements.  We want the output of `rake routes` to be “the truth, the whole truth, and
nothing but the truth".  So we'd write this:

```ruby
resources :returns, only: [ :create, :show, :index ]
```

It's more code, but it also captures programmer intent.  It also means that you can run `rake routes` and see exactly what the
application does.  To my mind, I shouldn't have to specify any of this, because it's entirely derivable from the controller.  But that's
for another day.

So this leads to an issue where we have routes to resources that aren't active records.  We create those as structs, which are often
called _presenters_

## Dumb Structs

A return is, in many ways, a form of presenter of a shipment.  You could think of a shipment as having an addressee, an address, some
tracking information, some payment information and some feedback from the user.  A return is a small subset of that.  So, we'd just
create a simple struct:

```ruby
Return = ImmutableStruct.new(:id, :inbound_tracking, :customer_name, :items_purchased, :items_returned) do
  # ...
end
```

This describes the resource and domain object of a return, even though it's not in the database.  We'd then add methods for derived
fields as well as a factory method to convert a shipment into a return:

```ruby
def self.from_shipment(shipment)
  self.new(id: shipment.id,
           inbound_tracking: shipment.inbound_tracking,
           customer_name, shipment.customer.name,
           items_purchased: shipment.items.select(&:sold?),
           items_returned: shipment.items.reject(&:sold?))
end

def num_items_expected_back
  self.items_returned.size
end
```

If we expected to mutate this object, we'd use `attr_accessor` and mixin the various ActiveModel classes.  ActiveModel is great, and the
work Rails has done to make those bits available as modules is awesome, though it could be a lot better.  A big source of confusion in
the Rails codebase is that all the various modules can't just be used piecemeal.  They have dependencies on one another that are not
enforced or documented.  So  you end up including a module, seeing what method it can't find, searching for that method, and including
*that* module.  Repeat until done.

This is actually a really fundamental flaw in the _implementation_ of Rails: the contracts between the various structures are not
identified consistently or sometimes at all.  It's the lazy side of duck typing.  Many Rubyists think you just call whatever method you
want and that's duck typing.  I disagree.  You need to indicate what your expectations are, either through documentation or a protocol.
Rails uses neither.

But, with trial and error, you can learn what modules to include to make your not-an-ActiveRecord object work with the variouis form
helpers, use validations, and all that other stuff you get by default from `ActiveRecord::Base`.


