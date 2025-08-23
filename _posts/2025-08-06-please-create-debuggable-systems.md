---
layout: post
title: "Please Create Debuggable Systems"
date: 2025-08-06 14:55
ad:
  title: "Fix Your Dev Environment for Good"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

When a system isn't working, it's far easier to debug the problem when that system produces good error messages *as well as useful diagnostics*. Silent failures are sadly the norm, because they are just easier to implement.  Systems based on conventions or automatic configuration exacerbate this problem, as they tend to just do nothing and produce no error message. Let's see how to fix this.

<!-- more -->

Rails popularized "convention over configuration", but it often fails to help when conventions aren't aligned, often silently failing with no help for debugging. This cultural norm has proliferated to many Ruby tools, like Shopify's ruby-lsp, and pretty much all of Apple's software design.

* I asked my editor to jump to a definition and the LSP didn't do it and there is no error message.
* I took a picture on my phone, it's connected to WiFi, as is my computer, and it's not synced to my photos. There is no "sync" button, nor
any sort of logging telling me if it tried to sync and failed or didn't try and why not.
* I'm creating my dev and test databases and [it doesn't create my dev database, but creates my test database twice](https://stackoverflow.com/questions/50720730/rails-env-development-rake-dbcreate-is-not-creating-development-database). (I hope this poor guy figured it out…it's been seven years!)

We all experience these failures where we get an error message that's not helpful and then no real way to get more information about the problem.

Creating a debuggable system is critical for managing software, especially now that more and more code is not written by a real person.  To create such a system, it must provide two capabilities:

* Helpful and descriptive error messages
* The ability to ask the system for much more detailed information

*Both* of these capabilities must be pre-built into the system. They cannot be provided only in some interactive debugging session or only in a development environment.  You want these capabilities in your *production* system.

## Write Helpful and Descriptive Error Messages

There is always a tension between an error message that is so full of information as to be useless and one so vacant that it, too, is useless.  Designers never want users to see error messages. The security team never wants to allow error messages to provide hackers with information.  And programmers often write errors in their own language, which no one else understands.

Ideally, each error message the system produces is both *unique* and is written in a way you can *reference* more detailed information about what to do.

Consider what happens when using NeoVim and Shopify's ruby-lsp is asked to go to the definition of a Ruby class and, for whatever reason, it can't:

> No Location Found

This absolutely sucks:

* It doesn't explain what went wrong
* It doesn't provide any pointers for further investigation
* It's not clear what is producing this message: ruby-lsp, the Neovim plugin, or Neovim itself
* It doesn't even say what operation it was trying to perform!

Here are some better options:

* "Could not find definition of 'FooComponent'"
* "Could not find definition of 'FooComponent', ruby-lsp returned empty array"
* "Could not find definition of 'FooComponent', restart ruby-lsp server with \-\-debug to debug"
* "Could not find definition of 'FooComponent', see NeoVim's log at ~/cache/logs/neovim.log for details"
* "Could not find definition of 'FooComponent', searched 1,234 defined classes from 564 folders"

These messages each have attributes of a useful error:

* The operation that caused the issue ("Could not find definition")
* The specific inputs to that operation (`FooComponent`)
* Observed behavior of dependent systems ("ruby-lsp returned empty array")
* Options to get more information ("restart ruby-lsp…" and "see NeoVim's log")
* Metadata about the request ("searched 1,234 classes…")

These can all help you try to figure out the problem.  Even if you can't provide *all* diagnostics, you should always consider including in your error message:

* What operation you tried to perform
* What result you got (*summarized*, not *analyzed*)
* What systems are involved:
  - attach your system's name to messages you create
  - attach the subsystem's name to message you receive and pass along

Aside from this, creating a way to get more information is also extremely helpful.

## Create a Debug or Diagnostic Mode

The volume of information required to fully debug a problem can be quite large.  It can be costly to produce and difficult to analyze. This can be a worthwhile tradeoff if something isn't working and you don't have any other options.  This means your system needds a *debug* or *diagnostic* mode.

A diagnostic mode should produce the inputs and outputs as well as intermediate values relevant to producing the outputs. Let's imagine how finding the definition of a class in Ruby works in the ruby-lsp.

At a high level, the inputs are the symbol being looked-up and the outputs are a list of files and locations where that sybmol is defined.  LSP is more low level, however, as it will actually accept as input a line/column of a file where a symbol is referenced, and expect a list similar locations in return.

This means there are a few ways this can fail:

* The file doesn't exist
* There is no symbol at the location of the file
* The symbol's definition can't be found
* The symbol was found, but the file isn't accessible to the caller

The most common case is a symbol being correctly identified in the file, but not found. This is where intermediate values can help.

<div data-ad></div>

Presumably, a bunch of files were searched for the symbol that can't be found.  Knowing those files would be useful!  But, presumably, those files were found by searching some list of folders for Ruby files. *That* list of folders would be nice to know as well!

This is obviously a massive amount of information for a single-line error message, however the information could be stored.  The entire operation could be given a unique ID, which is then included in the error message *and* included in a log file that produces all of this information.  Given the volume of information, you'd probably want the LSP to only produce this when asked, either with a per-request flag or a flag at startup (e.g. `--diagnostic` or `--debug`).

Making all this avaiable requires extra effort on the part of the programmer. Sometimes, it could be quite a bit of effort!  For example, there may not be an easy way to generate a unique ID and ensure it's available to everywhere in the code with access to the diagnostic information.  And, of course, all this diagnostic code can itself fail, creating *more* intermediate values needed to diagnose problems.  We've probably all written something like this before:

```ruby
begin
  some_operation
rescue => ex
  begin
    report_error(ex)
  rescue => ex2
    $stderr.puts "Encountered #{ex2} while reporting error #{ex} - something is seriously wrong"
  end
end
```

In addition to just culling the data, you have to log it, or not.  Ruby's `Logger` provides a decent solution using blocks:

```ruby
logger.debug {
  # expensive calculation
}
```

The block only executes if the logger is set to debug level.  Of course, you may not like the all-or-nothing approach.  The venerable log4j used in almost every Java app allows you to configure the log level *per class* and even dynamically change it at runtime. You can do this in Ruby with [SemanticLogger](https://logger.rocketjob.io/):

```ruby
require "semantic_logger"

SemanticLogger.appenders << SemanticLogger::Appender::IO.new(STDOUT)

class Foo
  include SemanticLogger::Loggable
  def doit
    logger.debug("FOO!")
  end
end

class Bar
  include SemanticLogger::Loggable
  def doit
    logger.debug("BAR!")
  end
end

foo = Foo.new
bar = Bar.new

foo.debug # => nothing
bar.debug # => nothing
Foo.logger.level = :debug
foo.debug # => 2025-08-06 18:35:59.138433 D [2082290:54184] Foo -- FOO!
bar.debug # => nothing
```

While SemanticLogger only allows runtime changes of the global log level, you could likely write something yourself to change it per class.

## Please Create Debuggable Systems

While you could consider everything above as a part of *observability*, to me this is distinct.  Debuggable systems don't have to have OTel or other fancy stuff—they can write logs or write to standard output.  Debuggable systems show useful error messages that explain (or lead to an explanation of) the problem, and can be configured to produce diagnostic information that tells you what they are doing and why.

You can get started by creating better error messages in your tests!  Instead of writing `assert list.include?("value")`, try this:

```ruby
assert list.include?("value"),
       "Checking list '#{list}' for 'value'"
```

Try to make sure when any test fails, the messaging you get is everything you need to understand the problem.  Then proliferate this to the rest of your system.
