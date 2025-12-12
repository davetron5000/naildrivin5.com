---
layout: post
title: "Start Tracking KPIs Early in Your Startup"
date: 2021-04-07 8:00
ad:
  id: "sweng"
---

[Previously][startup-post], I gave an overview of getting started as CTO of a startup.  I'd like to expand on the first part, "Understand How the Business Works" by talking about surfacing business metrics or *key performance indicators* as early as you can to keep everyone aligned.  This is a great way for *you* to understand the business and motivates good data modeling from the start, which is a great way to manage carrying costs.

[startup-post]: https://naildrivin5.com/blog/2021/03/31/at-a-startup-write-as-little-software-as-you-can.html

<!-- more -->

## Every Spreadsheet is *Just* a Bit Different From The Others

When you have two people looking at different calculations for the same metric, bad things will happen. At Mood, it would be
very bad if our marketing team dialed down marketing because they thought we were fully booked but our ops team is seeing tons
of availability.

What's more likely is that each person on the team will find a source of data plus a method of analysis (i.e. a spreadsheet)
to help make decisions.  Each spreadsheet ends up showing data that's *close*, but not the same.  In the short term, this can lead to distractions when these differences show up, but in the long term it can make it very hard to get everyone aligned on
exactly how to measure the performance of the business.

<aside class="pullquote">
The engineering team is uniquely positioned to get everyone aligned.
</aside>

The engineering team is uniquely positioned to address this problem and get everyone aligned.  This is because the engineering
team is often at the center of every system in use and will often be managing the database that drives any custom-built
technology.

I would recommend doing this as early as you can by agreeing on the metrics that are important, aligning on a definition, and
ensuring the engineering systems can produce the metrics.

## Agree On Metrics Early

Even before product/market fit, most startups are using *some* data to drive decisions.  These are often called *key performance
indicators* or KPIs.  Common KPIs might be website conversions, website traffic, recurring revenue, or the number of active customers.  Each startup will have less common KPIs relevant to what it does. For example, Mood tracks the show rate: how many people who scheduled an appointment actually showed up?

As soon as you can, get an understanding of the KPIs relevant to your startup.  Ask everyone how they are making decisions and
find out where they are getting their data from.  A common way you can help here is to identify edge cases and ask how they are
handled.  For example, if someone converts to a customer on your website, but their first payment fails, do they count as a
customer?

Once you've got a list, write down how each KPI is calculated.

## Align on Calculation Methodology

At Mood, when a customer books an appointment, this doesn't count as a conversion.  It only counts if they've attended the
appointment they booked.  This distinction is critical for understanding marketing and it's not the conventional way you might
think about it.  We all agree on this because we discussed it and wrote it down.

<div data-ad></div>

Do this for all the KPIs you've agreed are important.  Where possible, manually calculate the values yourself from real data to
build alignment on the defitions.  The team will only trust the definitions when they see real data being produced from them.

This is also a good time to discuss internal consistency. For example, if you collect $5,000 this month and your service costs
$50 per month, you should have about 100 active customers no matter how you calculate it.  Identify internal consistency will
quickly drive alignment and build trust in any eventual automation.

## Produce Regular Reports of the KPIs

Your goal is to eliminate private spreadsheets that are used to produce KPIs.  Each team member will certainly have their own
ancillary data relevant to their function, but everyone should look at the same source for the KPIs you've identified.  The way
to make this happen is to produce reports of these values from the engineering systems.

Your reports should initially be designed as CSVs of raw but clean data and spreadsheet formulas that do the aggregation.  The
reason is that the team will not initially trust automated reports produced from a computer, especially if they have been
accustomed to their hand-crafted spreadsheets.

<aside class="pullquote">
Anyone can follow from a KPI to the data that produced it
</aside>

By putting aggregation logic in a spreadsheet, anyone can follow from a KPI to the data that produced it and trust that it's
correct.  It also allows them to diagnose bugs in the calculations or errors in the definitions.  For example, Mood calculates
both conversions and revenue weekly, however an initial version of our spreadsheets used Monday as the start of the week in one
case and Sunday in another.  Only by tracing to the original data were we able to figure this out.

One issue you will run into is finding a reliable source of the data you need.

## Understand and Manage Data Sources

Depending on how far along you are, you may not have all transactional data in a single database.  For example, you are not
likely going to be importing marketing spends from the various ad platforms being used, but this data is critical to
calculating customer acquisition cost.

For data that you have or could have in your transactional database, it's *critical* that you use a normalized schema.
*Normalization* is the process of designing a database that prevents ambiguous, redundant, or erroneous data. It's a deep topic,
  but here are three things you can do easily to ensure your database has reliable data in it:

* Avoid nullable columns where possible. Most data you collect won't logically allow null, so don't let it into your database.
* Use foreign key constraints between tables. This ensures that if one table depends on another, the data is there. If you have
a charge that references a non-existent customer, you can't understand what that charge is for.
* Make liberal use of database constraints. Postgres allows for sophisticated *check constraints* that you can use to ensure
that, for example, a type field you store in a string only allows certain values or that a numeric value is always positive.  Do
not rely on your application layer to enforce this<a name="back-1"></a><sup><a href="#1">1</a></sup>.

For data that's not in your database, you can create a tab in your spreadhseet for it to be filled in manually.  At Mood, we
have a tab for marketing spend per channel per day and our marketing team fills it in daily.  In some cases you could use APIs
to manually load data from other systems.  This is always a tricky situation because it creates a carrying cost, but it may be
worth it to ensure that correct KPIs are always available.

Once you have this set up, sit with each person and review the data.

## Review the KPIs…Synchronously

Do not simply email the spreadsheet and hope for the best.  You need people to trust that these calculations are correct and
reliable.  If you have access to the private sheets each person is using, show how your automated system produced identical
results.  If it *doesn't*, be prepared to explain in detail why not and why your system is more correct.

<aside class="pullquote">
People will…not be convinced data is correct merely by an explantation of the methodology
</aside>

People will definitely not be convinced data is correct merely by an explantation of the methodology. They will need to see real
values and potentially run a few numbers by hand first.  Make it easy to do that and do it synchronously either in person or on
video.  This will ensure the clearest understanding of their concerns.

Once you've got this, review the numbers on a regular basis and make sure the underlying system is still working.  Be sure that
any new changes to the database or code are relfected in these calculations.

It may seem like dumping CSVs into spreadsheets will not scale, but Stitch Fix used this mechanism for many years…well past
our last round of VC funding.



<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>Rails unfortunately defaults to the complete opposite of all of this and provides a lowest-common-denominator
approach to database schema management.  You *can* access the full power of your database with Rails, you just have to do
remember to do it yourself as the Rails defaults do the wrong thing most of the time.
</li>
</ol></footer>
