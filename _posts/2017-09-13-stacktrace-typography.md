---
layout: post
title: "Stacktrace Typography"
date: 2017-09-13 9:00
ad:
  title: "Full Stacktrace Development"
  subtitle: "Rails + a real Database == Productivity"
  link: "http://bit.ly/dcbang2"
  image: "/images/dcbang2.jpg"
  cta: "Buy Now $24.95"
---

I'm not obsessed with typography, but I have a healthy respect for it.  I talked about [typography and source code](/blog/2013/05/17/source-code-typography.html) a while back and I'd like to revisit the subject, but focus on dreaded _stack traces_.  Stack traces happen when your code hits a situation it can't handle, and most programming languages give you a giant vomit of files and locations that are nigh unreadable.  Can we apply typographic principals to them to help us better understand why our code fails?

<!-- more -->

Here's a typical stack trace from Ruby:

```
 NoMethodError:
 undefined method `xnotify' for #<AwsAutomation::MessageFormatter:0x007f8051d4a2f0>
 Did you mean?  notify
 ./app/services/aws_automation/generic_envvar_creator.rb:16:in `create_envvars'
 ./app/services/aws_automation/memcached_elasticache_envvar_creator.rb:21:in `body'
 ./app/services/aws_automation/creator_methods.rb:45:in `process'
 ./spec/services/aws_automation/memcached_elasticache_envvar_creator_spec.rb:17:in `block (4 levels) in <top (required)>'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:254:in `instance_exec'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:254:in `block in run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:500:in `block in with_around_and_singleton_context_hooks'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:457:in `block in with_around_example_hooks'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/hooks.rb:464:in `block in run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/hooks.rb:604:in `block in run_around_example_hooks_for'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:342:in `call'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-rails-3.6.1/lib/rspec/rails/adapters.rb:127:in `block (2 levels) in <module:MinitestLifecycleAdapter>'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:447:in `instance_exec'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:447:in `instance_exec'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/hooks.rb:375:in `execute_with'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/hooks.rb:606:in `block (2 levels) in run_around_example_hooks_for'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:342:in `call'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/hooks.rb:607:in `run_around_example_hooks_for'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/hooks.rb:464:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:457:in `with_around_example_hooks'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:500:in `with_around_and_singleton_context_hooks'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example.rb:251:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:627:in `block in run_examples'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:623:in `map'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:623:in `run_examples'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:589:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:590:in `block in run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:590:in `map'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:590:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:590:in `block in run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:590:in `map'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/example_group.rb:590:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:118:in `block (3 levels) in run_specs'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:118:in `map'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:118:in `block (2 levels) in run_specs'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/configuration.rb:1894:in `with_suite_hooks'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:113:in `block in run_specs'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/reporter.rb:79:in `report'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:112:in `run_specs'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:87:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:71:in `run'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/core/runner.rb:45:in `invoke'
 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/exe/rspec:4:in `<top (required)>'
 bin/rspec:17:in `load'
 bin/rspec:17:in `<main>'
```

<div data-ad></div>

Blech.  This is from a test failure.  We can see that the stack trace is formatted in a vague attempts at being useful: each frame of the
stack is on one line, we can see the line numbers, full path, and name of the method.  In an attempt to make more sense of this,
the testing package—RSpec—will omit a lot of this by default, showing only lines of the stack in *your* code.  This is
helpful about 95% of the time, but it really only reduces the problem.  And, in production, we don't get such niceties in
our error messages.

Typography is about serving the text, so what best serves the text of a stack trace?  It depends on what we want to know.  We
ultimately want to know what caused our code to break, but the stack trace can't necessarily tell us that directly.  It's more of
a clue that we need to follow, but with so many lines, it's hard to know where to start.

The art of reading stack traces is something seasoned developers learn over many years, and one of the things you have to do is
block out the useless information and try to find what's useful.  There's a lot of duplicate information in this stack trace.
It's also very wide because of how deep the directories are.  Finally, it *is* useful having full paths if you need to copy and
paste to edit a specific file.

Let's try some light formatting and see where that gets us.  We'll also make some assumptions about files in our project and
those elsewhere to compress some of the horizontal width.

