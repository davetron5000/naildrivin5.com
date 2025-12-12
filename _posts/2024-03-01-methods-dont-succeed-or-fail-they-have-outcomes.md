---
layout: post
title: "Methods Don't Succeed our Fail: they Have Outcomes"
date: 2024-03-01 9:00
ad:
  id: "sus-dev"
related:
  - "A Framework for Product Design Beyond the Happy Path"
  - "An Alternative View on Avdi's Barewords Video"
  - "Coding without (many) Expressions"
---

On Matstodon, Peter Solnica [posted some Ruby pattern-matching code](https://hachyderm.io/@solnic/112014327632225638), asking what Rails devs think about it.  While pattern matching is interesting, I think I still prefer `if` statements based on return objects.  But, I also think the "success/failure" dichotomy is unnecessary, confusing, and often a modeling error.

<!-- more -->

Peter's code example is as follows:

```ruby
def create
  create_user = Commands:: CreateUser.new

  case create_user.call(params[:user].to_unsafe_h)
  in Success(User => user)
    redirect_to users_url, notice: "User was successfully created."
  in Failure(user: user, errors: errors)
    render :new, locals: 1 user: user, errors: errors }
  in Failure(type: :exception, reason: :database)
    redirect_to users_index_url, notice: 'Something went wrong'
  end
end
```

In follow up comments, there were ideas expressed that the method "succeeded or had various failures", or that you can in theory
compose such results and execute more logic only on success.

I find that treating both "the website visitor provided invalid data" and "the database had a problem" as two variants of a
failure to be a problem.  Invalid data provided by a user, then fed back, is a success, even if the user has more work to do. That is much different from a database issue the user has no way to avoid or fix.

## All Methods Should Be Successful

A method either raises an exception or it doesn't. If it doesn't, it succeeded.  *The method call* succeeded.  This is distinct
from the outcome of the business process the method implements.  Such business process often aren't as simple as "success or
failure", and modeling them as if that is true (and always will be) is a design error.

It's true that *many* business processes either complete some workflow or cannot due to a user-correctable problem. But, not all.
And those that do, often change over time.

When initiating a business process, I find it much easier to model the code when I stop thinking about "success" or "happy path"
or "edge case" and instead consider possible outcomes.  Just because one outcome is favorable to the business does not mean it is
the only one, or deserves special treatment (if anything, outcomes where the user must understand complex information and re-attempt their action deserve more special treatment).

This allows a more clear modeling in the code itself:

* A method invocation either returns something that describes the outcome it achieved…
* …or it raises an exception.

A method's outcome could be one of many possible things, depending on what the caller requires.  These outcomes can be modeled
using object-orientation and nominal ("duck") typing:

```ruby
def create
  create_user = Commands:: CreateUser.new

  result = create_user.call(params[:user].to_unsafe_h)
  if result.created?
    redirect_to users_url, notice: "User was successfully created."
  else
    @user = result.user
    render :new
  end
end
```

If a third outcome is needed, perhaps some new users must be reviewed before being officially created, the result object's type
can be enhanced:

```ruby
  def create
    create_user = Commands:: CreateUser.new

    result = create_user.call(params[:user].to_unsafe_h)
    if result.created?
      redirect_to users_url, notice: "User was successfully created."
→   elsif result.in_review?
→     redirect_to users_url, notice: "User must be reviewed, first."
    else
      @user = result.user
      render :new
    end
  end
```

Note that because `result` is a rich object, we are free to define the meaning of its methods how we like.  It could be that a
user that is valid but requires review is still considered `created?`. If that were true, we would not have had to modify the
method above at all.  The additional outcome—and data about it—allows us to give a different user experience if we wanted to. This is the clear benefit over using, say, a boolean.

Pattern-matching could be used instead of `if` statements, since Ruby will raise `NoMatchingPatternError` if a new pattern is
returned that isn't matched.  The return objects' implementation of `===` can be as sophisticated as needed to provide flexibility—or not—in handling all outcomes. Keep in mind that `if` statements are [far more accessible and inclusive](https://buttondown.email/davetron5000/archive/thinking-in-systems-code-compactness-and/), so you'd have to balance that against the behavior of pattern matching.


Coercing all methods into a boolean "success/failure" dichotomy doesn't solve a real problem— it creates confusion. It also leads
inexperienced developers to work in an inefficient way. They focus on the so-called "happy path", and then later bolt on the
"edge cases". [There is no happy path](https://multithreaded.stitchfix.com/blog/2016/01/29/no-happy-path-in-programming/).
You're much better served by approaching the design of your code with *all* requirements, not just the one that aligns with what
the user (or business) is trying to achieve.

## Levels of Abstraction

In [A Framework for Product Design Beyond the Happy
Path](https://naildrivin5.com/blog/2022/08/15/product-design-beyond-the-happy-path.html), I outline how a user may think about a
product's features and how the various possible outcomes are handled within the product design, code, and organization.

When writing code to provide a new feature, it's useful to differentiate three broad levels of abstraction:

1. What is the user trying to achieve?
2. How does the business logic code handle this?
3. How does the system manage the code?

<div data-ad></div>

The user is trying to achieve something, but there are multiple outcomes to their attempt to do so, many of which require them to
take action: they want to create a new record, but if they provide invalid data, they must understand and correct the problem.


The *business logic code* then must handle this directly.  The code cannot simply focus on the successful creation of data. It has to model invalid data—and a user's attempt to correct it—explicitly as a first class concept.  Creating both valid and invalid data are on equal footing, and the code must be designed for this situation.

The *system* however, must handle literally anything else.  This could be showing a nice 500 page for an unhandled exception, or
it could initiate some other customer-service flow.  But the overall system handles anything the business logic code can't
handle. For example, if there was a database error unrelated to the data the user is trying to save.

*(You can imagine these levels are somewhat fractal as abstractions become layered in the app, but the premise still applies)*

There are only two places where the notions of "success" and "failure" map directly to actual concepts:

* If the user *abandons* their attempts to save valid data, they have failed. If they provide invalid data 1,000,000 times, but
then provide valid data the 1,000,001<sup>st</sup>: they succeeded.
* If the business logic code never returns, but instead raises an exception, it failed.

When you write code from this perspective, you won't have a ton of boolean checks, null checks, or anything like that. Your code
will have explicit checks for specific outcomes.  Such code is, in my experience, a lot easier to understand and debug. It's also
more approachable to more people, which improves the system in which you and your app exist.


