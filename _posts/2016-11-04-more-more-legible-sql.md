---
layout: post
title: "Writing even more legible SQL"
date: 2016-11-04 9:00
---

[Craig Kerstiens](http://www.craigkerstiens.com) wrote a great short blog post about [writing more legible
SQL](http://www.craigkerstiens.com/2016/01/08/writing-better-sql/).  It's a great read on an important topic—SQL can be very hard to read
and modify—but I don't think he goes far enough about “one thing per line”, so I'd like to show how _I_ write SQL.

<!-- more -->

## Rules of Thumb

I'm kind of a nut for [code typography](http://naildrivin5.com/blog/2013/05/17/source-code-typography.html), but I think it's important enough to get right and almost always worth going a bit farther than
you'd think so code _looks_ great.

* Write your SQL to be understood and read, even at the cost of modification (no leading commas FFS).
* Keywords in all-caps.
* Align, align, align, align.
* Don't use table aliases unless required for disambiguation.
* Be consistent to a degree you never thought possible.
* Almost always one thing per line.  Exceptions are `AND` and not much else.

Craig writes:

```sql
SELECT foo,
       bar
FROM baz
```

This is not one thing per line.  This is (and is how I wold write that statement):

```sql
SELECT
  foo,
  bar
FROM
  baz
```

I treat each part of a statement like a scoping block:


```sql
SELECT
  «fields»
FROM
  «tables»
WHERE
  «where clauses»
ORDER BY
  «ordering fields»
GROUP BY
  «grouping »
HAVING
  «good ole HAVING :)»
; -- semi on the last line only if needed; usually I 
  -- omit this since it's not needed in code
```

Let's take a more extreme case, because when I say "align, align, align, align", and “be consistent to a degree you never thought possible” I'm not kidding.

Suppose we have a table `transactions` that contains credit card transactions, `users` containing, well, users and `addresses` containing
addresses (to which a user has a shipping address).  We want to get a report of transactions that includes pre-tax amount, tax amount, username, and shipping zipcode. We only want to show successful transactions and only those that used PayPal and only for users who signed up recently.

Here's how I would write this query:

```sql
SELECT
  transactions.id     AS transaction_id,
  transactions.amount AS pre_tax_amount,
  transactions.tax    AS tax,
  users.username      AS username,
  addresses.zip       AS shipping_zip
FROM
  transactions
JOIN
  users             ON user.id              = transactions.user_id
JOIN
  addresses         ON addresses.id         = user.shipping_address_id
JOIN
  transaction_types ON transaction_types.id = transactions.type_id
WHERE
  users.signed_up_at    > now() - interval '1 month' AND
  transactions.success  = true                       AND
  transaction_type.name = 'PayPal'
ORDER BY
  transactions.created_at
;
```

Here's some great things about the way this SQL is typeset:

* Each line has a lot of context since we aren't using aliases.
* The `FROM` and `WHERE` clauses are easy to take-in as a whole, since we've used aggressive typography to line things up.
* Similarly, the `SELECT`'s use of `AS` even for fields whose names we aren't changing means you can easily see all the column names in one
place.
* The trailing `AND` means an errant copy/paste will cause a syntax error, not an incorrect execution.
* In the `JOIN` clauses, the table with the `.id` is always on the left, creating a nice rhythm when reading the statement.

When you have a lot of SQL to maintain—and you will if your application does anything complex—extra care toward formatting is crucial.  SQL is
notoriously hard to test, and the general lack of abstractions available make it hard to organize in any other way.

Also, let's be honest, it's fun as hell to bikeshed other people's coding style :)
