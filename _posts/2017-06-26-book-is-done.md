---
layout: post
title: "Rails, Angular, Postgres, and Bootstrap is DONE and IN PRINT!"
date: 2017-06-25 9:00
---

What started as a quick update to [_Rails, Angular, Postgres, and Bootstrap_][book] to add support for Angular 2 ended up being a pretty
big rewrite on account of Rails 5.1 and Webpacker.  And the book is better for it!  I can't overstate how well Webpacker works
at allowing a Rails application to have a modern front-end.

In [my imagined Rails 6 keynote][rails6], in “Front-End 2.0”, I imagined a lot of changes around the front-end, and while the
exact features I listed didn't come to pass, the underlying problems they solve are addressed by Webpack and Webpacker.

Webpacker basically creates a canonical, simple configuration for Webpack that allows for easy extension.  It can totally
replace the asset pipeline and allow Rails developers to use all the modern front-end tools in wide use elsewhere in the
industry.

Although my book has Angular, Postgres, and Bootstrap in its title, Webpack is the key feature that allows the front-end to work
so well.  Without doing anything other than running two Rake tasks, you have a fullly-featured asset pipeline that supports ES6, TypeScript, and Post-CSS.

The unit testing was not as easy, but the book also has you set up Karma and that worked great as a test runner.  The
application you build in the book *really feels* full-stack and modern.

If you want to know how to create a modern, productive Rails application, [buy the book now][book].  It's complete and in print.

[rails6]: http://naildrivin5.com/blog/2016/05/17/announcing-rails-6-an-imagined-roadmap.html
[book]: https://pragprog.com/book/dcbang2/rails-angular-postgres-and-bootstrap-second-edition
