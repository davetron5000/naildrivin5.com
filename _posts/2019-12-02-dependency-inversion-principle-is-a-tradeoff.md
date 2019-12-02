---
layout: post
title: "Dependency Inversion Principle…is a Tradeoff (SOLID is not solid)"
date: 2019-12-02 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "SOLID Is Not Solid - Examining the Single Responsibility Principle"
  - "Interface Segregation Principle is Unhelpful but Inoffensive (SOLID is not solid)"
  - "The Open/Close Principle is Confusing and, well, Wrong (SOLID is not solid)"
  - "Liskov Substitution Principle is…Not a Design Principle (SOLID is not solid)"
  - "Four Better Rules for Software Design"
---
As mentioned in the [original post][original], I'm realizing that the [SOLID][solid] principles are not as…solid
as it would seem.  In [that post][original], I outlined the problems I see with the Single Responsibility
Principle, and in the [second][open-closed], I recommended ignoring the Open/Closed Principle, since it is 
confusing and most reasonable interpretations give bad advice.  In the [third post][liskov], I talk about how the Liskov Substitution Principle is too narrowly focused on the wrong problem, and doesn't really give usable design guidance, and the [fourth][isp] is about how the Interface Segregation Principle isn't the right way to approach problems with coupling.

Now we get to the last one, the Dependency Inversion Principle, which could also be called "The Reason 2000's Java is Equated With Writing All Your Code in XML Principle".  The principle says that code should depend on abstractions, not concretions. Because it is a principle, the implication is that *all* code should depend on abstractions.  No. No it should not.  Depending on abstractions has a cost which the principle largely ignores.  Let's see how.

[original]: /blog/2019/11/11/solid-is-not-solid-rexamining-the-single-responsibility-principle.html
[open-closed]: /blog/2019/11/14/open-closed-principle-is-confusing-and-well-wrong.html
[solid]: https://en.wikipedia.org/wiki/SOLID
[liskov]: /blog/2019/11/18/liskov-substitution-principle-is-not-a-design-principle.html
[isp]: /blog/2019/11/21/interface-segreation-principle-is-unhelpful-but-inoffensive.html

<!-- more -->
<a name="more"></a>

We might be able to complete our criticism right here and simply say "do not add flexibility you don't need", but
I think the backstory of why this is considered a principle is interesting, as it doesn't come from someone
thinking deeply about design from first principles.  Instead, it's a defense mechanism related to some limitations
in the way Java and C++ chose to implement object orientation.

