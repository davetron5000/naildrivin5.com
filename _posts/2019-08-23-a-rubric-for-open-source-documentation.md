---
title: "A Rubric for Open Source Documentation"
date: 2019-08-23 8:00
layout: post
ad:
  title: "Learn Technical Writing"
  subtitle: "And 10 other Engineering Practices"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "Configuration Design is User Experience Design…and it's hard"
  - "Explicit Code is Inclusive"
  - "Four Reasons Developers are Unproductive"
---
In reference to my [last post][event-source-post], someone pointed me to the Eventide Project, and my response was
that I could not understand what the project was, what it did, or how it worked, despite volumes of documentation.
Rather than detail out that project's documentation failings, I thought it might be interesting to see a rubric that walks you through the information you need to give new and existing users the best information about an open
source project.

[event-source-post]:  /blog/2019/08/14/event-sourcing-in-the-small.html
<!-- more -->

You can [skip to it](#rubric) if you like, but I do want to briefly touch on why documentation is important and
what its purpose is.

## Why is Documentation Important?

<div data-ad="true"></div>

Documentation can be a big help in adopting open source technologies. It can also reduce the burden
on the maintainers if it's well done, since many users can get help from reading the docs.
Certainly not everyone is served by written documentation, but no one is
served by poor or missing documentation.

If you look at both Ruby and Rails and React, both are incrediby popular, have excellent documentation, and grew
very quickly to dominate the market they are in. I don't think any of this is coicidence.

Documentation is often the first thing a potential user might experience with a given piece of technology. If
you've ever had to integrate with a third party system (e.g. FedEx, Stripe) at work, my guess is one of the first
things you do is look for the documentation.  Not only will this give you a sense of what actually lies ahead of
you, but it can be a strong signal of the quality of that software.

Given that it's important, what is the purpose of documentation?

## The Purpose of Documentation

Open source documentation needs to

* explain what the software is and does.
* demonstrate how it does it.
* show how to install it and configure it.
* provide a detailed reference for all of the features.

Addressing these needs while also being cognizant of the audience can be tricky.  A brand-new user will need a lot more context and explanation, whereas an experienced user wants to go right to the reference. A seasoned programmer
will more quickly understand code snippets as compared to a non-programmer who is not familiar with code at all.

There is another hidden purpose to documentation, which is to encourage good design.  Riffing on the concept of
[README-driven development][rdd], when you document a system you have built, you very often uncover flaws in its
design or implementation.  By explaining a system to someone new, you can quickly identify the barriers to entry
and understand the steepness of the learning curve.  By trying to fully document your API as a reference, you can
see very clearly how complex the system actually is.

So, how can we accomplish this?  I believe a basic rubric or outline can help make sure we serve all of these
audiences.

[rdd]: https://tom.preston-werner.com/2010/08/23/readme-driven-development.html

<a name="rubric"></a>
## Rubric for Documentation

The rubric is a series of questions, the answers to which will allow you write some great documentation.  The
outline is:

* Clarify the software's purpose
* Provide a simple low-context example of how it works
* Provide a reference for every day use

### Clarify the software's purpose

All software should exist to solve some problem, and in the case of a common problem, a reason why this new
solution should be considered.

Answer these questions:

* What is the name of your software and how should it be written down?
* What does your software do, described in one line?
* What problem does the user have that your software solves?
* How does your software's solution differ from existing solutions<a name="back-1"></a><sup><a href="#1">1</a></sup>?
* What should a prospective user already know before trying to understand your software?

If you cannot succinctly *and specifically* answer these questions, you should consider thinking more deeply about
what you are building and why you are building it.  If you *can* answer these questions, they should be directly
in your documentation. Even writing them down as simple questions and answers in the README is better than nothing.

Note that *many* websites for open source software do not clearly answer these questions.

It's often difficult to provide clarity from just words, and we are often a bit hyperbolic when doing so, so next
we need to see exactly how the software works.

### Provide a Simple, Low-Context Example

Ideally, you can show a demonstration of the simplest possible use-case, in a way that requires the least amount
of knowledge, using a format that is as close to executable as possible.

Try to answer these questions:

* What is the most basic use-case of the software you can think of, e.g. printing “Hello World”?
* If you sat down at a brand new computer of your choice, how could you demonstrate that use-case?
* For each step of the use-case, can you explain what that step does and why that step needs to be followed?
* What pre-requisites are there to allow you to demonstrate this use-case on any supported platform?

You may need more than one use-case and, if so, answer the same questions for each.  If you can answer these
questions, you can essentially write them all down to provide the e.g. sample code for your software.

At this point, you will have done far better than most open source software, because the reader will understand
what your software is for, why it exists, and broadly how it works. This will serve newcomers well.  Now you have to provide help to actual users.

### Provide a Reference for Everyday Use

The reference documentation contains specifics and details about the intended behavior of your software, along
with detailed use-cases.

To create this, first answer these questions:

* How, *exactly*, should your software be installed on each supported platform, assuming little to no context on
the part of the user?
* How, *exactly*, should the user invoke or run the application to verify it was installed properly?
* What differences are there between development and production when installing the application?
* What are the common tasks the user will want to accomplish if they are using the software as intended?
* What decisions should the user consider when using your software in earnest?
* How can the user observe the software's behavior, especially if something goes wrong?

Answering these, and then writing them up as documentation, will serve new and intermediate users pretty well.  If
you've ever needed to remember how to use the venerable UNIX `tar` command, and made the mistake of calling up its
manual via `man tar`, you know the power of use-case specific examples and documentation—you probably needed `man
tar` to tell you <span class="nowrap">`tar cvfz «your file».tgz`</span>.

The next type of reference documentation to consider is API documentation, which includes (but isn't limited to ):

* Library documentation (methods/classes/functions)
* Configuration documentation
* Command-line documentation
* Database or other data store documentation
* Error codes and common informational messages

Here,  be specific, show examples, and show context.  It's very difficult to understand configuration
documentation when you don't know how deep in a JSON or YAML file some key is expected to go.  The more a user can
copy and paste into their editor and tweak it, the better.

Also keep in mind for dynamically-typed languages (which does include almost all configuration file formats),
document the types of things and be specific.  The user needs to know what they are supposed to pass in for normal
use.

If you approach documentation in this way, it does have some implications for the design of your system.

## Design Implications

Consider systems you may have worked with and how easy or difficult it might be to answer the questions above.
Could those systems have been designed differently to make them easy to document?

Compare Angular and React's documentation. I realize these aren't 100% competing technologies, but React shows you
a running component, live in your browser, right on the main page.  Angular requires you to connect to a third party website, launch a browser-based IDE, which launches a development server, and then requires having at least two browser tabs open to figure out what's going on (it took me over a minute to do this).

I would suggest answering the questions in the first two parts of the rubric before writing any code, and
keeping the answers in mind as you work. A system that is easy to document is likely to be easy to use. That means
you can spend less time on helping users and more time maintaining and enhancing the system.

----

<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>If you use the words “lightweight” or “elegant”, delete everything and start over.<a href='#back-1'>↩</a>
</li>
</ol>
</footer>
