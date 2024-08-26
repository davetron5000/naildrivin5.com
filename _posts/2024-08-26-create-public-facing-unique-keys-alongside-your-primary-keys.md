---
layout: post
title: "Create public-facing unique keys alongside your primary keys"
date: 2024-08-26 9:00
ad:
  title: "Fix Your Dev Environment"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

[Peter Shilling][schpet] wrote a [blog post][post] about generating what he calls "cool ids" for models in Rails. Instead of numbers, models have an id prefixed with its type, like `cus_abcdefg1234` for a customer. I like the idea, but don't think these ids should be used as primary keys.  External IDs are incredibly useful for a lot of things, but they aren't great as primary keys.  I'll explain what public-facing external IDs are, how to make them, and why they shouldn't be your primary keys.

[schpet]: https://mastodon.social/@schpet
[post]: https://schpet.com/note/cool-id

<!-- more -->

<figure class="fr">
<img src="/images/stripe_ui.png" style="border: solid thin gray; padding: 0.25rem; border-radius: 0.25rem" width="400" alt="Screenshot of Stripe's Admin UI showing the ID for a payment intent">
<figcaption>Screenshot of Stripe's Admin UI showing the ID for a <em>payment intent</em></figcaption>
</figure>
Stripe's admin UI surfaces identifiers for various entities, but these identifiers aren't numbers, nor are the UUIDs. They are values
like `cus_734t8wri4thugiuh` or `pi_4t98yerihrsdf`.  The bit before the underscore tells you what sort of thing it is (a customer, and payment intent, respectively), and the remainder is a unique value.  I'm going to call these *external IDs* since, from Stripe's perspective, they are being shared externally.

I've come to realize that you should almost always create external IDs for your database tables, and that they should be prefixed with
a type identifier, but not be used as the primary key for your tables.

## What's So Great about External IDs?

When data is in a database, there is often need to refer to it outside whatever systems are built to manage it.  For example, a
customer service agent may need to ask an engineer about a particular customer, and they need to do that unambiguously.  Sharing
personal details like email or name is not a great practice and it's often imprecise.

In a typical Rails app, you'd see the database primary keys in URLs, like `admin.example.com/customers/1234`.  The internal team will
start using these ids, e.g. "Hey Pat, can you figure out why customer 1234's password resets aren't working?".  There are many
downsides to this, but a big one is that if you see the value `1234` out of context, it's hard to know what it is.

Even if everyone is dilligent about providing context, mistakes can get made.  Imagine a URL like
`admin.example.com/customers/1234/orders/4567`.  If someone isn't careful, they may copy the `4567` and refer to that as a customer
ID.

External IDs that are prefixed with a type eliminate this problem.  Instead of a customer ID being a number, it starts with a prefix
telling you what it is, e.g. `cus_1234`.  That way, if the order ID is copied mistakenly, it will be obvious that it isn't a customer
ID, since it would look like `ord_4567`.

While you could certainly create these ids as derived fields, as below, you don't want to.

```ruby
class Customer
  # Don't do this - see below
  def external_id = "cus_#{self.id}"
end
```

Even though this value is not the primary key, it's derived from it and thus, you are sharing the primary key externally, which should
be avoided.

## Primary Keys Should Not Be Externalized

Exposing primary keys has a lot of downsides and pretty much no upside (especially when see how straightforward it is to have an
external ID).  Most systems use numeric, monotonically increasing values for primary keys. This opens up any URL containing them to an
enumeration attack, where a threat actor will just increase the number they see hoping to find a value they can access but shouldn't.

Numeric keys can also expose business metrics.  If you get a receipt with your customer ID on it, and that ID is, say, 123987, you
can likely surmise the company has at least 100,000 customers.

You can certainly mitigate these problems by using UUIDs for your primary keys, however UUIDs still won't address the most pernicious
of issues, which is shadow processes using the IDs.

A good rule of thumb is that any data you externalize—even to internal users—is likely to be input into another system or process that you may not control…or even know about.

