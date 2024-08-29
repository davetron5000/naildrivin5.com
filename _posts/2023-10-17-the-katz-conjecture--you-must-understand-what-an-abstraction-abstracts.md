---
layout: post
title: "The Katz Conjecture: You Must Understand What an Abstraction Abstracts"
date: 2023-10-17 9:00
ad:
  title: "Sustainable Dev Environments with Docker"
  subtitle: "Build a Dev Environment You Can Understand"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.99"
related:
  - "Wrap Third Party APIs in Service Wrappers to Simplify Your Code"
  - "Choosing Technology"
  - "Four Better Rules for Software Design"
---

To effectively use any abstraction, you must—eventually—have a solid understanding of what it's abstracting.  I'm calling this the *Katz Conjecture* because Yehuda Katz made this statement in a conference talk (that I cannot find and hope actually existed).  The conjecture has two implications: any abstraction that doesn't sufficiently simplify what it's abstracting makes everything worse, and any abstraction you don't understand is a risk to your project.

<!-- more -->

## Examples of the Katz Conjecture in Action

You are building a UI with Bootstrap, when you require a particular type of spacing between elements.  None of Bootstrap's
classes quite work, so you must write CSS, which Bootstrap in theory abstracts.

Or, perhaps you are using an object-relational-mapper like Active Record, happily fetching and updating data from your database,
when the app's performance tanks.  It turns out that if you re-order your method calls, a more efficient query is executed,
which requires understanding your databases's implementation of SQL to figure out.

Maybe you are building a web app with Rails and have cached a page that doesn't change that often. When you *do* change it, no
one sees the updates.  You now have to learn how HTTP caching works to debug the problem.

None of these issues imply these abstractions are badly designed or not useful. It's just that eventually you will need to
understand what they are abstracting, since all abstractions *leak*.

## When Abstractions Leak, You Must Drop Down One Level

Joel Spolsky famously [coined the term *leaky abstractions*](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/):

> Abstractions fail. Sometimes a little, sometimes a lot. There’s leakage. Things go wrong. It happens all over the place when you have abstractions.

Abstractions leak for a lot of reasons. Perhaps you did something unexpected and the abstraction can't handle it properly, producing an error that only  makes sense if you understand the layer below. Perhaps the abstraction simply doesn't provide access to a feature you need. Or, perhaps it's just not that great of an abstraction.

<div data-ad></div>

It's hard—perhaps impossible—to create perfect abstractions that never leak.  This is why the Katz Conjecture is so important.
It means the gains provided by an abstraction don't have to be erased when there is a problem it's not solving for you.

The Katz Conjecture also provides you two useful tools for managing software: an easy way to identify risk, and a reliable way to
evaluate the potential gains of an abstraction you are evaluating.

## Abstractions that Feel Magical are Risky

Using a new library or framework can feel magical, especially when it allows you to achieve great things quickly and simply.
But, this magic is not actual magic, it's just a sufficiently advanced abstraction.  And, because it leaks—because of the Katz
Conjecture—you will need to understand what it is abstracting.

You may not get to decide when you are required to start learning the level below. It could be during a crisis where something
isn't working.  Or, it could be in a moment of stress trying to deliver a critical feature.

This means that all the magic of an abstraction in your project is a risk that you will have to stop working on your project and
"pop the hood" on an abstraction to get through an issue.

What's interesting about this way of looking at risk is that it's not purely technical. If you have a single SQL expert on your
team, that can vastly reduce the risk of using an ORM that person understands.

Through this lens, you can better evaluate technologies you might like to use.

## Abstractions Must Reduce and Simplify an Underlying Technology

If you know SQL, and need to write code to manipulate one row in a database, it becomes quite tedious to do it directly, like so:

```ruby
results = exec(
  "SELECT name, description, created_at from WIDGETS where id = #{id}"
)

if results.size == 0
  raise "No widget with id #{id}"
elsif results.size > 1
  raise "There #{results.size} widgets with id #{id}?"
end

created_at = if results[0]["created_at"]
  begin
    Date.parse(results[0]["created_at"])
  rescue Date::Error => ex
    throw "#{results[0]['created_at']} couldn't be parsed: #{ex}"
  end
else
  nil
end

widget = Widget.new(id: id,
                    name: results[0]["name"],
                    description: results[0]["description"],
                    created_at: created_at)
```

What you'd like is to do this:

```ruby
widget = Widget.find(id)
```

(And you'd like there to *not* be a SQL injection vulnerability while you're at it)

However, if you are really writing a reporting system with a ton of complicated joins across many tables, an ORM like Active
Record might make things worse.  Complicated queries in Active Record are often more complicated than the SQL you'd need to run.  But you wouldn't know that if you don't know how to solve the problem with SQL.

Thus, when you are examining a potential library or technology, it helps to know how you would solve your problem
directly—without the proposed technology.  If it won't significantly reduce the complexity of your code or simplify its
operations, it may be worse to use it than not.

CoffeScript is a great example where it's not worth it, even when evaluated against the state of JavaScript at the time it was
popular.  At that time, you may have written this:

```javascript
element.addEventListener('click', function(event) {
  if (event.target.dataset['noreload']) {
    event.preventDefault()
  }
  someOtherElement.styles.display = 'block'
})
```

CoffeeScript saves a line or two:

```coffeescript
element.addEventListener 'click', (event) ->
  if event.target.dataset['noreload']
    event.preventDefault()
  someOtherElement.styles.display = 'block'
```

Adding it to a project meant adding a build step to translate the code (as well as necessary source maps).
You still ended up writing about the same amount of code at the same level of abstraction as the normal JavaScript. But if you didn't know JavaScript well, it may have seemed like a good idea.

**Embrace the Katz Conjecture.** Seek to understand any magic on your project and reduce the risk of grinding things to a halt.  Use
the Conjecture when evaluating new technologies, especially when you don't understand how to solve the problem directly.

----

### Appendix: The Katz Conjecture is *Not* Transitive

If you must understand SQL to use an ORM, and you must understand your database's internals to use SQL, then does it not imply
that you must understand your database's internals to use an ORM? No.

This is because the truth of the Katz Conjecture is based on leaky abstractions.  There will be far less "leaking" across layers.
While you may experience some leaks from your database internals to your ORM code, it won't be much, and you'll experience even
less leaking from C (which your database is probably written in) to your ORM code.

Abstractions *do* reduce what you must know about what they abstract, assuming the abstraction is well designed and appropriate
to your use-case.  Thus, with each abstracted layer upon which the given abstraction is built, you will require less and less
knowledge, all other things being equal.

