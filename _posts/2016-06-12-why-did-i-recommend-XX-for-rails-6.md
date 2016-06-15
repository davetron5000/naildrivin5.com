---
layout: post
title: "Why did I Recommend What I Did for Rails 6?"
date: 2016-06-12
---

In my [imagined keynote for Rails 6][rails6post], I imagined a lot of wacky new features for Rails.  My Rails 6 had lots of big changes, and I thought it might be interesting to dig into why I think those changes are useful for Rails.

<!-- more -->

First, I very much feel that Rails should continue to have opinions, and to embody those opinions in the framework.  It seems logical for me that as the shared body of knowledge around web development increases, Rails should bring the best of those practices to the framework.

I view Rails' strength as removing decisions that aren't relevant to getting your work done.  For example, I don't care what the name of a primary key is, I just need it to be consistent in the system. Therefore, I shouldn't have to make a decision about it.  Similarly, I don't want to have to decide the names of the directories where code goes, I'm fine if there is a consistent, framework-enforced standard.

To my mind, then, it stands to reason that as more and more practices become common, Rails should incorporate them into the framework, each time removing a decision a future developer has to make that isn't relevant to the task at hand.

A great, and simple example is presenters.  Developers have recognized that views often need to expose more data than is in an Active Record and that sometimes that data is view-specific.  There are myriad gems to address this.  They are all more or less the samed, and they all seem to indicate that developers are making pointless decisions—which presenter framework or pattern should I use?  If Rails adopted such as mechanism, it would remove that decision for most developers and be a win for the framework and its users.

So, let's explore my imagined features/changes to Rails.  We'll go in order of the keynote, and each bit will be its own blog post.

* [No More Per-View CSS](/blog/2016/06/13/imagined-rails-6-no-more-per-view-css.html)
* [jQuery out, ES6 in + rails.js](/blog/2016/06/14/imagined-rails-6-removes-jquery-and-favors-es6.html)
* [Encouraging Resource-based Design](/blog/2016/06/15/imagined-rails-6-doubling-down-on-resource-based-design.html)

Check back for updates.

[rails6post]: http://naildrivin5.com/blog/2016/05/17/announcing-rails-6-an-imagined-roadmap.html

