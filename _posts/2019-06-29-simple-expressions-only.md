---
layout: post
title: "Coding without (many) Expressions"
date: 2019-06-29 9:00
---

In the imagined [Timeline Programming Language][timeline], there are some unusual restrictions on the type of code
you can write.  I thought might be worth seeing if they can help us with real code.  I find that when you apply
constraints to your work, you often get forced into novel solutions, and occasionally even superior ones.  So
let's take Timeline's restrictions on expressions.  In Timeline, you cannot have a compound or nested expression,
and the *only* thing you can do with an expression is assign it to a variable. You cannot use them in control
structures, return statements, or method invocations.

[timeline]: https://timeline-lang.com

<!-- more -->

The thinking behind this rule is to decrease the density of every line of code, as well as to force the programmer
to name each part of potentially complex expression.  We've probably all written this sort of code before:

```ruby
expiration_time = now + ( 60 * 60 * 24 * 4) # 4 days from now
```

Under Timeline's rules, you'd have to do this:

```ruby
one_hour        = 60 * 60
one_day         = one_hour * 24
four_days       = one_day * 4

expiration_time = now + four_days
```

What's interesting here is that the line of actual logic (the last one) says exactly what's happening.  And
rather than have to play computer in your mind and pattern match on 60, 24, and 4, the code tells you what each
thing is.  But, it is a lot more lines of code.  However, it's pretty clear what code to extract into another
function now:

```ruby
def num_days(num)
  one_hour        = 60 * 60
  one_day         = one_hour * 24

  num_days = one_day * num

  return num_days
end

# ...

four_days       = num_days(4)
expiration_time = now + four_days
```

Interesting.  Let's try some more real code.  The [RailsApps](https://github.com/RailsApps) GitHub org has a lot
of sample Rails applications.  Let's look at the `show` method of the `users_controller` of the [rails-stripe-checkout app](https://github.com/RailsApps/rails-stripe-checkout/blob/master/app/controllers/users_controller.rb#L9-L16):

```ruby
def show
  @user = User.find(params[:id])
  unless current_user.admin?
    unless @user == current_user
      redirect_to root_path, :alert => "Access denied."
    end
  end
end
```

Can you tell what this method does?  Can you tell why it exists and has any code at all?

Let's turn it into Timeline-style.  To be explicit about the rules:

* All expressions are of the form

  ```
  «variable or literal» «operator» «variable or literal»
  ```
  so no unary stuff like `!foo` and no compound or nested expressions
* Control structures may only use variables or literals. Expressions cannot be inlined
* There is no `unless` control structure - only `if`

Given this, we have several violations, namely the two `unless` constructs (but also `params[:id]`).  Let's extract their expressions into variables.

```ruby
def show
  user_id = params[:id]
  @user   = User.find(user_id)

  current_user_is_not_admin = current_user.admin? == false
  if current_user_is_not_admin
    user_resource_is_not_current_user = @user != current_user
    if user_resource_is_not_current_user
      redirect_to root_path, :alert => "Access denied."
    end
  end
end
```

OK, hard to see that this is an improvement, but we can get rid of one of the `if` statements by making another
expression:

```ruby
def show
  user_id = params[:id]
  @user   = User.find(user_id)

  current_user_is_not_admin = current_user.admin? == false
  user_resource_is_not_current_user = @user != current_user

  access_denied = current_user_is_not_admin && 
                  user_resource_is_not_current_user

  if access_denied
    redirect_to root_path, :alert => "Access denied."
  end
end
```

What's interesting is that we were forced to give a name to the ultimate bit of logic in this method, i.e. we had
to come up with one name that encompassed both of our checks.  The use of the `access_denied` variable makes it
pretty clear what we're trying to do here - deny access.  That was not as obvious to me in the original.

One thing I don't like is the use of “not” in the variable names.  It feels backwards (this is probably related to why the original author used `unless`).

Let's remove them and rewrite the logic to be more positively focused:

```ruby
def show
  user_id = params[:id]
  @user   = User.find(user_id)

  current_user_is_admin         = current_user.admin? == true
  user_resource_is_current_user = @user == current_user

  access_granted = current_user_is_admin || 
                   user_resource_is_current_user

  if access_granted
    # render as normal
  else
    redirect_to root_path, :alert => "Access denied."
  end
end
```

Interesting!  Now, the logic is so painfully obvious you can't miss it:  to show the user identified by the `id`
param, you either have to be an admin or the user has to be you.

This code now works pretty well at both demonstrating programmer intent (“if access granted, render normally,
otherwise redirect back to root”) as well as making it clear what the code will actually do (since it walks
you through it step by step).

Of course, it's way more verbose than before, but I'm not so sure this is a bad thing.  Pretty much anyone could
understand this code making it [more inclusive](/blog/2018/02/02/explicit-code-is-inclusive.html)

Next time you find yourself in some dense code filled with expressions, try applying these constraints to it and
see what happens.  It also goes to show that sometimes constraints on how we write code can led to better
solutions.

