---
layout: post
title: "Rails Validations vs Postgres Check Constraints"
date: 2015-11-15
ad:
  title: "Use DB Constraints with Rails and Postgres"
  subtitle: "Never Worry about Your Data"
  link: "http://bit.ly/dcbang2"
  image: "/images/dcbang2.jpg"
  cta: "Buy Now $24.95"
---
Before using Postgres, I would have to rely heavily on Rails validations to ensure data integrity—MySQL simply doesn't provide the tools
to do this.  This always felt wrong.  Outside of rogue processes connecting to the database, there's also application bugs
and, well, the ActiveRecord API itself: `update_attribute` skips validation!  That means it's hard to rely on Rails validations for data
integrity, but there isn't a great alternative for creating a great user experience.

Postgres has the answer: _check constraints_.  As we'll see, check constraints are tool for _data integrity_ and work much better than
Rails validations.  But Rails validations are still a great tool for _user experience_.

<!-- more -->

## Check Constraints for Data Integrity

Suppose we have a table of users, and a user has a name and email:

```sql
create table users(
  id    int  NOT NULL,
  name  text NOT NULL,
  email text NOT NULL
);
```

<a name="back-1">
</a>
Although we've used `NOT NULL` to make sure there are values, we need more than that.  Although our domain doesn't care about first or last names, it *does* require that a user's name to be at least one letter, followed by a space, followed by at least one other letter<sup><a href="#fn_1">1</a></sup>.

We can do that by requiring that the `name` field match a regexp:

```sql
ALTER TABLE 
  users 
ADD CONSTRAINT 
  users_name_must_look_like_a_name 
CHECK (
  name ~* '^.*[a-z] [a-z].*$'
);
```

<a name="back-2">
</a>
This is saying that the `name` field must match the regular expression specified.  That regexp allows anything, as long as there is a
letter followed by a space, followed by another letter, somewhere in the string<sup><a href="#fn_2">2</a></sup>.

Now, when we insert an invalid value, it won't work:

```
> insert into users(id,name,email) values (1,'','bob@blah.com');
ERROR:  new row for relation "users" violates 
        check constraint "users_name_must_look_like_a_name"
DETAIL:  Failing row contains (1, , bob@blah.com).

> insert into users(id,name,email) values (1,'Bob','bob@blah.com');
ERROR:  new row for relation "users" violates 
        check constraint "users_name_must_look_like_a_name"
DETAIL:  Failing row contains (1, Bob, bob@blah.com).

> insert into users(id,name,email) values (1,'Bob Jones','bob@blah.com');
INSERT 0 1
```

Nice!  This means that a) our data will always match our rules around what good data is, and b) our code can rely on this.

For example, suppose we have to integrate with a third party shipping system that, for whatever reason, requires a first and last name.
Our system is designed to allow users to enter whatever their name is, as long as there are at least two parts.

Because we know our data meets its needs, we can safely do:

```ruby
user = User.find(1)
name_part1,rest_of_name = user.name.split(/\s/,2)
ShippingProvider.generate_label(first_name: name_part1,
                                last_name: rest_of_name)
```

Without the check constraints, we couldn't rely on the data being good, and so our use of `split` would have to have some sort of error
handling if the name didn't have a space in it.  Because that can never happen, our code is simpler!

OK, so what does this have to do with Rails validations?

## Rails Validations for User Experience

The equivalent of our check constraint above, using Rails Validations, would be:

```ruby
class User < ActiveRecord::Base
  validates :name, format: /\A.*[a-z] [a-z].*\z/i
end
```

Sure enough, this prevents us violating the validation:

```
> user = User.create(name: "bob", email: "bob@blah.com")
 => #<User id: nil, name: "bob", email: "bob@blah.com"> 
> user.valid?
 => false 
> user.errors
 => #<ActiveModel::Errors:0x007fcf817cc808 
      @base=#<User id: nil, name: "bob", email: "bob@blah.com">, 
      @messages={:name=>["is invalid"]}> 
```

Of course, we can route around this with ActiveRecord's methods that allow it, or by calling `save(false)`, or by just going into the
database.


**This** means that any code reading from this table must account for the bad data.

This presents us a few choices for how to deal with it:

1. Don't worry about bad data getting in there
2. Just use the check constraints
3. Use both validations *and* check constraints

