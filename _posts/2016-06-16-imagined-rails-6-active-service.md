---
layout: post
title: "Imagined Rails 6: Why A Service Layer?"
date: 2016-06-16
---

This is a series of posts about [why I recommended the changes I did for Rails 6][rails6-why-intro], in my [imagined keynote
for Rails 6][rails6post].

In this one, we'll explore why I think having explicit support for creating non-model service objects would be a good thing.

<!-- more -->

I hypothesized ActiveService, which is a lightweight library that basically allows you to specify the dependencies of an object to other objects.

For example, if you have code to charge a customer some money, that code depends on your payment processor's Ruby library and also on your Rails mailer (to email a receipt).  Rather than simply use those two classes directly, you'd use Active Service's imagined DSL:

```ruby
class Purchaser < ActiveService::Base
  needs :braintree
  needs :receipt_mailer

  def purchase!(order)
    if braintree.charge_card(order.customer,order.amount)
      receipt_mailer.receipt(order).deliver!
    end
  end
end
```

This is admittedly not very Ruby and *definitely* not very Rails.  I also think this part of my imagined keynote has the weakest evidence to justify it.  But, I did want to talk about why I think this is useful, despite this not being very idiomatic Ruby.

Rails (and Ruby) code tends to involved hard-coding inter-object dependencies, usually by directly referencing global symbols.  In theory, this is bad because if you need to modify those dependencies it's difficult to do.  It's also bad, in theory, because it makes testing more difficult.

In practice, neither of these are real problems.  Ruby allows you to easily mock/stub/replace hard-coded dependencies in tests, and I've rarely encountered a case where the primary problem in making a change was in modifying a dependency on another class.

As a way to author classes, I don't think Active Service is super-compelling.  I think it has some small benefits, and I would use it if it existed, but generally for the production code, it's not a big win.

Where I think it *could* be a big win is for testing.

Because our class' dependencies are made explicit, the testing framework can examine them and set up mocks/stubs/doubles/whatevers.

In theory, the test support included with ActiveService would be able to example a class' dependent objects, look at their type, and stub out all their methods.  It could then allow the test author to make assertions about how those methods were called (and, of course, control what they do to orchestrate a test).

This should be a superior experience to using a mocking framework, since it would be baked into Rails and would be default behavior.  It would also encourage test isolation, basically by making it really hard to write an integration test-masquerading-as-a-unit test.

This somewhat flies in the face of what I had discussed about resource-orientation.  The existence of Active Serivce sends the message "code doesn't go in model objects".  I believe this very strongly, but it's not The Rails Way.


[rails6-why-intro]: http://naildrivin5.com/blog/2016/06/12/why-did-i-recommend-XX-for-rails-6.html
[rails6post]: http://naildrivin5.com/blog/2016/05/17/announcing-rails-6-an-imagined-roadmap.html