```
 NoMethodError:
 undefined method `xnotify' for #<AwsAutomation::MessageFormatter:0x007f8051d4a2f0>
 Did you mean?  notify

 ./app/services/aws_automation/generic_envvar_creator.rb:16               in `create_envvars'
                              /memcached_elasticache_envvar_creator.rb:21 in `body'
                              /creator_methods.rb:45                      in `process'

 ./spec/services/aws_automation/memcached_elasticache_envvar_creator_spec.rb:17 in `block (4 levels) in <top (required)>'

 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/

   /core/example.rb:254 in `instance_exec'
   /core/example.rb:254 in `block in run'
   /core/example.rb:500 in `block in with_around_and_singleton_context_hooks'
   /core/example.rb:457 in `block in with_around_example_hooks'
   /core/hooks.rb:464   in `block in run'
   /core/hooks.rb:604   in `block in run_around_example_hooks_for'
   /core/example.rb:342 in `call'

 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-rails-3.6.1/lib/rspec/

   /rails/adapters.rb:127 in `block (2 levels) in <module:MinitestLifecycleAdapter>'

 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/lib/rspec/

   /core/example.rb:447        in `instance_exec'
   /core/example.rb:447        in `instance_exec'
   /core/hooks.rb:375          in `execute_with'
   /core/hooks.rb:606          in `block (2 levels) in run_around_example_hooks_for'
   /core/example.rb:342        in `call'
   /core/hooks.rb:607          in `run_around_example_hooks_for'
   /core/hooks.rb:464          in `run'
   /core/example.rb:457        in `with_around_example_hooks'
   /core/example.rb:500        in `with_around_and_singleton_context_hooks'
   /core/example.rb:251        in `run'
   /core/example_group.rb:627  in `block in run_examples'
   /core/example_group.rb:623  in `map'
   /core/example_group.rb:623  in `run_examples'
   /core/example_group.rb:589  in `run'
   /core/example_group.rb:590  in `block in  run'
   /core/example_group.rb:590  in `map'
   /core/example_group.rb:590  in `run'
   /core/example_group.rb:590  in `block in  run'
   /core/example_group.rb:590  in `map'
   /core/example_group.rb:590  in `run'
   /core/runner.rb:118         in `block (3 levels) in run_specs'
   /core/runner.rb:118         in `map'
   /core/runner.rb:118         in `block (2 levels) in run_specs'
   /core/configuration.rb:1894 in `with_suite_hooks'
   /core/runner.rb:113         in `block in run_specs'
   /core/reporter.rb:79        in `report'
   /core/runner.rb:112         in `run_specs'
   /core/runner.rb:87          in `run'
   /core/runner.rb:71          in `run'
   /core/runner.rb:45          in `invoke'

 /Users/davec/.rbenv/versions/2.3.4/lib/ruby/gems/2.3.0/gems/rspec-core-3.6.0/exe/

   /rspec:4 in `<top (required)>'

 bin/rspec:17 in `load'
 bin/rspec:17 in `<main>'
```

This sacrifices copy-and-pastability for some hopeful readability.  By lining up the method names of the stack, it might be
easier to navigate, as you are likely to be thinking about code artifacts (classes, methods, functions), and not files.

We don't have a lot of typographical tricks in the terminal, but color is one of them.  What if we put the error message in red,
bolded each directory as if it were a header, and then put the method names in our code in a highlight color?

![colorized stacktrace](/images/colorized_stacktrace.png)

That's actually not bad.  Let's look at another stack trace from a Node app to see if we can apply any lessons:

```
/Users/davec/Projects/Personal/faas/work/work/js/server.js:10
  res.end(app());
          ^

TypeError: app is not a function
    at Server.http.createServer (/Users/davec/Projects/Personal/faas/work/work/js/server.js:10:11)
    at emitTwo (events.js:125:13)
    at Server.emit (events.js:213:7)
    at parserOnIncoming (_http_server.js:602:12)
    at HTTPParser.parserOnHeadersComplete (_http_common.js:116:23)
```

This is generally less helpful, because we don't have access to the Node source files.  Let's provide URLs to them and apply the
formatting from above:

```
/Users/davec/Projects/Personal/faas/work/work/js/server.js:10
  res.end(app());
          ^

TypeError: app is not a function

  /Users/davec/Projects/Personal/faas/work/work/js/

    /server.js:10 in Server.http.createServer

  https://github.com/nodejs/node/blob/v8.4.0/lib/

    /events.js:125 in emitTwo
    /events.js:213 in Server.emit

  https://github.com/nodejs/node/blob/v8.4.0/lib/

    /_http_server.js:602 in parserOnIncoming

  https://github.com/nodejs/node/blob/v8.4.0/lib/

    /_http_common.js:116 in HTTPParser.parserOnHeadersComplete
```

Colorized:

![colorized JS stacktrace](/images/colorized_stacktrace2.png)

This is a sparser stack trace, but I think the formatting still works.

What about Emoji?  One of the most striking aspects of [Yarn](https://yarnpkg.com/en/) was how it used emoji in its output.  Part
of me is a command-line purist (I even [wrote a book about](https://pragprog.com/book/dccar2/build-awesome-command-line-applications-in-ruby-2)), but there is something whimsical and downright *fun* about Yarn's CLI, so why can't we use Emoji in our stack traces?  Maybe the bold, colorful symbols can provide separate between the components of the stack trace without having have so much whitespace.

We'll put a symbol in front of each line to try to anchor the user as to what it's for and hope that this provides the right
visual cues needed to navigate the information without sacrificing screen real estate.

```
⚠️ /Users/davec/Projects/Personal/faas/work/work/js/server.js:10
    res.end(app());
            ⬆️
TypeError: app is not a function

  🖥 /Users/davec/Projects/Personal/faas/work/work/js/
     ↪️ /server.js:10 → Server.http.createServer
  🌎 https://github.com/nodejs/node/blob/v8.4.0/lib/
     ↪️ /events.js:125 → emitTwo
     ↪️ /events.js:213 → Server.emit
  🌎 https://github.com/nodejs/node/blob/v8.4.0/lib/
     ↪️ /_http_server.js:602 in parserOnIncoming
  🌎 https://github.com/nodejs/node/blob/v8.4.0/lib/
     ↪️ /_http_common.js:116 in HTTPParser.parserOnHeadersComplete
```

The Emoji aren't better than the whitespace in monochrome, but in color, I think it works:

![Emoji stacktrace](/images/emoji_stacktrace.png)

It is a bit ridiculous, though, right?  In a way…yes.  But, in another way, I think I'd enjoy seeing stack traces like this, and
might even be able to find out what the problem with my code is, if a bit more care were put into the formatting of a stacktrace.
