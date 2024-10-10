---
layout: post
title: "A Simple Explanation of Postgres' <code>Timestamp with Time Zone</code>"
date: 2024-10-10 9:00
---

Postgres provides two ways to store a timestamp: `TIMESTAMP` and `TIMESTAMP WITH TIME ZONE` (or `timestamptz`).
I've always recommended using the later, as it alleviates all confusion about time zones. Let's see why.

<!-- more -->

## What is a "time stamp"?

The terms "date", "time", "datetime", "calendar", and "timestamp" can feel interchangeable but the are not.  A "timestamp" is a specific point in time, as measured from a reference time.  Right now it is Oct 10, 2024 18:00 in the UK, which is the same timestamp as Oct 10 2024 14:00 in Washington, DC.

To be able to compare two timestamps, you *have* to include some sort of reference time.  Thus, "Oct 10, 2025
18:00" is not a timestamp, since you don't know what the reference time is.

Time zones are a way to manage these references. They can be confusing, especially when presenting timestamps or
storing them in a database.

## Storing time stamps without time zones

Consider this series of SQL statements:

```
db=# create temp table no_tz(recorded_at timestamp);
CREATE TABLE
db=# insert into no_tz(recorded_at) values (now());
INSERT 0 1
adrpg_development=# select * from no_tz;
         recorded_at          
----------------------------
 2024-10-10 18:03:11.771989
(1 row)
```

The value for `recorded_at` is a SQL `timestamp` which does not encode timezone information (and thus, I would argue, is not an actual time stamp).  Thus, to interpret this value, there must be some reference.  In this case, Postgres uses whatever its currently configured timezone is.  While this is often UTC, it is not guaranteed to be UTC.

```
db=# show timezone;
 TimeZone 
----------
 UTC
(1 row)
```

This value can be changed in many ways.  We can change it per session with `set session timezone`:

```
db=# set session timezone to 'America/New_York';
SET
```

Once we've done that, the value in `no_tz` is, technically, different:

```
db=# select * from no_tz;
         recorded_at          
----------------------------
 2024-10-10 18:03:11.771989
(1 row)
```

Because the SQL `timestamp` is implicitly in reference to the session or server's time zone, this value is now
technically four hours off, since it's now being referenced to eastern time, not UTC.

This can be solved by storing the referenced time zone.

## Storing timestamps with time zones

Let's create a new table that stores the time both with and without a timezone:

```sql
CREATE TEMP TABLE
  tz_test(
    with_tz    TIMESTAMP WITH    TIME ZONE,
    without_tz TIMESTAMP WITHOUT TIME ZONE
);
```

We can see that, by default, the Postgres server I'm running is set to UTC:

```
db=# show timezone;
 TimeZone 
----------
 Etc/UTC
```

Now, let's insert the same timestamp into both fields:

```sql
INSERT INTO
  tz_test(
    with_tz,
    without_tz
  )
  VALUES (
    now(),
    now()
  )
;
```

The same timestamp should be stored:

```
db=# select * from tz_test;
           with_tz            |        without_tz         
------------------------------+---------------------------
 2024-10-10 18:09:35.11292+00 | 2024-10-10 18:09:35.11292
(1 row)

```

Note the difference in how these values are presented.  `with_tz` is showing us the time zone offset—`+00`.  Let's change to eastern time and run the query again:

```
db=# set session timezone to 'America/New_York';
SET
db=# select * from tz_test;
           with_tz            |        without_tz         
------------------------------+---------------------------
 2024-10-10 14:09:35.11292-04 | 2024-10-10 18:09:35.11292
(1 row)
```

The value for `with_tz` is still correct. There's no way to misinterpret that value.  It's the same timestamp we
inserted.  `without_tz`, however, is now wrong or, at best, unclear.

## Why not Just Always stay in UTC?

It's true that if you are always careful to stay in UTC (or any time zone, really), the values for a `TIMESTAMP
WITHOUT TIME ZONE` will be correct.  But, it's not always easy to do this.  You saw already that I changed the
session's timezone.  That a basic configuration option can invalidate all your timestamps should give you pause.

Imagine an ops person wanting to simplify reporting by changing the server's time zone to pacific time.  If your
timestamps are stored without time zones, they are now all wrong.  If you had used `TIMESTAMP WITH TIME ZONE` it
wouldn't matter.

## Always use `TIMESTAMP WITH TIME ZONE`

There's really no reason *not* to do this.  If you are a Rails developer, you can make Active Record default to
this like so:

```ruby
# config/initializers/postgres.rb
require "active_record/connection_adapters/postgresql_adapter"
ActiveRecord::ConnectionAdapters::PostgreSQLAdapter.datetime_type = :timestamptz
```

This can be extremely helpful if you are setting time zones in your code. It's not uncommon to temporarily
change the time zone to display values to a user in their time zone.  If you write a timestamp to the database
while doing this, `TIMESTAMP WITH TIME ZONE` will always store the correct value.

