---
layout: post
title: "Ruby on Rails: Still the Best Web App Framework for Most Teams"
date: 2020-11-23 9:00
ad:
  title: "Maintainable Rails"
  subtitle: "Pragmatic Practices for Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
related:
  - "Choosing Technology"
  - "The Frightening State of Security Around NPM Package Management"
  - "Creating a Culture of Consistency"

---

Earlier this year, I was in the position to choose the framework for the startup at which I'm now the CTO. I
could've chosen anything. I went with Rails.  And you should, too. It still is the best framework for getting up
and running *and* for continued iteration and development.

<!-- more -->

Writing a web app requires many moving pieces.  If you use something like Spring, Node, Express, or any other basic
library, you have a *lot* of decisions to make:

* How are URLs routed to code?
* How are headers, params, and request bodies parsed?
* Where does the code live to manage this?
* How are responses created?
* How do we generate dynamic HTML?
* How do we mitigate against common security vulnerabilities such as cross-site scripting?

Of course, web apps almost always have a database, which leads to more decisions:

* How will we access the database?
* How is the database schema managed?
* What conventions will we use for table and column names?

Then, there are concerns around the development environment:

* How do we write tests?
* How can we execute a test using a web browser?
* How do we manage the data needed for our tests?
* How do we manage data needed to run the app locally?

Finally, there are concerns around deployment and production:

* How do I get JavaScript packaged for the browser?
* How do I manage CSS?
* How do I create cacheable bundles for CDNs?

## The Cost of Making So Many Decisions

These decisions are only the beginning.  I've worked on web apps that used libraries only—no frameworks—and all of
these decisions plus more had to be made. Many had to be made before the team could start working.  But as time
went by and the team's composition changed, managing these decisions was a constant tax.

<div class="pullquote">…managing these decisions was a constant tax</div>

Because *we* made these decisions and *we* configured our libraries to work in a particular way, it was not
uncommon for developers to want to know why we did it that way, and could we change it?  Many of these decisions
amount to conventions not enforceable with code, so a good chunk of our code reviews required making sure everyone
followed the conventions.

And then we would update our libraries to find out they were suddenly incompatible.  Because we'd hand-selected
libraries to solve each problem, we had no way to guarantee they all worked together other than making sure our app
still worked.  It was hard to see the value in the series of decisions that led to this architecture.

## Stop Making So Many Decisions

With Rails, you don't have to make *any* of the decisions above. None.  Once you type `rails new` all of those
decisions are made.  True, there are more decisions you will have to make, but Rails will have eliminated a huge number of ultimately pointless decisions.

<div class="pullquote">Rails will have eliminated a huge number of ultimately pointless decisions</div>

It simply doesn't matter how JavaScript is packaged, what your database naming conventions are, or how HTTP requests are routed to code. You need answers and conventions for all of that, yes, but the actual conventions don't matter.

What you also need are the conventions to be enforced or managed in code, not documentation. That way, everyone is
incentivized to focus on the problems specific to their domain instead of the plumbing of their app.

<div data-ad></div>

This has been the value proposition for Rails since its inception over 15 year ago.  In that time, Rails and its
ecosystem have matured, improved, and continued moving forward.  The value Rails brings is still needed, and it is
*still* the best framework for most teams.

Engineers without Rails experience may continue to believe the fantasy that Rails does not scale or that it can't
be used for "serious" problems.  Those of us *with* Rails experience know this isn't true.  But what we also worry
about is that Rails apps can become unmaintainable.

## Rails Helps Maintainability

Hopefully, it's obvious that no framework or set of libraries can ensure maintainability.  I would argue that Rails
gives you a better chance.  Rails—and its ecosystem—tend to evolve together, so you can rely on the stability of
your core tools over many years.

Rails basis in conventions also means that there are generally fewer parts of an app to get crufty as time goes by.
But, it's still up to the team to establish conventions and ways of working to capitalize on that.  As it would be
on any team.

So what happens when the team stops making pointless decisions, worrying about library compatibility, and spending
code-review time on conventions?  They start thinking about the problems they need to solve. That's why Rails is
the best web framework for most teams.
