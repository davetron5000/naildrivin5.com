---
layout: post
title: "Good Rails"
date: 2019-10-10 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---
# Good Rails

Rails is great, but there are a few practices that will serve you well for scaling your Rails ecosystem to many
apps and many developers.

* UI
* Business Logic
* Database
* Third party services (e.g. Stripe)
* Tests

## UI

The way Rails forms, models, and validations all work si *very* powerful.  If you are going to use Rails-rendered
views:

* Use ERB and have a design system
* Create a single ActiveModel per form, and use its validations
* Each view should be powered by a single ActiveModel, except for things like reference data (e.g. list of countries from which to choose when entering an address)
* Global data avaiable to the view e.g. `current_user` should be minimized
* Just use ivars for view-accessible data.  If you follow the advice above it won't be a problem and will simplify
things in your controllers.
* Always always always pass locals to partials and helpers. DO NOT design partials and helpers to assume an ivar
exists.  Yes, this wil result in a bit more code.  Deal.

## Business Logic

* Do not put any business logic in any Rails-supplied construct.  Meaning, no biz logic in controllers, models, jobs, helpers, views, mailers, etc.
* Put business logic in `app/services` and prefer many small classes.  Each class should have one or two methods
that do whatever the entire bit of logic is.  THis class should *use* Rails constructs like mailers, jobs, and
models.  Using dependency-injection for these has low ROI so don't do it. It will overcomplicate your code. It's
fine if you don't want to use rails and would like to DI your way to success.  Just don't do it in Rails.
* Ingress constructs, which are jobs, mailers, and controllers should translate input and output only.  Your
services should have well-defined interfaces, and the controllers et. al. should transform the input they get into
that interface.  For example, Rails passes boolean values from the view as strings `"true"` or `"false"`. The
controller should convert that to a boolean.
* Egress constructs, such as controllers, views, and models should handle conversions of the _true_ data
structures into the forms needed for output.  For example, you may have a richly-defined object for  business
logic, but need to store that as JSON.  That should happen in the model.
* The idea is that your core business logic (in `app/services` operates on well defined data structures that it assumes it is given.  Rails constructs handle the translations and writing).
* Your services should all work like so:

  ```ruby
  class MyService
  
    # arguments are any other services this depends on.
    def initialize(...)
    end

    # DO NOT call this `call`.  Call this whatever it is doing, like
    # process_return or ship_order or whatever.  The arguments should
    # be whatever is being operated on.  The method's implementation should
    # be stateless.  Design this so that you could in theory have exactly one
    # instance of this class in your entire
    # application and it will still work.
    def the_descriptively_named_doit_method(...)

      # This should have a RETURN VALUE that is NOT A BOOLEAN.
      # It should return a rich object that describes what happened.
      # 
      # It's fine to do e.g. return OpenStruct.new(processed?: false, error: ex.message)
      # or you can make a class internal to this one (Result is a good name)

      # This should also log everything it does at info level
      # unless you have a more sophsisitcated observability system
      # in which case do that. You want to know what happened
      # on each code path

    end

  private

    # DO NOT listen to thought leaders telling you
    # private methods are a code smell.  Functional
    # decomposition is demonstrably beneficial to 
    # comprehension, but you don't want to conflate
    # that with designing a public API.
    # Use private methods to keep your methods simple
    #  as needed.  You might not need them!
    def helper_methods_as_needed(...)
    end
  end
  ```
* Your services will not look like "objects" you might see in books or tutorials about OO programming.  That's OK.
You are solving problelms not exemplifying OO and procedural code inside a single namespace is pretty easy for
anyone to understand, test, and change.  A web of objects and messages is not.
* Do not make scopes in your Active Records.  In practice, a scope is often use-case specific and not needed
globally through out the app.  Thus, you will be better served by using `where` inside your service objects.  If
you *do* find the same queries happeningn over and over, you can extract to the model, but this should not be your
default.
* Your translation logic for turning an ActiveRecord into an Active Model for a view or whatever should be its own
class and not part of an active record.  ActiveRecords *should* know how to store data to the database, but they
should not know how your API works
* That said, it's perfectly fine to call `to_json` on an active record if your API currently mirrors your data
model.  Early on this will be true so you get a lot of economy by just learning how `to_json` works and avoiding a
serialization library.


## Database

* Learn the tenents of database design and normalization.  You almost certainly want your database be in "Boyce-Code Normal Form".  This term might seem a bit off-putting, but it likely matches very closely to your intuition about good database design.
* Always use foreign key contraints
* Do not make nullable columns unless absolutely necessary and, if so, document what null means
* Make unique constraints for your business keys
* Use `comment:` for all tables and columns
* If using postgres
  - use text instead of string
  - use timestamptz instead of timestamp
* Do not use rails enums by default. They are broken by design. Options:
  - A real enum (if the values are known up front and unlikely to change)
  - a string/text and a check constraint on the possible values (if the values are more likely to change)

  You can map this to Rails `enum` feature if you want that, but generally you don't.
* Add indexes for whatever you are querying by.  Look at your `where(..)` calls and make sure there are indexes
there.
* Do not put data changes in db/migrate. Put those in `db/seed` or in a rake task.  And make those idempotent.
* Do not use active records in your migrations and avoid having too much code

## Third Parties

* Wrap all third party access in a single service object or library.  Do not pass around third party constructs to
your code ever.  This is not to allow you to swap about the third party for something else, but to contain the
effect it will have on your app and design.
* Never ever ever make a network call to a third party inside a web request (controller).
* This means that it's confusing as to how to manage this. If your third party code is wrapped in a  service and
that is called in another service and that is called in a controller, WTF do you do? Judiciuosly use background
jobs.  This requires careful design work from the product feature level on down.
* Keep your third party libraries up to date

## Tests

* Do not be seduced by abstracting the universe into anemic classes so you can get fast tests and show off at a
conference.  Rails is built to be tightly integrated and if you don't like that, don't use Rails.
* Factories and Fixtures will become a complex set of global variables that create hidden dependencies in your
tests.  A way to manage this is:
  - Use FactoryBot
  - Create factories that produce a single nonsensical but valid record that ensconses NO business logic
  - Customize that factory inside each test that needs it.

  This means your set of factories is relatively stable, linearly growing witih your database schema.  If you
  need to create the same sort of object in many tests, create a method to do that—don't use a factory.
* End-to-end test workflows and user interactions.  Whatever a user will do on your app, have a test of the user
doing that.  Yes, this results in a potentially flaky integration test, but this can inform your design. You *can*
design a UI to be easier or harder to test.
* For non-user-initiated things, test the end to end workflow.  e.g. if you have a scheduled job that calls a
service and drops more jobs and sends emails, test that end to end.  This is what an integration test is for.
* Do not test every edge case in integration tests.  That is what unit tests are for.
* Argue about using the database in a unit test with friends at the bar. Rails considers a unit test a test of a
single class, regardless of the use of the database, so just deal.  Create real active records for your unit tests
of your services.
* Your end-to-end tests should break if your JS breaks.  How you use JS in your app should be informed by how you
intend to test it.  JS is the flakiness most unstable part of your system and it is the thing that's right in
front of the user.  That means you test it more than you test your database.


## Other stuff

* The default `bin/setup`  sucks.  Create your own and use it.  Use it in CI.