<aside class="pullquote">
Any data you externalize is likely to be input into another system or process you don't control.
</aside>

This means that the values you've set up to ensure referential integrity (i.e. keeping your database consistent and correct) are now coupled to systems and processes you may not be able to change.  I had a job once where primary keys were used in other systems and when our database's key ended up rolling over to a sixth digit, all hell broke loose in these heretofore unknown other systems.

It's this last issue which is why you should create clear separate between columns in your database.

## External IDs are Keys, Just Not Primary Ones

<div data-ad></div>

The word "primary" in "primary key" is there for a reason. It implies the existence of many keys, with one being used most of the time. But you can have many other keys as needed by the engineering team, database administrator, or business owners.

For example, many systems require unique email addresses.  This is a key, even if not the primary one (and, if the business no longer requires unique emails, this key is no longer a key—good thing it wasn't your primary key :).

An external ID is just another key you can use to uniquely identify a row. But, critically, it doesn't serve *any other purpose*
inside the database. It's not used as a foreign key, and it doesn't encode any domain information.  This means you can be relative
safe exposing it as a unique identifier for any reason.

This allows you to change it if you needed to, or move what table it's a part of.  If your primary keys were being shared or exposed, both of those operations would be difficult or impossible.

## External IDs in Practice

There are many ways to generate external IDs.  In Rails, you can use `before_save` to ensure the value is there:

```ruby
class Customer
  before_save do |record|
    if record.external_id.blank?
      hex_id = SecureRandom.hex
      record.external_id = "cus_#{hex_id}"
    end
  end
end
```

Note that there gems like the aforementioned [cool\_id](https://github.com/schpet/cool_id) or [external\_id](https://github.com/dimroc/external_id) that you should consider or at least copy to make this mechanism easier to manage and use.

If you are using Postgres, you can use database triggers instead. First, define a function that generates the ID. It accepts a single
argument, which is the prefix (yes, Postgres' programming language is super weird):

```sql
CREATE FUNCTION generate_external_id()
RETURNS trigger AS $$
BEGIN
  NEW.external_id := TG_ARGV[0] || '_' || md5(random()::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
;
```

Then, for any table you create, you'll use this to create a trigger:

```sql
CREATE TRIGGER
  customers_external_id
BEFORE INSERT ON
  customers
FOR EACH ROW
EXECUTE PROCEDURE generate_external_id('cus');
```

I don't think Rails has a way to do this directly, but you can wrap any SQL in a call `execute(...)` inside a migration. You can also
wrap this into a method you can call inside a migration to avoid copying and pasting this boilerplate.

Once the external IDs are being inserted into the database, you'll want to use them to e.g. build URLs.  In Rails, URLs are built from Active Records and Active Models via the `to_param` method:

```ruby
class Customer
  def to_param = self.external_id
end
```

`external_id` will show up by default when you call `to_json`, but you may want to omit `id` from that payload to avoid leaking the ID
you are working to protect.  You can do that by overriding `serializable_hash`:

```ruby
class Customer
  def serializable_hash(options=nil)

    default_options = { except: :id }

    options = if options.nil?
                default_options
              else
                # Allow params to override our defaults
                # to preseve the method's expected behavior
                default_options.merge(options)
              end
    super(options)
  end
end
```

Lastly, you'll want a way to locate records by this id.  You can certainly do `Customer.find_by!(external_id: params[:id])`, however
you could also override `find`:

```ruby
class Customer
  def find(*arguments)
    if arguments.size == 1
      customer_by_external_id = find_by(
        external_id: arguments.first
      )
      if customer_by_external_id.present?
        return customer_by_external_id
      end
    end
    super(*arguments)
  end
end
```

This would preserve `find`'s behavior on the primary key, but also allow looking up by the external id, too.  I've done this before, but now feel it's better to use `find_by!(external_id:)` to be more explicit about what's going on.

You can extract all of this behavior to a module or put it into `ApplicationRecord`.



