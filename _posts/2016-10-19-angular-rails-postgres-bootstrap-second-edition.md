---
layout: post
title: "Rails, Angular, Postgres, Bootrap Second Edition in Beta!"
date: 2016-10-19 8:09am
comments: true
categories: 
---

The second edition of [Rails, Angular, Postgres, Bootstrap is in beta](https://pragprog.com/book/dcbang2/rails-angular-postgres-and-bootstrap-second-edition).

There's a lot of new content, mostly around Angular 2.

Of particular interest is that we aren't using the Asset Pipeline, but are using Webpack.  I tried hard to get Angular 2 working with Sprockets, but as [Giles
Bowkett](http://gilesbowkett.blogspot.com/2016/10/let-asset-pipeline-die.html) points out in a recent post, Sprockets is not a modern tool for modern
JavaScript.

The current beta is about 75% complete and includes:

* Rails
  * End-to-end unit testing with PhantomJS
  * Making your end-to-end tests work with Webpack
* Angular 2
  * Setting up Webpack to serve CSS and JS
  * Intro to Angular 2, including routing *and unit testing*.
* Postgres
  * Using and testing Postgres check constraints
  * Content-specific indexed (e.g. index on a lower-cased version of a field)
  * Materialized Views
* Bootstrap
  * Simple styling with Bootstrap
  * Grid-based design with Bootstrap

Angular 2's setup was painful, but it's a much nicer framework than Angular 1, and requires a lot less plumbing and decision-making than React (based on my
limited experience with React).

The skills you learn in this book will let you solve a *wide* variety of problems quickly, cleanly, and efficiently, using modern and powerful tools.

[Buy the beta now!](https://pragprog.com/book/dcbang2/rails-angular-postgres-and-bootstrap-second-edition)

*Note: if you bought the first edition, stay tuned—I'm not sure what accomodations will be made*
