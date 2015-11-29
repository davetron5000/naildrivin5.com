# The Case for Using a Front-End Web Framework

You need a front-end framework for your web application.  When working in front-end, you want all the tools and techniques available to
you when working on the back-end, and a framework (home-grown or not) is how that happens.  To say that a front-end framework isn't
needed for a web _application_ is to say a back-end framework isn't needed.  The former is much more controversial than the latter, and I
can't think of a good reason why.

First, let's state a few assumptions.

* When solving a user's problem, you want to work at the level of abstraction closest to the problem.
* You should be able to apply basic software engineering pricinples to your front-end code, such as functional decomposition (the general form of “method extraction” or “class extraction”).
* Your front-end code should be unit-tested.

In other words, you want working in your front-end code to be similar to how you work in your back-end code.

## Working at the user's level of abstraction

Considering the back-end code, it's responding to an HTTP request.  This is a low level of abstraction, and writing code like this is
going to get tedious:

```ruby
if ENV["DOCUMENT_URI"] =~ /\a\/users/
  if ENV["CLIENTMETHOD"] == "GET"
    # ...
  elsif ENV["CLIENTMETHOD"] == "POST"
    # ...
  else
    puts "HTTP/1.x 404 Not Found"
  end
elsif ENV["DOCUMENT_URI"] =~ /\a\/products/
  # ...
else
  puts "HTTP/1.x 404 Not Found"
end
```

What you _want_ is to be able to say "here is the code for showing me a specific user, here is the code for creating a new user, and here
is the code for listing all the products"

```ruby
class UsersController
  def show
    # show one user
  end

  def create
    # create a user
  end
end

class ProductsController
  def index
    # list all products
  end
end
```

This is what a framework gives you.

Thinking now to the front-end, what is the level of abstraction you get with vanilla JavaScript or jQuery?  You get an API based around
locating DOM elements, modifying them, and interacting with events.

```javascript
$(".ok-button").click( function() {
  $.ajax(url: "/users/1234",
         method: "DELETE",
         success: function() {
           $(".message-area").text("User deleted!");
         },
         error: function() {
           alert("Problem from backend");
         });
});
```

This is a *very* low-level of abstraction.  What we _want_ to be able to do is say "here is the code for confirming the deletion of a
user, here is how we delete users".

```javascript
var User = $resource("/users/:id")
var onConfirm = function(id) {
  User.delete(id,function() {
    notify("User deleted!");
  }
};
```

To make this happen using vanilla JavaScript (or jQuery) you either have messy code, or you have to create helper functions and adopt
conventions around how you use these APIs.  The result starts to look like a framework.

Taking messy low-level code and creating higher levels of abstractions is a form of functional decomposition, and this is something you
want to be able to do to manage your front-end code.  When it gets too complex, too messy, or has re-usable parts, you want to rearrange
things to re-use them.

## Apply Basic Software Engineering Principles

Regardless of what _principles_ you want to apply, it's likely that you do _something_ to manage the complexity of your code.  You
extract functions to re-use them.  You extract classes to make some code easier to understand.  Whatever you do, you want to do that with
your front-end code.

In JavaScript, you have two basic options:

* Assign extracted functions or objects to global variables and reference them.
* Pass extracted functions or objects to the code that needs them.

For example, we imagined a `User` objects that would allow us to access users via AJAX.  We used it in the `onConfirm` method:

```javascript
var onConfirm = function(id) {
  User.delete(id,function() {
    notify("User deleted!");
  }
};
```

This creates a tight coupling between our `onConfirm` method and the `User` global variable.  This is not generally seen as a good
pattern, and leads to all sorts of problem.  It makes `onConfirm`  hard to test, because it will execute `User`.  It requires that `onConfirm` change whenever `User` changes.

The alternative is to pass it into `onConfirm`:

```javascript
var onConfirm = function(id,userRepository) {
  userRepository.delete(id,function() {
    notify("User deleted!");
  }
};
```

This is not ideal because now every user of `onConfirm` must pass in `User`.  We can solve this by using a closure:

```javascript
var confirmer = function(userRepository) {
  return function(id) {
    userRepository.delete(id,function() {
      notify("User deleted!");
    }
  }
};
var onConfirm = confirmer(User);
```
