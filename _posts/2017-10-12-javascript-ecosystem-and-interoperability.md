---
layout: post
title: "The JavaScript Ecosystem and Interoperability"
date: 2017-10-12 9:00
link: https://what-problem-does-it-solve.com/webpack/interoperability.html
---

One of my biggest learnings creating [Webpack from Nothing](https://what-problem-does-it-solve.com/webpack/index.html) was just
how poorly the tools of the JavaScript ecosystem interact and interoperate.  Many popular tools are impenetrable monolithic
systems that only do half of what you need and are extensible only through dense plugin mechanisms.

The [last chapter](https://what-problem-does-it-solve.com/webpack/interoperability.html) is an attempt to describe this problem
in detail and offer some solutions.

> I was surprised at how counter-intuitive each step ended up being—I can totally see why there are so many blog posts describing how to set it up. From a test runner that can't run tests, to a system that supports presets, but includes none of them, I was faced with many choices along the way, but also faced with completely opaque systems whose behavior and failure modes were unpredictable.

It focuses on Webpack and Karma, which I found very difficult to make work together:

> Webpack and Karma's interoperability is completely opaque to the user. This means that you have no way to know how the tools are working or even observe them working together without debugging into the source code.

If you didn't make it all the way through the entire Webpack site, this last chapter is worth a read.