From the [Wikipedia article](https://en.wikipedia.org/wiki/Dependency_inversion_principle):

> Because many unit testing tools rely on inheritance to accomplish mocking, the usage of generic interfaces between classes (not only between modules when it makes sense to use generality) became the rule.

And thus we start to see why large Java projects have so much dependency injection and why dependency inversion
could feel like a design principle when you work primarily in Java.

## Dependency Injection is a Retcon

I spend the first two-thirds of my career in Java.  The most complex Java applications I worked on made heavy 
of the Dependency Inversion principle.  Every single class had to have a separate interface and a separate
implementation so that anything that needed that class could depend only on the interface.  Every. Single. Class.  

If you need to make a class called `ReturnProcessor`, you would make `ReturnProcessor` an interface and you would implement it with a class called `ReturnProcessorImpl`. Everywhere and always.  The reason wasn't actually one of design purity or anything like that.  It was to deal with mocking and unit testing in Java.  

Consider a class, `ShipmentIntake`, that needs a `ReturnProcessor` to do its job.  Without
thinking about dependency inversion or anything, you might write it like so:

```java
public class ShipmentIntake {
  public processShipment(Shipment shipment) {
    ReturnProcessor returnProcessor =  new ReturnProcessor()

    returnProcessor.process(shipment)

    // ...
  }
}
```

To test this code, you either need to allow a real `ReturnProcessor` to execute as part of the test or you need to
mock it.  Mocking dependencies is very common and very useful. Imagine if `ReturnProcessor` made a bunch of HTTP
calls to a real web service. You don't want your test making those HTTP calls, so you mock `ReturnProcessor` to
avoid it.

The problem is that the way this code is written, you can't easily mock `ReturnProcessor`, because in Java, `new`
is not a method call on an object.  It is a special form and you can't modify how it works to return a mock
`ReturnProcessor`.

To get around this limitation, you allow `ReturnProcessor` to be given to `ShipmentIntake` by someone else (a process called _injecting a dependency_).  The simplest way to do this is like so:

```java
public class ShipmentIntake {
  private ReturnProcessor returnProcessor;

  public ShipmentIntake(ReturnProcessor returnProcessor) {
    this.returnProcessor = returnProcessor;
  }

  public processShipment(Shipment shipment) {

    this.returnProcessor.process(shipment)

    // ...
  }
}
```

This allows us to create a subclass of the real `ReturnProcessor` that has mocked behavior, and we can use that in
the test, e.g.:

```java
ReturnProcessor mockReturnProcessor = 
  createMock(ReturnProcessor.class) // or whatever

ShipmentIntake shipmentIntake = 
  new ShipmentIntake(mockReturnProcessor)
```

This doesn't totally solve the problem, however.  In Java, it's possible to indicate that a class may not have a
subclass, or that a particular method may not be overridden.  If that's been done, you can't create a subclass for
testing.

To get around *that*, you create an interface that `ShipmentIntake` depends on, and that the real
`ReturnProcessor` implements.  Your mock `ReturnProcessor` no longer needs to be a subclass—it just needs to
implement the interface.

This is what *that* looks like:

```java
public interface ReturnProcessor {
  public void process(Shipment shipment)
}

public class ReturnProcessorImpl implements ReturnProcessor {
  public void process(Shipment shipment) {
    // ...   
  }
}

public class ShipmentIntake {
  private ReturnProcessor returnProcessor;

  public ShipmentIntake(ReturnProcessor returnProcessor) {
    this.returnProcessor = returnProcessor;
  }

  // ...
}
```

We have now "inverted the dependency", because `ShipmentIntake` no longer depends on a concrete implementation,
but instead depends on a general interface, and we can provide any implementation of that interface that we
want.

<div data-ad></div>

The problem is that this was only really needed to address the issue with unit testing, but you end up having to
do this *everywhere* and you eventually decide this is just "good object-oriented design", even though that's not
the problem you originally set out to solve.

Of course, this pattern also creates a problem which is you need to have some new code to wire up all of these
dependencies.  Something somewhere has to know what implementation of `ReturnProcessor` to use for
`ShipmentIntake`.  In the olden days, this would be a giant XML file, but nowadays, you can add annotations to
your source code to make it happen.

But like we discussed in the open/closed principle post, this added flexibility doesn't come for free.  It has a
cost, which is to make the overall system harder to understand, because you can no longer look at
`ShipmentIntake`'s source code and know what objects it will use at runtime. If we didn't *need* the ability to
swap out implementations, this is needless flexibility for now benefit.

And remember, we introduced this not to make our code "better", but to solve a problem with how we do testing in
Java.  If we were using Ruby, we would not have the original problem.  Here is the original `ShipmentIntake` in
Ruby:

```ruby
class ShipmentIntake
  def process_shipment(shipment)
    return_processor = ReturnProcessor.new

    return_processor.process(shipment)

    # ...
  end
end
```

Since `new` is a method being called on an object (namely, the object `ReturnProcessor` which is also a class),
and since Ruby allows you to dynamically change the behavior of any method, you can easily configure things so
that `ReturnProcessor.new` returns your mock object during a test, without the need to invert the dependencies
(keeping in mind Ruby doesn't have interfaces anyway).

Some developers don't like doing this, but again, it's a tradeoff.  If we invert dependencies to make them
injectable, we create a new problem, namely that the system is more complex, even if our classes might not be.
This is a real tradeoff!

## System Complexity Matters

Our Ruby version of `ReturnProcessor` has a simple API - we can create it with no arguments and it has a single method that takes a `shipment`.  If we were to allow its collaborators to be injected (namely, `ReturnProcessor`), its API would get more complex, since it would expose the reliance on a return processor, like so:

```ruby
class ShipmentIntake
  def initialize(return_processor = ReturnProcessor.new)
    @return_processor = return_processor
  end

  def process_shipment(shipment)
    @return_processor.process(shipment)

    # ...
  end
end
```

I know it doesn't seem like a huge deal, but this is actually important.  We've gone from a design where
`ShipmentIntake` is only about processing shipments to a design where it is about "processing shipments with a
return processor".  Should the client of `ShipmentIntake` need to know about return processors?

It's hard to answer that question without knowing more about what `ShipmentIntake` is used for.  If it needs to use different return processors in different situations, then yes, we should allow the `ReturnProcessor` to be injected.  But, what if it doesn't need this flexibility?

If it *doesn't* need this flexibility, it's hard to see adding it as a good thing.  We've made our class' API larger than it needs to be.  And, as we discussed in the post on [the open/closed principle][open-closed], classes
that have unneeded flexibility make the overall system harder to understand since we must trace down exactly what
object was used at runtime.

So when *should* we design our classes to depend on abstractions?  Outside of the issue of testing (which can
actually be solved in another way in Java without needing to create a public API to inject dependencies), it
can seem useful to externalize our dependencies when certain objects are complex to create.

## Separating Construction of Objects from Use

The examples thus far have shown objects being created with nothing passed to their constructors.  But what if the
objects need information in order to be constructed?  For example, if `ReturnProcessor` makes HTTP calls, it might
need a fair bit of information about how to do that, such as a URL or credentials.

If `ShipmentIntake` is in charge of creating instances of `ReturnProcessor`, then we might have a problem. Either
`ShipmentIntake` has to know all the configuration values to make a `ReturnProcessor` or it, too, must be given that configuration from somewhere in *its* constructor and then we have a cascade of configuration passed everywhere.

One solution is to provide a global configuration object to all classes, from which they pluck what they need when
they need it:

```java
public class ShipmentIntake {
  public ShipmentIntake(GlobalConfig config) {
    this.returnProcessor = new ReturnProcessor(
      config.returnPartner.getUrl(),
      config.returnPartner.getUsername(),
      config.returnPartner.getPassword()
    );
  }
}
```

This maintains encapsulation—users of `ShipmentIntake` only need to call `new ShipmentIntake(config)` to get a
fully-functioning object and don't have to know how `ShipmentIntake` is implemented in order to create it.  However it creates some uncomfortable coupling, as every class everywhere has access to
all of the configuration.  This can create a situation where two classes depend on the same configuration option
when perhaps they shouldn't, and our system could become unnecessarily difficult to change.  Application
configuration is necessarily not very cohesive, so it makes sense to avoid proliferating it everywhere.

If we follow the Dependency Inversion Principle, then no class is required to instantiate its dependencies.
Instead, it is provided those dependencies from somewhere else.  Where is that somewhere else?

Something somewhere has to know how to create the objects and which ones to pass to which other ones.  This
_wiring_ of objects is a form of configuration, and in 2000's-era Java, it was done in XML files.  Today it's done
implicitly via annotations, but in some languages like Scala or Go, it's done in code, like so:

```java
// Somehwere deep and dark that is allowed to have a bunch of 
// coupling so that most objects don't have to
GlobalContext globalContext = new GlobalContext();
globalContext.loadDefaultsFromEnvironment();

globalContext.put(
  "ReturnProcessor",
  new ReturnProcessor(
    globalContext.get("returnPartner.url"),
    globalContext.get("returnPartner.username"),
    globalContext.get("returnPartner.password")
)

globalContext.put(
  "ShipmentIntake",
  new ShipmentIntake(globalContext.get("ReturnProcessor")
)
```

This `GlobalContext` then has instances of *all* the objects the system needs and they are all configured and
ready to go.  This is essentially how the Spring Framework works (though it's not quite as nasty to set up all the wiring).

An application built this way *does* have advantages.  The code you are in day-to-day just consists of calling
methods on objects, and you rarely have to mess with setting up or creating objects.  However, debugging a system like this is not pleasant.  The "wiring up" part of the application can be highly complex, and it's not
always trivial to get it right.

Complex applications can have a significant portion of their code be this wiring
and you need integration tests of the writing itself to make sure it's correct.
If your application is implicitly wired (with no actual code or configuration doing the wiring, as in modern Spring apps), it is incredibly difficult to figure out what objects are actually used at runtime.

Ruby on Rails applications address this configuration problem in a couple of ways.

A common pattern is for a class to expose an explicit configuration object that is set up during initialization.
This configuration gets used anytime you create an instance of the class, so all your code can simply write
`ReturnProcessor.new` and a pre-arranged configuration inside `ReturnProcessor` is used to configure the class.

In Rails, files in `config/initialzers` are executed when the app starts up, so you might do something like this:

```ruby
# config/initializers/return_processor.rb
ReturnProcessor.configure do |config|
  config.url  = ENV["RETURN_PARTNER_URL"]
  config.user = ENV["RETURN_PARTNER_USERNAME"]
  config.pass = ENV["RETURN_PARTNER_PASSWORD"]
end
```

It may seem strange to externalize a configuration object for what should be the object's constructor, but this is
a nice solution to the problem.  All of your application code can create whatever objects it needs whenever it
needs them, and if any object does require significant configuration, that is handled elsewhere.  There is no
strong need to have the *actual* objects created in advance.

Another pattern is to create a single global instance of an object in an initializer, like so:

```ruby
# config/initializers/return_processor.rb
RETURN_PROCESSOR = ReturnProcessor.new(
  ENV["RETURN_PARTNER_URL"],
  ENV["RETURN_PARTNER_USERNAME"],
  ENV["RETURN_PARTNER_PASSWORD"]
)
```

Classes then know that if they need a `ReturnProcessor`, they use the pre-configured global instance
`RETURN_PROCESSOR`.

These last two might feel gross, but ask yourself honestly if the problems are real, or just related to some sense
of purity.  Yes, global variables can be problematic, but if your application only has a few objects that are
difficult to create, isn't this a better solution than setting up dependency injection everywhere?

The point is, it's a tradeoff.  The "principle" that tells you to always invert dependencies and always use
dependency injection is not always the right advice for every situation.  If it's more valuable to have your
code's behavior be very explicit, and to see directly what uses what, abstracted dependency injection will be a
problem. If, on the other hand, you want there to be a consistency to how all classes are designed, at the cost of
some overall system understandability, that's OK, too.

Understand the tradeoffs and make the choice based on your needs and values, SOLID principles be damned!

If you simply "depend on abstractions" only, you aren't looking at the whole picture—you aren't doing design work,
   and you will miss tradeoffs that could be important to the success of your application or team.

For me, it's always better to build for what you need, and add flexibility when it's needed, not because you might
need it. And if your classes need to be flexible in order to testable…great! Just say so!

My advice: **Inject dependencies if you have to, and be honest about why you are doing it. Otherwise, do not add
flexibility that you do not need**
