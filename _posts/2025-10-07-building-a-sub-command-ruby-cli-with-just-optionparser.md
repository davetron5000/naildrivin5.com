---
layout: post
title: "Building a Sub-command Ruby CLI with just OptionParser"
date: 2025-10-07 9:00
ad:
  title: "Fix Your Dev Environment for Good"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

I've [thought deeply about building CLIs](https://www.amazon.com/Build-Awesome-Command-Line-Applications-Ruby/dp/1934356913) and built a
*lot* of them over the years.  I've used Rake, Thor, my own gem GLI and many others.  After all that, the venerable `OptionParser`—part of
Ruby's standard library—is the best choice for scripting and sub-command (git-like) CLIs.  I want to show you how.

<!-- more -->

## What is a Sub-Command CLI?

At first glance, `OptionParser` doesn't seem to support a sub-command CLI, like so (I'll explain what each part is below):

```
> bin/test --verbose audit --type Component specs/front_end
```

Yes, you could configure `--verbose` and `--type TYPE`, then figure out that the first thing left over in `ARGV` was a command, but it gets very cumbersome when things get beyond trivial, especially when you want to show help.

Fortunately, `OptionParser's` lesser-known (and oddly-named) method
[`order!`](https://docs.ruby-lang.org/en/3.4/OptionParser.html#method-i-order-21) parses the command-line up to the first argument
it doesn't understand.  How does this help?

Consider the command above.  It's made up of five parts: the app name (`bin/test`), the globally-applicable options (`--verbose`), the sub
command (`audit`), command-scoped options (`--type Component`) and the arguments (`specs/front_end`):

```
> bin/test --verbose audit --type Component specs/front_end
   ---+--     ---+-- --+--   ----------+---  ----+------
      |          |     |               |         |
App---+          |     |               |         |
Global Options---+     |               |         |
Sub Command------------+               |         |
Command Options------------------------+         |
Arguments----------------------------------------+
```

You'd design a CLI like this if the various sub-commands had shared code or behavior. It also helps to avoid having a zillion different
scripts and provides a namespace, especially if you can provide good help. Fortunately, `OptionParse` *does* provide good help and can parse this.

## Two Option Parsers Divide Up the Work

The key is to use *two* `OptionParsers`:

* The first parses the global options. It uses `order!` (instead of `parse!`) so that it only parses options up to the first argument it
doesn't understand (`audit`) in our case.
* The second uses `parse!`, which consumes the entire rest of the command line, leaving `ARGV` with whatever wasn't parsed.

Here's a basic sketch.  First, we'll create the global `OptionParser`:


```ruby
require "optparse"

global_parser = OptionParser.new do |opts|
  opts.banner = "bin/test [global options] command [command options] [command args...]"
  opts.on("--verbose", "Show additional logging/debug information")
end
```

Next, we'll need the second `OptionParser` for the `audit` subcommand.  You'd need one `OptionParser` for each subcommand you want to
support.

```ruby
commands = {}
commands["audit"] = OptionParser.new do |opts|
  opts.on("--type TYPE", "Set the type of test to audit. Omit to audit all types")
end
# Add more OptionParsers for more commands as needed
```

Now, when the app runs, we parse the global options first using `order!`. This means that `ARGV[0]` (i.e. the first part of the command line that didn't match anything in the global `OptionParsers`) is the command name. We use that to locate the `OptionParser` to use, then call `parse!` on that.

```ruby
global_options  = {}
command_options = {}

global_parser.order!(into: global_options)
command = ARGV[0]
command_parser = commands[command]
command_parser.parse!(into: command_options)

# Now, based on the value of command, do whatever needs doing
```

What `OptionParser` doesn't give you is a way to manage the code to run for the e.g. `audit` command, but you have all the object-oriented
facilities of Ruby available to do that.  In [Brut](https://brutrb.com), the way I did this was to create a class with an `execute` method
that maps to its name and exposes it's `OptionParser`.  Roughly:

```ruby

class AuditCommand

  def self.option_parser
    OptionParser.new do |opts|
      opts.on("--type TYPE", "Set the type of test to audit. Omit to audit all types")
    end
  end

  def initialize(command_options:, args:)
    @command_options = command_options
    @args            = args
  end

  def execute
    # whatever
  end
end

commands["audit"] = AuditCommand

# ...
command = ARGV[0]
command_klass = commands[command]
command_parser = command_klass.option_parser
command_parser.parse!(into: command_options)
command_klass.new(command_options:, args: ARGV).execute
```

`OptionParser` also provides sophisticated type coercion via [`accept`](https://docs.ruby-lang.org/en/3.4/OptionParser.html#method-i-accept).
[Many built-in conversions are available](https://docs.ruby-lang.org/en/3.4/OptionParser.html#class-OptionParser-label-Type+Coercion) and you
can [create your own](https://docs.ruby-lang.org/en/3.4/OptionParser.html#class-OptionParser-label-Creating+Custom+Conversions).

This code gets more complex when you want to show help or handle errors

## Showing Help and Handling Errors

`OptionParser` can produce a decent help message:

```ruby
puts global_parser
# or
puts command_parser
```

You can do much fancier stuff if needed by using [`summarize`](https://docs.ruby-lang.org/en/3.4/OptionParser.html#method-i-summarize).  

For handling errors, `OptionParser` will raise an error if options were provided that aren't valid, and you can check whatever you need and
call `exit`.


Now, there is a lot of "do whatever you want" here, as well as potentially verbose code.  Why not use a gem that does this for you?

## Don't Use Gems if Your Needs are Typical

<div data-ad></div>

Code that relies only on the standard library is stable code.  The standard library rarely breaks things and is maintained.  `OptionParser`
is designed to parse a UNIX-like command line, which is usually  what you want.

Even though `OptionParser` is a bit verbose, you likely aren't writing command-line code frequently, so the verbosity—and reliance on the
standard library—is a bonus.  DSLs, at least in my experience, tend to have a half-life and can be hard to pickup, so you re-learn them over
and over, unless you are working in them every day.

I built [GLI](https://github.com/davetron5000/gli) to make this easier, but in practice, it's a somewhat wide DSL that you have to re-learn
when editing your CLI.

[Thor](https://github.com/rails/thor) is very popular, included with Rails, and mostly supports this kind of UI, but it is an even denser DSL that I don't think rewards you for learning it.  And, because it does not use `OptionParser`, it's very sensitive to command and argument ordering in a way that seasoned UNIX people would find surprising and annoying.  It also includes a ton of other code you likely don't need, such as the ability copy files and templates around.

[Rake](https://github.com/ruby/rake) *is* part of the standard library, but the CLIs it produces are not very ergonomic. You must use a
sequence of square brackets and quotes to pass arguments, and there is no facility for options like `--verbose`.  Rake is designed as a
dependency manager, e.g. build my `favicon.ico` whenever my `favicon.png` changes. It's not a general-purpose way to make command line apps.

So, embrace the standard library, and embrace `OptionParser`!
