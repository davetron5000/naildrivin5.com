--- 
title: Deconstructing the Scala Map Literal
layout: post
---

I find that Scala is one giant <a href="">Rube Goldberg Machine</a> that manages to do something not easily be done otherwise.  By this I mean that Scala has many features that, by themselves, seem very strange, but, in combination, enable some very cool functionality.  This is why I initially started my <a href="http://www.naildrivin5.com/scalatour/index.html">personal tour of Scala</a>.  I read stuff like <a href="http://www.naildrivin5.com/scalatour/wiki_pages/ExplcitlyTypedSelfReferences/index.html">explicitly typed self-references</a> and was left scratching my head.



I thought it might be fun to deconstruct the "map literal" in Scala and observie how the features interact to create a very handy piece of code that isn't baked into the language.  This assumes and understanding of some <a href="http://www.naildrivin5.com/scalatour/wiki_pages/ScalaBasics/index.html">Scala basics</a>.



Although Java 7 is getting map literals, Scala already has it (or so it appears):

```scala
val band = Map("Dave" -> "Bass",
                "Tony" -> "Guitar",
                "Greg" -> "Drums")
```

This is not actually a literal, but enabled by Scala features to make it look like a literal.  Which means that you can use these facilities to make your own literals.  So, how does this work?



Most surprising to a Java programmer is the <code>-&gt;</code> operator.  This makes use of two Scala features:
<ul>
    <li><a href="http://www.naildrivin5.com/scalatour/wiki_pages/ScalaOperators/index.html">Operator-like method naming</a></li>
    <li><a href="http://www.naildrivin5.com/scalatour/wiki_pages/ImplicitConversions/index.html">Implicit Conversions</a></li>
</ul>



It turns out that the <code>-&gt;</code> operator is on the class <code>Predef.ArrowAssoc</code>.  <code>Predef</code> is automatically imported in every Scala program, so you don't need to prefix anything with <code>Predef</code>.  It returns a tuple of its caller and its argument, e.g.

```scala
val dave = new ArrowAssoc("Dave")
val entry = dave -> "Bass"
// entry is now ("Dave","Bass")
// which is a Tuple2[String,String]
```



Of course, we aren't creating <code>ArrowAssoc</code> instances anywhere, so how does this get called?  This is where implicits come in.  Suppose we change our simple example to:

```scala
val dave = "Dave"
val entry = dave -> "Bass"
// entry is still ("Dave","Bass")
// which is a Tuple2[String,String]
```

Here, Scala sees that the method <code>-&gt;</code> needs to be called on an <code>ArrowAssoc</code>, but is being called on a <code>String</code>.  Instead of giving up, Scala notices the method: 

```scala
implicit def any2ArrowAssoc[A](x: A): 
  ArrowAssoc[A] = new ArrowAssoc(x)
```

This means that anything at all can be converted into an <code>ArrowAssoc</code> if there's some reason to.  And we have a reason to here.



This means our code is now effectively:

```scala
val band = Map(("Dave" , "Bass"),
                ("Tony" , "Guitar"),
                ("Greg" , "Drums"))
```

It's not hard to imagine a <code>Map</code> constructor taking <code>Tuple2</code>, using the first part as the key and the second part as the value, however where is the constructor?  Scala creates objects via the <code>new</code> keyword, just as Java does.  So, what's going on here?



This use two additional Scala features:
<ol>
    <li><a href="http://www.naildrivin5.com/scalatour/wiki_pages/ScalaBasics/index.html#Literals_and_Syntactic_Sugar"><code>apply()</code>
        shortcutting</a></li>
    <li><a href="http://www.naildrivin5.com/scalatour/wiki_pages/ScalaObject/index.html">Scala singleton objects</a></li>
</ol>
This is much simpler to decode than the <code>-&gt;</code> method; there is simply an object in scope named <code>Map</code>, and it has an <code>apply</code> method that takes a variable list of <code>Tuple2</code> objects.  Scala interprets a method-call syntax on an object, but lacking a method name, as a call to the <code>apply</code> method of that object (if it exists).  So, removing this, we have:

```scala
val band = Map.apply(("Dave" , "Bass"),
                      ("Tony" , "Guitar"),
                      ("Greg" , "Drums"))
```



That's all there is to it!  A few things to note about this:
<ul>
    <li>Without the application of some Scala features, it's pretty ugly</li>
    <li>The language itself didn't need to implement a special "map literal"; it simply combines smaller features
    in a way to make it appear as though it does.  You can even create your own "literals" rather than waiting for
    the language to implement them</li>
</ul>


