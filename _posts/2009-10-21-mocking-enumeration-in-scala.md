--- 
title: Mocking Enumeration in Scala with EasyMock
layout: post
---
I'm working on a Scala url shortener (to be hosted at my awesomely problem-causing &#10106;&#10144;.ws domain).  Since this is such a small application, I'm rolling it ground-up from the Servlet spec only, to get a feel for Scala without having to worry about a lot of dependencies.  As such, one of the things I need to do is parse the requestor's "representation", i.e. determine if I'm serving JSON, XML, or HTML.  Since this comes from the <code>Accept:</code> header, my tests will need to mock <code>HttpServletRequest</code>.

```scala
val enumeration = createMock(
    classOf[java.util.Enumeration[String]])

expect(enumeration.hasMoreElements).andReturn(true)
expect(enumeration.nextElement).andReturn("TEXT/HTML")
expect(enumeration.hasMoreElements).andReturn(false)
// the following call doesn't compile!!!
expect(request.getHeaders(parser.ACCEPT_HEADER))
  .andReturn(enumeration)
expect(request.getParameter(parser.TYPE_PARAM))
  .andReturn(null)

replay(request)
replay(enumeration)

val t = parser.determineRepresentation(request)
t should equal (Some("text/html"))
```

When I compile this test, I get the following baffling error message:

```scala
TestRepresentationParser.scala:21: type mismatch;
found   : java.util.Enumeration[String]
required: java.util.Enumeration[?0] where type ?0
    EasyMock.expect(request.getHeaders(parser.ACCEPT_HEADER))
        .andReturn(enumeration)
```

Um, OK?  I tried zillions of ways to cast things, even creating my own implementation of <code>Enumeration[String]</code>, to no avail.  There seems to be
some problem with the fact that <code>HttpServletRequest</code> returns a non-parameterized <code>Enumeration</code> in its interface, but Scala won't
let me create such a thing.

I had given up on testing this for a while, but eventually the simple solution prevailed:
```scala
EasyMock.expect(request.getHeaders(parser.ACCEPT_HEADER))
// this call is obviously not type-checked, so it works
expectLastCall.andReturn(enumeration)
```

Kinda cheesy, and I kinda feel stupid for not thinking of it sooner.  