Option 1 is unacceptable.  Our data is important and if our busines domain requires user names to have a letter, a space, and then
another letter, we can't simply hope for the best.  As developers, we have a duty to ensure our code meets its requirements.

Option 2 creates a poor user experience:

```
> User.create(name: "Bob", email: "bob@jones.com")
ActiveRecord::StatementInvalid: PG::CheckViolation: ERROR:  
  new row for relation "users" violates 
  check constraint "user_name_must_look_like_a_name"
DETAIL:  Failing row contains (22, Bob, bob@jones.com).
: INSERT INTO "users" ("name", "email", "id") VALUES ($1, $2, $3)
```

Assuming a user is going to be entering in their name, we need to give them a better experience than an exception. We need to use both,
which will create some duplication.

## Be OK with Some Duplication

If we use both the ActiveRecord validation *and* the check constraint, we achieve what we need: a good user experience, and ther
assurance of data integrity.  The *problem* is that this creates duplication.  We have the same regexp in two places and they both have
to be changed together.

<div data-ad></div>

While I could imagine a more sophisticated data layer handling this, we don't have one.  That means we have to live with the duplication
or sacrifice our system requirements.  For me, the job of a programmer is to make the system work properly, even if that means that the
resulting code has maintenance issues.

I am OK with this duplication.  If you think about most projects, the changes in requirements are often more about logic than data.  The
data you are storing and managing has a much more stable definition than the process that manage that data.  So, this duplication is less
likely to run afoul of bugs since it's not going to change as much as the logic around it.

That being said, you *do* have to have an understanding of what valid data is.  This means being clear about data integrity.

## What is Data Integrity?

In the example above, my assumption is that the business owning this database of users absolutely requires that each user's name have a
letter, a space, and a letter in it.  This isn't something that's required _sometimes_ or something a programmer invented, but an
_invariant of the domain_.  This is exactly what you want to encode in database constraints.

What you _don't_ want to do is encode use-case-specific constraints that are not universal to your business domain.

Suppose that in some cases, we need to have a name that's more than just a couple characters.  We can blame a third party integration
again—we need to generate an invoice and it requires a first and last name that are each two characters or more.

Since that is not a requirement of _our_ domain, we don't want this in our database.  This means we have to just deal with it:

```ruby
name_part1,rest_of_name = user.name.split(/\s/,2)
if name_part1.length > 1 && rest_of_name.length > 1
  InvoiceService.generate_invoice!(first: name_part1, last: rest_of_name)
else
  # ???
end
```

Depending on where this code is, you might handle the problem in a variety of ways.  You could create an ActiveModel that uses
validations to check for this:

```ruby
class InvoiceUser
  include ActiveModel::Validations

  attr_accessor :name, :email

  validates :name, format: /\A.*[a-z][a-z] [a-z][a-z].*\z/i

  def user
    User.new(name: self.name, email: self.email)
  end
end
```

This works as advertised:

```
> i = InvoiceUser.new
 => #<InvoiceUser:0x007ff604d80b60> 
> i.name = 'a b'
 => "a b" 
> i.valid?
 => false 
> i.name = 'aa bb'
 => "aa bb" 
> i.valid?
 => true 
> i.user.save!
 => #<User:0x007fcf817cc808>
```

We could even use this in Rails' form helpers by bringing in more Active Model modules.  This way, a user who has to enter their name as
part of some use-case to create invoices will have a good experience, but our database won't need to grow extra constraints that aren't
universally needed.


## Conclusion

Think about Rails validations as purely something for user experience.  Think about check constraints as just being about data integrity.
Often they are the same thing, but not always.  And don't fret about a bit of duplication.

_Read more in my new book [“Rails, Angular, Postgres, and Bootstrap
Powerful, Effective, and Efficient Full-Stack Web Development”](https://pragprog.com/book/dcbang2_

---

<footer class='footnotes'>
<ol>
<li>
<a name='fn_1'></a>
<sup>1</sup>I realize this is not appropriate for a lot of people's names.  This isn't a post about that, so this example is quite
simplified to to illustrate the points.  When designing a system to store people's names, put a <strong>lot</strong> of thought into it,
especially if someone outside the United States might use it.
<a href='#back-1'>↩</a>
</li>
<li>
<a name='fn_2'></a>
<sup>2</sup>This is also not a post about regular expressions.  Please craft them carefully. 
<a href='#back-2'>↩</a>
</li>
</ol></footer>
