--- 
wordpress_id: 78
title: Java Annotations - Java's love of configuration over convention
wordpress_url: http://www.naildrivin5.com/daveblog5000/?p=78
layout: post
---
In the beginning, EJB was a bloated mess of XML configuration files that allowed some sort of ultimate flexibility that absolutely no one needed nor cared about.  And it sucked.  So developers started using conventions to keep track of the four classes required to make a remote method call, and XDoclet was created to automate the creation of the XML configuration files.  And it sucked less.  Following in EJB's footsteps, Hibernate did the same thing.  And XDoclet followed.  And it still sucked. 



So, annotations were created to essentially formalize what XDoclet was doing, instead of considering how horribly broken the implementation of J2EE or Hibernate was.  And now that we have annotations, the "implementation pattern" of "ultimate flexibility through annotations" has made its way into numerous Java frameworks, such as JAX-RS and JPA.


Regarding JPA:

```java
@Id
@GeneratedValue
@Column(name="person_id")
public int getPersonId() { return personId; }
```

This is not a significant improvement over XDoclet; the only benefit is if you mistype "GeneratedValue", the compiler will catch it.  I shouldn't have to type "GeneratedValue" in the first place.  Unless I'm doing something non-standard.  Which I almost never do.



I have a <code>Person</code> class with a <code>getPersonId</code> method.  Can JPA just assume that it maps to the <code>PERSON</code> table, and the <code>PERSON_ID</code>, respectively.  Further, couldn't it figure out that it's the auto-generated primary key since the schema says <code>primary key auto increment</code>.  All the information is there and available to the framework to figure this out.



The same goes for EJB.  I have a class named <code>FooStatelessBean</code>.  How about we assume it's a stateless session bean, and it's interface is defined by its public methods?  It can then provide <code>FooRemote</code> and <code>FooLocal</code> for me, and I don't need to configure anything or keep three classes in sync.



Just because Java doesn't have all the Ruby dynamic magic doesn't mean we can't make things easy.  In reading <a href="http://www.suryasuravarapu.com/2009/03/rest-crud-with-jax-rs-jersey.html">Surya Suravarapu’s blog post about CRUD via JAX-RS</a> I can't help wondering why it takes so much code to call a few methods on a class?



Did the designers of JAX-RS not even <b>look</b> at how Rails does things?  I get a <code>PUT</code> to the url <code>/customers/45</code>.  We should default to calling <code>put(45)</code> on the class <code>CustomersResource</code>.  Only if I want to obfuscate what's going (e.g. by having <code>FooBar.frobnosticate()</code> handle the request) should I be required to provide configuration.

Even in Surya's example code, he's following some conventions: His resource class is suffixed with <code>Resource</code> and his <code>POST</code> method is prefixed <code>add</code>.  This should be baked into the spec.  It's like EJB all over again with the common conventions that aren't supported by the framework because of too much useless flexibilty.



Supporting convention over configuration is easy in Java.  In just a few hours, <a href="http://github.com/davetron5000/fwf/tree/master">I had a tiny web framework</a> that proves it<sup>1</sup>.  It wouldn't take much more effort to allow the default behavior to be overridden, but, unlike JAX-RS, EJB, or even the Servlet spec itself, it doesn't punish developers who follow conventions.  It makes their lives easier and thus encourages good behavior.



So, the point of all this is that annotations encourage bad framework design; unnecessary configuration is a major part of many Java frameworks and specs.  And I have no idea why.

<hr />

<i><sup>1</sup>it unfortunately breaks down at the UI layer, due to a statically typed and compiled language not being a great choice for implementing web UIs, but that's another issue.</i>

