---
layout: post
title: "Names matter"
date: 2020-06-11 09:00
ad:
  title: "Sustainable Rails"
  subtitle: "Build Apps to Last for Years"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---
Names of things matter.  How we react to the realization that some names of some things offend some people is
important.  Unlike the names of countries, towns, or Army forts, computer software can actually be renamed
relatively easily, yet we still struggle to have even basic conversations about it.

I want to share the way *I* think about it: acknowledge a person's feelings, understand who might feel excluded by
a name, decide if excluding them is OK, and, if not, figure out how to change the name.

<!-- more -->

I find it useful to break apart the discussion of appropriate names to try to understand *who* might be excluded, is that acceptable, and how do we change the name if it's not.  When we conflate all three of these together, we get a huge mess of a discussion, with a ton of hurt feelings, mean-spirited debate, and no real change.

Fortunately, the start of any such discussion is rather easy - who might feel excluded by this name?

## Who does a name exclude?

Questions like "is this name offensive?" or "is this name inclusive?" are de-railing the discussion, because they
imply some sort of universal truth about inclusively and offensiveness.  These questions imply some sort of test
we can apply to a name to decide if it's appropriate.  But this is impossible, especially when we see that
historically, the "test" is "are white men OK with it?"

Instead, we should ask "who is offended by this name?" or, even better: "who might feel excluded by this name?"
Answering the latter is not incredibly difficult with the application of even the tiniest bit of empathy (note that
I used the word *might*.  It's difficult of find out who *is* feeling excluded because many people won't tell you unless they trust you.  And even then, it's not in most marginalized people's best interest to tell the white men in power that they are offended).

When we frame the question this way—identifying some sort of group of people for whom the name is not inclusive—we
can do so without a lot of value judgements or moralizing, especially when we allow people to feel how they feel.

Here are some examples.

I have a gem named "methadone" that is used to make CLIs in Ruby.  I thought I was being very clever, because I
wanted a way to write a CLI that was as easy as bash, so my gem would help you "kick the bash habit". Methadone is
more commonly known as a drug that helps people deal with their addiction to narcotics like heroin. It helps you
"kick the habit".

Is this name offensive? There's no way to answer this question.  Offensive to *who*?  Rather, let's ask "who might
feel excluded by this name?"

I have not had a problem with drug addiction, though my sister did. She died of a heroin overdose. Her life was very
difficult.  So I think I can imagine what it might be like for someone like her to have used methadone to overcome
their addiction.  I think I can imagine what it must be like to show up to work every day on a Ruby command line
app and see the words "methadone" emblazoned on the computer screen all day, every day.

I imagine it would not feel good.

So, I think it's a reasonable conclusion that many people recovering from drug addiction via methadone would feel excluded by a Ruby gem named "methadone".

Now, if you aren't black, imagine being black in America as a programmer.  You come into work every day as a programmer working on your nice little Rails app.  Imagine the best possible work situation: empathetic, inclusive co-workers, a diverse and caring leadership team including black leaders both in technology and not.  And yet, every day your nice little Rails app tells you that a "cop" has found "offenses" in your code.

Maybe a few weeks ago, this might've been hard for white people like me to imagine. Right now, it's pretty fucking easy to imagine how that might feel. And I imagine it feels pretty shitty.

Further imagine having to type `git push origin master` every day.  Say that command out loud and tell me you don't
hear it as "Git push origin, master".  It's not hard to imagine how bad this must feel, at least for some people
some of the time.

Thought experiments like these are often enough to get a sense of who *might* feel excluded.

I also want to be clear that you have to acknowledge these feelings.  You can't tell someone they "should not" be
offended by the words "master" or "cop".  People feel how they feel.  To deny someone's feelings is
to say they are lying.  You can *not care* about someone's feelings, but you can't deny they exist.

_(As an aside, I very much realize that this is coming off as a process by which we start with names that white
 men are OK with and go from there. I don't know how to not do that, since I'm a white man and am usually in a
 position of power.  I guess this is reason number 1,876 why we need more non-white-men in leadership roles)_

