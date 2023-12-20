---
layout: post
title: "Picard Sidekiq Tip: Split Up Independant Operations"
date: 2023-12-20 9:00
ad:
  title: "Don't Let Your Jobs Get Assimilated"
  subtitle: "Advanced Topics on Sidekiq"
  link: https://pragprog.com/titles/dcsidekiq/ruby-on-rails-background-jobs-with-sidekiq/
  image: "/images/sidekiq-rails-cover.jpg"
  cta: "Buy Now $9.99"
---


A while back, Joe Sondow posted a [great thread](https://dice.camp/@JoeSondow/110438676978468547) on Mastodon that is a perfect example
of why you should split a complex job up into several individual ones. Basically, Worf was experiencing an error that caused Riker
to post more than he should have.

<!-- more -->

A big theme of [my Sidekiq book](https://pragprog.com/titles/dcsidekiq/ruby-on-rails-background-jobs-with-sidekiq/) is to handle
failure by making jobs idempotent—allowing them to be safely retried on failure, but only having a single effect.

While Joe is not using Sidekiq, the same theories apply.  His job's logic is basically like so:

1. [Picard Tips](https://botsin.space/@picardtips) executes
2. Then, [Riker Googling](https://botsin.space/@RikerGoogling) runs
3. After that, [Worf Email](https://botsin.space/@WorfEmail) does its thing
4. Last but not least, [Locutus Tips](https://botsin.space/@LocutusTips) posts.

<figure>
  <a href="/images/bots.png">
    <img src="/images/bots.png"
         srcset="/images/bots.png 629w,
                 /images/bots-320.png 320w,
                 /images/bots-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="Four fake Mastodon posts with arrows from one to the next in order. First is from user @PicardTips that says 'Picard background job tip: Allow your jobs to fail and retry without firing photon torpedos more than once'. Second is user @RikerGoogling that says 'redis port main computer core moriarty'. Third is user @WorfEmail that says 'Lt Barclay, You have failed jobs that must be fixed. If not addressed, they will escalate to Capt Picard's combadge Worf'. Fourth is user @LocutusTips that says 'Locutus scaleability tip: Just add more database replicas instead of clearing failed jobs.'">
  </a>
  <figcaption class="">
  The happy path of the bots (<a target="_new" href="/images/bots.png">Open bigger version in new window</a>).
  </figcaption>
</figure>


Ideally, if Worf's email fails, it should get retried until Worf succeeds. It should *not* cause Riker to
google more or for Picard to present additional tips. And it shouldn't prevent Locutus from sharing his wisdom, either.

For Joe's Lambda function, this isn't how it worked, unfortunately.  Worf had an issue and while Picard was able to avoid posting more
than once, Riker was not.

<figure>
  <a href="/images/bots-failure-repeat.png">
    <img src="/images/bots-failure-repeat.png"
         srcset="/images/bots-failure-repeat.png 629w,
                 /images/bots-failure-repeat-320.png 320w,
                 /images/bots-failure-repeat-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="The same four fake Mastodon posts from the previous image, but in this case @PicardTips leads to @RikerGoogling, which leads to @WorfEmail, which leads to an error state.  The error state leads to a second post from @RikerGoogling with the same content, which then leads to another @WorfEmail post with the same content as well.  The @LocutusTips post is shown, but no path leads there. A note indicates that this post 'Sadly, never ran'">
  </a>
  <figcaption class="">
  When worf fails, the entire operation is started over (<a target="_new" href="/images/bots-failure-repeat.png">Open bigger version in new window</a>).
  </figcaption>
</figure>

Joe's solution—which he admits isn't great—is to catch all errors and exit the entire process when one is caught.
<figure>
  <a href="/images/bots-failure-bailout.png">
    <img src="/images/bots-failure-bailout.png"
         srcset="/images/bots-failure-bailout.png 629w,
                 /images/bots-failure-bailout-320.png 320w,
                 /images/bots-failure-bailout-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="The same four Mastodon posts from before. @PicardTips leads to @RikerGoogling, which leads to @WorfEmail, which leads to an error.  From the error, flow proceeds to the end state. @LocutusTips post is shown with the note 'Sadly, never ran'. The content of the posts is the same as the first image">
  </a>
  <figcaption class="">
  Bail out on any error to avoid re-posting (<a target="_new" href="/images/bots-failure-bailout.png">Open bigger version in new window</a>)....
  </figcaption>
</figure>

This is actually not *that* bad of a strategy!  In Joe's case, the bots will run the next day and if the underlying problem was
transient, everyone will be fine.  They'll miss one day hearing about how Locutus thinks you should run your life, but it's fine.

If these jobs were more important, the way to make the entire operation idempotent is to create *five* jobs:

You'd have one top-level job that queues the others:

```ruby
class BotsJob
  include Sidekiq::Job

  def perform
    PicardJob.perform_async
    RikerJob.perform_async
    WorfJob.perform_async
    LocutusJob.perform_async
  end
end
```

Each of those jobs would then have logic that it sounds like Picard Tips already has: don't post if you've already posted.  But, this
time, if any of the jobs fail, it won't affect the other jobs.

<figure>
  <a href="/images/bots-fanout.png">
    <img src="/images/bots-fanout.png"
         srcset="/images/bots-fanout.png 629w,
                 /images/bots-fanout-320.png 320w,
                 /images/bots-fanout-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="A graph with the top showing a picture of the Enterprise D's computer system, LCARS. It leads to the four Mastodon posts from before, each separate on the same line: @PicardTips, @RikerGoogling, @WorfEmail, andn @LocutusTips.  @WorfEmail leads to an error, which leads to a second @WorfEmail post. The other posts all leads to successes: @PicardTips's leads to 'Made it So', @RikerGoogling's to 'Jazzed', and @LocutusTips to 'Assimilated'.  Text of posts is the same as the first image.">
  </a>
  <figcaption class="">
  Each bot in its own job can succeed or fail without affecting the others (<a target="_new" href="/images/bots-fanout.png">Open bigger version in new window</a>).
  </figcaption>
</figure>

The only problem with the Ruby code for this is that we can't call `PicardJob.make_it_so!`

<div data-ad></div>
