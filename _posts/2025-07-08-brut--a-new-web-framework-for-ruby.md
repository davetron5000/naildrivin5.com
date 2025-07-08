---
layout: post
title: "Brut: A New Web Framework for Ruby"
date: 2025-07-08 9:00
ad:
  title: "Fix Your Dev Environment for Good"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

<div style="display: flex; align-items: center; gap: 0.5rem;">
<figure style="float: left">
  <a href="/images/BrutLogoTall.png">
    <img src="/images/BrutLogoTall.png"
         alt="A brown rectangle with a large capital 'B'. Underneathe is 'brut'">
  </a>
</figure>
<p class="p">
<a href="https://brutrb.com">Brut</a> aims to be a simple, yet fully-featured web framework for Ruby. It's different than other Ruby web frameworks.  Brut has no controllers, verbs, or resources. You build pages, forms, and single-action handlers. You write HTML, which is generated on the server. You can write all the JavaScript and CSS you want.
</p>
</div>
<!-- more -->

Here's a web page that tells you what time it is:

```ruby
class TimePage < AppPage
  def initialize(clock:)
    @clock = clock
  end

  def page_template
    header do
      h1 { "Welcome to the Time Page!" }
      TimeTag(timestamp: @clock.now)
    end
  end

end
```

Brut is built around low-abstraction and low-ceremony, but is not low-level like Sinatra.  It's a web framework. Your Brut apps have builtin OpenTelemetry-based instrumentation, a [Sequel](https://sequel.jeremyevans.net/)-powered data access layer, and developer automation based on `OptionParser`-powered command-line apps.

[Brut](https://brutrb.com) can be installed right now, and you can build and run an
app in minutes. You don't even have to install Ruby.

```
> docker run \
        -v "$PWD":"$PWD" \
        -w "$PWD" \
        -it \
        thirdtank/mkbrut \
        mkbrut my-new-app
> cd my-new-app
> dx/build && dx/start
> dx/exec bin/setup
> dx/exec bin/dev
# => localhost:6502 is waiting
```

There's a full-fledged example app called [ADRs.cloud](https://github.com/thirdtank/adrs.cloud) you can run right now and see how it works.

## What You Get

[Brut has extensive documentation](https://brutrb.com), however these are some highlights:

### Brut's core design is around classes that are instantiated into objects, upon which methods are called.

- No excessive `include` calls to create a massive blob of functions.
- No Hashes of Whatever. Your session, flash, and form parameters are all actual classes and defined data types.
- Minimal reliance of dynamically-defined methods or `method_missing`.  Almost every
method [has documentation](https://brutrb.com/api/index.html).

### Brut leverages the modern Web Platform.

- Client-side and server-side form validation is unified into one user experience.
- [BrutJS](https://brutrb.com/brut-js/api/index.html) is an ever-evolving *library*
of autonomous custom elements AKA web components to progressively enhance your
HTML.
- With [esbuild](https://esbuild.github.io/), you can write regular CSS and have
it instantly packaged, minified, and hashed. No PostCSS, No SASS.

### Brut sets up good practices by default.

- Your app will have a reasonable content security policy.
- Your database columns aren't null by default.
- Your foreign keys will a) exist, b) be indexed, and c) not be nullable by
default.
- Time, available through Brut's `Clock`, is always timezone-aware.
- Localization is there and is as easy as we can make it. We hope to make it easier.

### Brut uses awesome Ruby gems

- RSpec is how you write your tests. Brut includes custom matchers to make it
easier to focus on what your code should do.
- Faker and FactoryBot will set up your test and dev data
- Phlex generates your HTML. No, we won't be supporting HAML.

### Brut doesn't recreate configuration with YAML.

- I18n uses the [i18n gem](https://github.com/ruby-i18n/i18n), with translations *in a Ruby Hash*. No YAML.
- Dynamic configuration is in the environment, managed in dev and test by [the
dotenv gem](https://github.com/bkeepers/dotenv). No YAML.
- OK, the dev environment's `docker-compose.dx.yml` is YAML. But that's **it**.
- YAML, not even ~~once~~twice.

### Brut doesn't create abstractions where none were needed.

- *Is this the index action of the widgets resource or the show action of the widget-list resource?* is a question you will never have to ask yourself or your team. The widgets page is called `WidgetsPage` and available at `/widgets`.
- *My `Widgets` class accesses the `WIDGETS` table, but it also has all the domain logic of a widget!* No it doesn't. `DB::Widget` gets your data.  You can make `Widget` do whatever you want. Heck, make a `WidgetService` for all we care!
- *What if our HTML had controllers but they were not the same as the controllers in our back-end?* There aren't any controllers. You don't want them, you don't have to make them.
- *What about monads or algebraic data types or currying or maybe having everything
be a `Proc` because `call`?!* You don't have to understand any part of that question.  But if you want your business logic to use functors, go for it. We won't stop you.

<div data-ad></div>

## WHY?!?!?!

I know, we can vibe away all the boilerplate required for Rails apps.  But how much fun is that?  How much do you enjoy setting up RSpec, again, in your new Rails app? How tired are you of changing the "front end solution" every few years?  And aren't you just *tired* of debating where your business logic goes or if it's OK to use HTTP `DELETE` (tunneled over a `_method` param in a `POST`) to archive a widget?

I know I am.

I want to have fun building web apps, which means I want write Ruby, use HTML, and leverage the browser. Do you know how awesome browsers are now?  Also, Ruby 3.4 is pretty great as well. I'd like to use it.

What I *don't* want is endless flexibility, constant architectural decision-making, or pointless debates about stuff that doesn't matter.

I just want to have fun building web apps.


## Next Steps

I will continue working [toward a 1.0 of Brut](https://brutrb.com/roadmap.html), building web apps and enjoying the process.  I hope you will, too!

<figure style="float: left">
  <a href="/images/BrutLogoStop.png">
    <img src="/images/BrutLogoStop.png"
         alt="A brown rectangle with 'BrutRB' in large letters centered.  It is in the style of the Washington, DC metro. Below BrutRB are four colored dots that each have a label. They are in the style of a metro line. The red dot has 'RB' in it and is labeled 'Ruby'. The orange dot has 'WP' in it and is labeled HTML/CSS/JS. The blue dot has 'PL' in it, and is labeled 'Phlex'. The green dot has 'RS' in it and is labeled 'Rspec'">
  </a>
</figure>
