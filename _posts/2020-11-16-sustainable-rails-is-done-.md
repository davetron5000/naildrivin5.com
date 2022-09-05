---
layout: post
title: "Sustainable Rails is DONE!"
description: "My book 'Sustainable Rails' is complete"
card_image: "/images/sustainable-rails-cover.png"
date: 2020-11-16 9:00
---

Way back at RubyConf 2019, I announced a book about sustainable web development using Ruby on Rails, based on my 6+
y ears of experience doing so at Stitch Fix (and 18 months *not* doing so at LivingSocial).

It's done, it's 450 pages, and you [can buy it now](https://sowl.co/boqdo7) for $49.95 as an ebook (PDF, epub, Kindle, Markdown
formats).  If you write Rails code professionally, and struggle with keeping your app maintainable and easy to work
on, this is the book for you.

<!-- more -->

<img src="/images/sustainable-rails-all.png" class="pbt pr2 pb2" style="float:left" width="33%" alt="Cover to Sustinable Web Development with Ruby on Rails"/>

Rails has become an incredibly mature framework over the last 10 years and it's still the best way to get a web app
up and running, the best framework for being able to quickly and safely make changes, and, if you don't get too
fancy, can provide a stable base for many years of development.


I saw this first-hand at Stitch Fix. We didn't route around Rails with fancy meta-frameworks or gems. When we did,
  it didn't provide a lot of benefit.  But we were also careful in how we used Rails.  The key decision we made was to not put business logic in Active Records.
  This is discussed early in the book (the chapter is available <a href="https://sustainable-rails.com/assets/sustainable-rails-sample.pdf">for free</a>):

> The reasons [to avoid business logic in Active Records] don’t have to do with moral purity or adherence to some object-oriented design principles. They instead relate directly to sustainability by minimizing the impact of bugs found in business logic.

That particular chapter forced me to explain exactly *why* it felt so wrong to put business logic in Active
Records.  I'm quite happy with my explanation, as it doesn't require allegiance to [poorly thought-out
principles](https://solid-is-not-solid.com), nor does it require agreeing to some sort of moral purity. Instead, it
simply requires accepting reality.

This is a major theme of the book: accept Rails for what it is, accept the reality of your situation, accept how
things actually work, then make the most of it.

Rails provides a ton of value. If you use it judiciously, don't overcomplicate your life, incur a few
opportunity costs that can manage carrying costs, you can have a long, happy life with your Rails app.

[The book](https://sustainable-rails.com) will show you how, over 450 pages, by diving into each part of Rails and
discussing real-world concerns, solutions, and trade-offs, all based on my experience building and managing teams
of Rails developers. There's nothing theoretical in here, and there are no magic bullets, either. Just a detailed
breakdown of the trade-offs, costs, and benefits of the most revolutionary web application framework around.
