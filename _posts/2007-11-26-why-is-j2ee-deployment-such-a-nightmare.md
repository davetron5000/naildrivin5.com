--- 
wordpress_id: 28
title: Why is J2EE/JBoss configuration such a nightmare?
wordpress_url: http://www.naildrivin5.com/daveblog5000/?p=28
layout: post
---
I'm glad EJB3 has come along, because it has vastly simplified what you must do to get a J2EE application up and running.  It's not 100% smooth, but it's a step in the right direction.

That being said, anything beyond simple EJBs and Persistence objects is just such a clusterfuck of configuration, dependencies, undocumented magic strings, masked error messages and XML abuse.   Why was XML chosen as a configuration format for what is basically a properties file.  What is the advantage of this:


```xml
<mbean name="big.fucking.long.whatever">
<attribute name="SomeProperty">some value</attribute>
<attribute name="SomeOtherProperty">another value</attribute>
<attribute name="TimeWastedTypingAngleBrackets">10 hours</attributes>
<attribute name="MoneyWastedPayingForXMLSpy">$10000</attribute>
</mbean>
```

over this:

```properties
big.fucking.long.whatever

SomeProperty=some value
SomeOtherProperty=another value
TimeWastedTypingAngleBrackets=0 seconds
MoneyWastedPayingForXMLSpy=$0
```

It seems to me that if all we are doing is configuring a set of properties and values, a format similar to the windows <code>.ini</code> format would be much prefered.  And, honestly, if we can't do better than Windows, what the fuck.  I guess one thing all three formats have in common is that you have no fucking idea what the attributes mean, which are required or what will happen at runtime.  

If you are lucky, you have the mbean source or javadoc (don't forget to look for <code>is</code> to precede boolean properties and <code>get</code> to precede all others!)  Also, fucking this up generated an Oracle-quality error message from JBoss: "Attribute SomeProperty not found".  So, are you <i>looking</i> for SomeProperty and didn't find it, or did you <i>get</i> it and not want it?

Of course, we could, actually, leverage the power of XML and tools like <a href="http://dtddoc.sourceforge.net/">DTDDoc</a> and <a href="http://xframe.sourceforge.net/xsddoc/index.html">XSD Doc</a> and do something like this:

```xml
<mbean name="big.fucking.long.whatever">
<SomeProperty>some value</SomeProperty>
<SomeOtherProperty>another value</SomeOtherProperty>
<TimeWastedTypingAngleBrackets>10 hours</TimeWastedTypingAngleBrackets>
<MoneyWastedPayingForXMLSpy>$10000</MoneyWastedPayingForXMLSpy>
</mbean>
```

This, if backed by a schema, would actually be a nice way to document (and enforce) configuration.

Bonus points to Hibernate for allow properties <b>or</b> XML <b>or</b> MBean configuration and for having the property names <b>different in each fucking format</b>.  It seems like a lot of extra work to make them all different.

I'm not saying I want a Microsoft Enterprise Application Wizard, but a little common sense could go a long way.