Thus, the next question is, given that some people are going to feel excluded by a name, are we OK with that?

## Who are you OK with Excluding?

It's not hard to agree on *who* might feel excluded by a name.  It is harder to agree on how OK we are with that.

In the case of my methadone gem, the question is "am I OK keeping the name, knowing that it will exclude some
number of recovering addicts?".  Even though there are probably very few people in this category, I decided I am no
longer OK with it (and have [changed the name](https://github.com/davetron5000/optparse-plus)).

You might think you would always answer "no, I am not OK excluding people!".  This is hard or impossible to
achieve.  Since we cannot deny the feelings of anyone, we cannot control those feelings, and there will certainly
be people who will feel excluded by a naming choice.

<div data-ad></div>

If the goal is "100% inclusive or we have failed" then you fail.  The simple act of being explicit about who is
being excluded can go a long way.  It forces everyone to be clear about it.  Who we exclude says something about
our values.  And it's more honest than saying you are all-inclusive when you are not.

For example, I have installed [rspec-pride](https://github.com/ferrous26/rspec-pride) at work and will absolutely not allow anyone to remove it.  I know there are people that are offended by "pride" as a concept.  I don't deny them their feelings.  But I am also OK if they feel uncomfortable with that name.

Like most of you, the main branch for development at work in our Git repos is called "master".  Even though the entire team is two white people, the name "master" is still exclusive to some subset of black people.  I am not OK excluding that group.  So we are changing the name to "main" (I am also in the process of making that change to all my personal repos).

When you say a name should *not* be changed, what you are saying is that you are OK with excluding those who
find the name offensive or problematic.  If that is in fact what you mean, state it explicitly. If that is not what
you mean, consider changing the name.

This leads to the final thing to consider, which is differentiating being OK with a name change and actually doing
the work.

## Agreeing a Name Should Change Doesn't Mean It Can Happen for Free

Changing names of things can be a huge pain in the ass.  It can cause real problems, especially when the name is
relied-upon widely.  When [Factory Girl changed its name to Factory Bot](https://github.com/thoughtbot/factory_bot/blob/master/NAME.md), it was an annoying and time-consuming change.  If RuboCop were to change its name, there's no doubt that it would be painful for teams relying on that particular name being in file names, source code, and documentation.

In a sense, the act of actually changing the name of something is how you demonstrate that you really do think it should change. But changing names can sometimes be incredibly difficult, and it's worth being
explicit about the effort required to change a name, even if it's agreed-upon to be problematic.

For example, Redis uses the "master/slave" terminology.  In a [lengthy GitHub issue](https://github.com/antirez/redis/issues/5335), Salvatore Sanfilippo (the maintainer of Redis) acknowledges that the naming is problematic and should be changed.  He doesn't quibble with why the terminology might be exclusionary nor does he try to say the terminology is acceptable simply because it's hard to change.

But he does outline exactly why it *would* be hard to change.  He then outlines a set of compromises that won't
erase the word "slave" from Redis entirely, but that would allow most people to avoid having to use the term.

When we say that "naming is hard" in relation to programming, this is one of the reasons why. Names can be very
hard to change, even if we really want to change them.  Conflating the effort required to change the name with a
discussion of its appropriateness doesn't lead to a great outcome.

If the "owner" of a name agrees—at least in theory—that the name should be changed, the collective group can often
come up with a creative solution to change the name and manage the consequences.

For example, if the maintainers of RuboCop said "under no circumstances are we changing the name because we think the name is fine", great. They are OK excluding people—even just in theory—and the community can fork it and move on.
If the maintainers instead said "we agree the name could be better but have no capacity to change it", well that's a
different discussion.

## Names Really Do Matter

When you start from a place where you accept people's feelings, unpacking the appropriateness of a name boils down
to who you are OK excluding, and how much capacity you have to actually make the change.  Changing
the names of a few software thingies seems like almost nothing compared to what many others do to effect change in
the world.

That said, every little bit helps.  Think about the names of things you can change.  Perform a thought experiment
to imagine who might feel excluded. Are you OK with that?  You might find that you aren't.  If not…find some time
to improve your names.
