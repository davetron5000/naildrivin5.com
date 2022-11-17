---
layout: post
title: "Your Rails and Ruby Versioning and Gemfile Policy"
date: 2022-11-17 18:00
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

One of the lowest-effort, highest-value practices you can adopt for sustainable development is to keep your dependencies updates frequently.  The foundation for doing so is to have a clear and reasonable versioning policy.  This post includes one for Rails apps that I have used for years and has served me and my co-workers well.  It has some implications for specific procedures you will adopt as well.

In a nutshell: stay no more than 2 minor versions behind Ruby and Rails, and keep everything else
as up to date as you can as often as you can.

<!-- more -->

## Why Have a Policy?

"Policy" sounds like a dirty word that comes from the HR or security, but it's
nothing to be alarmed about. A policy is a statement of values and intention: What do we, as a
team, think is important enough to write down and follow?

A written policy prevents shadow policies which create confusion amongst the team.  A written
policy also provides a simple way to communicate your values to people outside the team.  It gives a basis to justify spending time on something that isn't in the product backlog.

With policies go "procedures" which are often more detailed instructions on complying with the
policy.  These are important, too, because it can remove a lot of ambiguity about what the policy
means practically.  This post will talk about both, with respect to Ruby and Rails versioning.

## The Policy

### Ruby Versioning Policy

* Ruby versions are `MAJOR.MINOR.PATCH`.
* Develop and deploy on the same version.
* The Ruby version should be the latest `MAJOR.MINOR` or the second latest `MAJOR.MINOR`. At the
time of this writing that would be 3.1.x or 3.0.x.
* The `PATCH` version should be the latest (see section on updating below)

### Rails Versioning Policy

* Rails versions are `MAJOR.MINOR.PATCH` or `MAJOR.MINOR.PATCH.SUBPATCH` (this form is usually reserved for security fixes)
* Develop and deploy on the same version.
* The Rails version should be the latest `MAJOR.MINOR` or the second latest `MAJOR.MINOR`. At the
time of this writing that would be 7.0.x or 6.1.x.
* The `PATCH` and `SUBPATCH` (if applicable) versions should be the latest (see section on updating below)

### Other Dependencies Versioning Policy

* Use the latest release that is compatible with your versions of Ruby and Rails.
* Pin versions only to address specific incompatibility issues, and regularly re-evaluate the
need for pinning the version.

### Updating Versions of Ruby and Rails

* New releases that address known security vulnerabilities should be updated within 24 hours.
* When a new `PATCH`/`SUBPATCH` is released, update to that as soon as possible, ideally within 1 month of the release.
* Ruby's `MAJOR.MINOR` is updated once per year, around late December.  Plan time every January
to update Ruby to the newly-released version.
* Rails is released less predictably. When a new version is announced, plan time within the next
3 months to upgrade to that version.
* If a new `MAJOR.MINOR` version is released causing a violation of this policy (i.e. you were on the second to latest), schedule an upgrade in the next 3 months and, if possible, upgrade to the latest within the following 6 months.
* Plan to reduce these "times-to-upgrade" when possible. For example, six months from now, commit
to updating `PATCH` releases every 3 weeks, and `MINOR` versions every 2 months instead of 3.

### Updating Other Dependencies

* New releases that address known security vulnerabilities should be updated within 24 hours.
* All other new releases should be updated-to regularly, at least once per month.

## Implementing the Policy (Procedures)

The policy says what we value and what we are going to achieve.  Implementing it can take many
forms, and is dependent on your team and tooling.

If you don't have anything in place, here is what I have done that works:

* Your `Gemfile` should specify the version of Rails using the pessimistic operator and the
lowest version of Rails required by your app in `MAJOR.MINOR.PATCH` form:

  ```ruby
  gem "rails", "~> 7.0.4"
  ```

  This ensures that `bundle update` will update the patch version of Rails, but allow you to have
  control over when the major or minor version changes.
* No other gems should have a version specifier unless the latest version is incompatible with your app in some way.  You want to be on the latest version that is compatible with Rails, and since you are specifying the Rails version, `bundle update` will sort out the rest.
* If the latest version of any gem is not compatible with your app or another dependency, pin the
version of the gem in your `Gemfile` (using the pessimistic operator if possible) and add a comment:

  ```ruby
  # sidekiq-scheduler is not compatible with
  # Sidekiq 7, so we must pin to 6 for now
  gem "sidekiq", "~> 6.0"
  ```

  Instructions on how to resolve this will go elsewhere (see next)
* Create a script to update your dependencies, called `bin/update_dependencies`:
  - It should initially wrap running `bundle update` and your tests.
  - If you have pinned versions, this script should include specific instructions to check to see if the pinned versions can be removed.  Ideally it explains exactly what the problem is and how to check if the problem has been solved. Code review on commits to the `Gemfile` should be sufficient to make sure this happens.

    ```ruby
    puts "Check to see if sidekiq-scheduler has released"
    puts "a new version compatible with Sidekiq 7"
    puts
    puts "https://github.com/sidekiq-scheduler/sidekiq-scheduler"
    puts
    puts "Has there been an update? (Y/N)"
    updated = gets
    if updated.downcase == "Y"
      puts "Remove the pin from `Gemfile` and"
      puts "re-run this script."
      exit 1
    end
    ```

* Arrange to run this script and thus update dependencies every month or more frequently. The
more frequent the better.
* Run `bundle audit` in your continuous integration build or as a gate to deploying. This will prevent deploying code that has a known vulnerability and be a good forcing-function to comply with your versioning policy.
* To update Rails, modify the version in `Gemfile`, then run `bin/update_dependencies`.
* To update Ruby depends on how you manage Ruby, deployment, and development environments.


If you use a tool like Dependebot, that can manage the general updates for you, but it won't
create a forcing-function around checking that pinned dependencies can be unpinned. If you use a
tool like Dependebot, you'll need to figure out how to periodically check on pinned dependencies.

## If You Are Way Behind


<div data-ad></div>

The best time to update your dependencies was a long time ago. The second best time is now.  I
would strongly suggest you author and adopt a policy like the one in this post, even if you are
nowhere near in compliance.  Your policy is a goal in this case.

Once you do that, put a person or small team on the update process.  You should update one
`MAJOR.MINOR` version of Rails at a time, and probably update Ruby separately.  Scheduling it
as a project and once you get to compliance, maintaining your dependencies will be much simpler.

## Other Things That Help

Without test coverage, this process is extremely painful and time consuming.  If you don't have
good test coverage, start getting it.  System tests probably provide the most confidence if you
can't get good coverage at all levels, but you need tests or you can't really manage your app.

Using a ton of gems makes managing updates harder, so be judicious in the gems you add to your app.  Gems tend to be general and flexible and solve for many more cases than the one you have. It can be better to roll your own or inline just what you need.  Your app and team is a system and managing it requires trade-offs.  This is one of them.

Do not treat the dependency-management process as optional or as some sort of second-class thing.
It should be as or more important than new features.  It is a small price to pay to allow your
team to easily and quickly update a dependency to address a security issue.  It is also a small
price to pay for hiring and retention.  No one likes working on outdated code.

