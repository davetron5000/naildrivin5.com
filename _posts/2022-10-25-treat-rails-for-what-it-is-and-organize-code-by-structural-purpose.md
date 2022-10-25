---
layout: post
title: "Treat Rails for What it Is and Organize Code By Structural Purpose"
date: 2022-10-25 9:00
ad:
  title: "Sustainable Development with Rails"
  subtitle: "Build for the Long Haul"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
related:
  - "Ruby on Rails: Still the Best Web App Framework for Most Teams"
  - "Creating a Culture of Consistency"
  - "Four Better Rules for Software Design"

---

If I had one piece of advice for using Rails, it is to treat Rails for what it *is*, not what you might like it to be.  This was the subject of my talk at Rails Conf 2022, but it has a few practical implications for, among other things, how to organize the code in your Rails app.

<!-- more -->

No matter how simple your app is, it will have business logic, and you will have a boundary
between your controllers/jobs/mailboxes/tasks and that logic.  The code that defines that
boundary is called a *service layer*. It should go in `app/services`, because Rails organizes
code by *structural* purpose, not domain purpose.  Following Rails conventions will make
development of your app easier to sustain over time.

## An App's Architecture Starts with Code Organization

The reason the question "where does this code go?" is important to answer is because it's
the foundation of the application's architecture.  If developers don't know (or can't agree on) where code is supposed to go, sustained development is going to be difficult.

Rails is a framework that will manage *most* of the classes you need to build an app: HTTP, Email, database, background jobs, etc.  Rails does not provide any specific way to manage your core domain or business logic.  The only feature it provides is the ability to auto-load classes in `app/«whatever»`.

<div data-ad></div>

The easier it is to answer the question "where does the code go?" the easier it will be to work
on your app over time and through change (in requirements, team, etc). If answering this question
is difficult, change is harder. Questions that are difficult to answer create more friction than
questions that are easy to answer, and you want to reduce friction, *especially* around questions
that must be answered before coding can start.

Fortunately, Rails *does* provide an easier answer for *almost* all of the code you have to
write: controllers go in `app/controllers`, Active Records go in `app/models`, Mailers go in `app/mailers`, and so on.  Developers don't need to do a lot of analysis to figure out where that sort of code goes. So it should be with business logic.

Business (or perhaps *domain*) logic doesn't fit into any of the Rails-managed classes, and Rails
doesn't provide an answer for where this code goes.  I find it useful to acknowledge the boundary
between Rails-managed classes and business logic, and I find the best term for this boundary to
be *service layer*.

## Business Logic Should be Encapsulated

Even if you don't explicitly define a boundary between your controllers and business logic, it
doesn't mean it doesn't exist, at least conceptually.  This boundary is called a *service layer*, which [Martin Fowler](https://martinfowler.com/eaaCatalog/serviceLayer.html) defines thusly, emphasis mine:

> A Service Layer defines an application's boundary and its set of available operations from the perspective of interfacing client layers. It *encapsulates the application's business logic*, controlling transactions and coordinating responses in the implementation of its operations.

The highlighted section is important.  The service layer *encapsulates* the business logic from
"clients". In a Rails app, a client is a controller, mailbox, task, or background job.  They
invoke business logic and interpret its results.  The service layer is where this happens.

<aside class="pullquote">
The service layer encapsulates the business logic.
</aside>

This does *not* imply that the service layer contain all the logic.  It is just a boundary.  It encapsulate whatever the logic is.

Rails developers often fail to create an explicit service layer, and have methods littered all
over the place—often on Active Records—that trigger (and implement) business logic.  This is needlessly confusing and hard to manage over time.  Having instead a single place where business logic is invoked makes everything easier.

*Inside* `app/services`, because of encapsulation, you are free to organize the code however you
like. If you prefer stateless procedures, you can do that.  If you prefer a rich collection of
objects passing messages, you can do that, too.  If you need to create subdirectories for domain
concepts, you can do that as well.  This is the primary benefit of encapsulation and, because
this code is tucked into `app/services`, it also is consistent with Rails' conventions.

## What About Decorators and Other Classes?

Most apps should not need more than `app/services` plus what Rails gives you, but if you do end
up having a lot of classes that conform to some structural purpose, you can certainly create a
directory in `app` to store them.

This is what Rails intends you to do, and creating a directory like `app/decorators` is a clear way to communicate that there is a concept of a decorator, and that the way it is constructed is important to be consistent.

This provides an easy answer to "where do decorators go?" and is also consistent with how Rails
wants you to structure your code.  The more easy answers your architecture provides, the better.

## What About `lib`?

There is a second type of code that is particular to your app but doesn't fall into a
Rails-managed class *or* business logic, and *that* is the code that should go in `lib`.  This
code is often infrastructure-type code like middleware or plugins.  `lib` can also hold code you
intend to extract as a gem in the future.

This convention follows the policy we've been discussing: easy answer to where code goes.  If you
need to create some code that is not business logic and does not go in a Rails-managed class, it
goes in `lib`.

## What About Organizing by Domain Concept?

There are advantages to organizing code by domain concept instead of structural purpose.  For
example, you might want `app/shopping` to contain all the code about purchasing from your store
and `app/reporting` to contain all the reporting.

To entirely organize your app this way requires quite the configuration feat with Rails and would
obviate may of Rails' benefits.  It also creates a far more difficult-to-answer to the question of
where code goes.  Is there an existing concept where this new code should go?  I there an
existing concept that is close, and if we rename it would this code go there?  Or, does adding
this code to an existing concept make that concept too complex such that it requires splitting up
into two smaller concepts?

<aside class="pullquote">
It creates a far more difficult-to-answer question of where code goes.
</aside>

These questions can be hard to answer, especially if the app is undergoing rapid change. You may
not know what concepts the app will need or if a concept will be developed beyond the initial
feature. When organizing by structural purpose you can always safely put the code in
`app/controllers` or `app/services` or wherever, and organize it later.

The ability to organize later is powerful: it's much easier to organize code that exists and is
tested than it is to try to predict where code should go in the future.  The contents of your
structurally-based folders will show you exactly what concepts are important and which ones
aren't.

When `app` contains structurally-organized directories and *those* directories contain
domain-organized code, you get the best of both worlds.  You can group by domain concept, but
also easily answer the question of where code goes.  You also have an escape hatch if the
question is too hard to answer: put it in the top of the relevant directory.

## Treat Rails for What it Is

Rails is a web framework that organizes code by structural purpose. It provides rudimentary tools
for adding your own new structural purposes, and does not prescribe how the code inside should be
organized.  Thus, define your service layer explicitly in `app/services`, then organize the code
in there—as well as your domain logic—however you see fit. If you always try to treat Rails for
what it is—not what you might like it to be—your app's architecture will provide a solid
foundation for sustainable development.
