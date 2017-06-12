---
layout: post
title: "Don't Use the UNIX Environment Directly"
date: 2016-06-10
---

Getting configuration from the UNIX environment is a hallmark of [12-factor application design][12factor], and is a great practice.  Problems arise, however, when your code is littered with direct references to it.  This is because the UNIX environment is a very poor database, but we need to treat it as a better one.

<!-- more -->

Instead of having your code that needs configuration grab values directly from the environment, you should use a lightweight abstraction layer that your code depends on.  This has three advantages:

* It allows you to deal with the fact that the UNIX environment is essentially typeless.
* It's a centralized place for all default values needed for optional settings.
* It's a single place for things that might need to be configurable, but aren't yet.

## Environment Variables are Strings

Most programming languages vend environment variables as strings.  This leads to errors like so:

```ruby
if ENV["SOME_FLAG"]
  puts "Flag enabled!"
else
  puts "Flag disabled."
end
```

In Ruby, all non-nil, non-false values are "truthy".  Since `ENV#[]` will only ever return either `nil` or a String, the "Flag disabled" path wil never execute:

```
> SOME_FLAG=false ./test.rb
Flag enabled!
```

This means that you have to coerce your environment variables to a type you want.  Often, developers do this:

```ruby
if ENV["SOME_FLAG"] == "true"
  puts "Flag enabled!"
else
  puts "Flag disabled."
end
```

This is somewhat verbose, easy to mess up, and creates other problems when you have someone who prefers "0" and "1" instead of "true" and "false":

```
> SOME_FLAG=1 ./test.rb
Flag disabled.
```

If you have a layer between your code and the environment, you can handle that in a common way.

```ruby
class Settings
  def self.some_flag?
    ["1","true"].include?(ENV["SOME_FLAG"].to_s.downcase)
  end

  # or maybe

  def self.some_flag?
    boolean("SOME_FLAG")
  end

private

  def boolean(env_var)
    ["1","true"].include?(ENV[env_var].to_s.downcase)
  end
end
```

Your code then becomes much cleaner:

```ruby
if Settings.some_flag?
  puts "Flag enabled!"
else
  puts "Flag disabled."
end
```

It also works :)

```
> SOME_FLAG=1 ./test.rb
Flag enabled!
> SOME_FLAG=True ./test.rb
Flag enabled!
> SOME_FLAG=false ./test.rb
Flag disabled.
```

With an abstraction layer, we can also handle default values for optional environment variables.

## Centralizing Defaults

Suppose we want to allow the configuration of a timeout for talking to our payment processor.  We have an idea of what the right value is, but we may need to tweak it in production, so we don't want to have to do a code change every time.  So, we'll grab it from the environment, but set a reasonable default.

```ruby
class Settings
  def self.payment_processor_timeout
    ENV["PAYMENT_PROCESSOR_TIMEOUT"].try(:to_i) || 2000
  end
end
```

Note we have to use `try` because `nil.to_i` returns 0, not `nil`.  So, we're saying "if a value has been set, coerce it to an integer, otherwise use 2000".

Without `try`, you can do:

```ruby
class Settings
  def self.payment_processor_timeout
    (ENV["PAYMENT_PROCESSOR_TIMEOUT"] || 2000).to_i
  end
end
```

With such a system set up, you can use this to centralize all your application's configurable bits, even if you don't need or want them overridden by the environment.

## Centralizing Configuration

For example, you might be using S3 to store files, and want all code that uses S3 to use the same bucket, but you have no real need to configure that bucket in the environment.

```ruby
class Settings
  def self.s3_bucket_name
    "my-app-files"
  end
end
```

This now means the code that needs the bucket name can just ask the settings for it, and if you later need it to be configurable, it can easily be extracted from the environment.


## Isn't this a solved problem?

We use the [mc-settings][mc-settings] gem, that uses an ERB-ized YAML file:

```yaml
some_flag: <%= ["1","true"].include?(ENV["SOME_FLAG"].to_s.downcase) %>
payment_processor_timeout: <%= ENV["PAYMENT_PROCESSOR_TIMEOUT"].try(:to_i) || 2000 %>
s3_bucket_name: "my-app-files"
```

This allows us to write `Setting.some_flag`.  It even supports nested settings, like so:

```yaml
payment_processing:
  - timeout: <%= ENV["PAYMENT_PROCESSOR_TIMEOUT"].try(:to_i) || 2000 %>
  - api_key: <%= ENV["PAYMENT_PROCESSOR_API_KEY"] %>
```

We can then do `Setting.payment_processing(:timeout)` to access the configured value.

## Conclusions

Don't litter your code with references to the environment.  It's easy to create bugs because the environment is a somewhat degenerate settings database.  It also makes your code harder to follower because you are using `SCREAMING_SNAKE_CASE` instead of nice, readable methods.  It also makes it hard to centralize type coercions and default values.

[12factor]: http://12factor.net/
[mc-settings]: https://github.com/modcloth/mc-settings
