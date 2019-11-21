---
layout: post
title: "Liskov Substitution Principle is…Not a Design Principle (SOLID is not solid)"
date: 2019-11-18 12:00
ad:
  title: "Focus on Results"
  subtitle: "Pragmatic Advice to Get Things Done"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "Interface Segregation Principle is Unhelpful but Inoffensive (SOLID is not solid)"
  - "SOLID Is Not Solid - Examining the Single Responsibility Principle"
  - "Four Better Rules for Software Design"
  - "What is 'better' code?"
  - "The Open/Close Principle is Confusing and, well, Wrong (SOLID is not solid)"
---
As mentioned in the [original post][original], I'm realizing that the [SOLID][solid] principles are not as…solid
as it would seem.  The [first post][original] outlined the problems I see with the Single Responsibility
Principle, and in the [second][open-closed], I recommended ignoring the Open/Closed Principle, since it is 
confusing and most reasonable interpretations give bad advice.  Now, let's talk about the Liskov Substitution Principle,
which, as it turns out, is not design advice at all.

[original]: /blog/2019/11/11/solid-is-not-solid-rexamining-the-single-responsibility-principle.html
[open-closed]: /blog/2019/11/14/open-closed-principle-is-confusing-and-well-wrong.html
[solid]: https://en.wikipedia.org/wiki/SOLID

<!-- more -->

This principle states that "Objects in a program should be replaceable with instances of their subtypes without altering the correctness of the program".  To understand this, we need to know what "correctness of the program" means.

To figure that out, it's useful to see where this principle was developed and, as it happens, it was not developed or coined
by Barbara Liskov, for whom the principle is named.

Liskov and Jeannette Wing *did* author a [paper][liskov-paper] that attempts to define _subtypes_ in a way that relates to program correctness.  In the paper, they state that if we use an object _y_ in place of an object _x_, but _y_ does not have all the same properties of _x_, then _y_ is not a subtype of _x_.

OK, so how did we get a principle out of this?  The unsurprising answer is good 'ole Uncle Bob Martin<a name="back-1"><a href="#1"><sup>1</sup></a></a>, who describes the principle in a [paper he wrote][bob-paper], that references Liskov's work.

[liskov-paper]: http://reports-archive.adm.cs.cmu.edu/anon/1999/CMU-CS-99-156.ps
[bob-paper]: https://web.archive.org/web/20150905081111/http://www.objectmentor.com/resources/articles/lsp.pdf

Martin's paper doesn't make a very strong case about what problem the principle is trying to solve, and presents some
convoluted examples that justify this principle's existence, but it gives no direction on how to understand or apply this
principle.

I'm tempted to write it off as just confusing and vague, but I'm very bothered by the insistence on the use of "correctness".

## What, exactly, is "program correctness"?

Wikipedia [defines program correctness as](https://en.wikipedia.org/wiki/Correctness_(computer_science)):

> [An algorithm is correct] when it is said that the algorithm is correct with respect to a specification. Functional correctness refers to the input-output behavior of the algorithm (i.e., for each input it produces the expected output).

This definition seems reasonable, however we yet again are faced with this requirement of having a specification.  Not only is
a specification rarely present in the development of most software, agile software development (ironically developed and championed by Martin) often eschews having one anyway,
preferring to iterate on the software with user feedback.

So I'm left struggling with how I'm supposed to evaluate my design based on correctness, which requires a specification, which I
don't have.

But even a you'll-know-it-when-you-see-it definition of correctness still leads us into a strange path.

Suppose we wish to sort the contents of a bunch of files.  Say we have a directory of files, and we wish to produce a single
file with all their lines sorted.  We want to defer the details of how the sorting is done to a passed-in object, so our
central routine might look like so:

```ruby
def sort_files(files_dir, destination_file, sorter)
  files_in_dir = readdir(files_dir)
  sorter.sort_contents(files_in_dir, destination_file)
end
```

The caller of `sort_files` can provide any implementation for `sorter`.  And, as long as those implementations do not change
the correctness of the program, we will consider our design good, because it does not violate the Liskov Substitution
Principle.

<div data-ad></div>

Consider two possible sorting algorithms.  The first, which we'll call `MemQuicksort`, reads all the files' lines into memory
and does a quicksort on them. It then writes the sorted results to `destination_file`.  This seems to satisfy the program's requirements.

Now suppose that we have another implementation called `FileMergeSort`, which uses a merge sort to basically sort the files on
disk and avoid reading every single line into memory.  It requires more disk space, but not as much memory. This, too, would
seem to satisfy the program's requirements.  Both implementations, given the same input, produce the same output.

Or do they?

These two implementations fundamentally change how the software will behave, and isn't that considered an "output"?  Depending on circumstances outside the control of the source code (namely the amount of disk, the amount of memory, and the size of the files), the program might not work at all. Or it might work more slowly than we'd like.  Or it might cost too much to run because of the memory required.

You see, there are more inputs to our program than just the directory where the files are, the destination file, and the sort
algorithm to use.  There are some implicit inputs, such as the computer on which the program will run, the memory it's been
allocated, the size of the disk, etc.

This means that our definition of correctness likely has to account for *all* the inputs and *all* the outputs, including the
program's actual behavior.  Right?  And if so, how could *any* subtype not affect some of these in some way? The whole reason
we create subtypes is to change behavior.

This tells me that *all* subtypes violate the principle, depending on the definition of correctness that we're using.  And
much like discussing the Single Responsibility Principle usually involves debating what a "responsibility" is instead of the
code in question, I can't help but think that the Liskov Substitution Principle devolves into a debate about "correctness"
rather than talking about the code.

My takeaway here is that focusing on subtypes is not the right lens through which our designs should be analyzed.  It doesn't
provide any clarity about how to improve our designs.  It's hard to even see this principle as design advice on any level.

My advice: **This is not design guidance, ignore it, stop talking about subtypes, and focus on building software to solve the
problems you have.**

Next up, the Interface Segregation Principle, another prescription for making flexible code when it's not called for.

<footer class='footnotes'>
<ol>
<li>
<a name='1'></a>
<sup>1</sup>Robert Martin AKA “Uncle Bob” has made statements online that are inconsistent with my personal values, so I do not follow his work closely and do not hold him in any high regard.  Nevertheless, he has been influential in the world of software and object-oriented design and there is value in criticizing his ideas, since they are taught to many developers.  If you would like to know more about Uncle Bob's online behavior, find him on Twitter.<a href='#back-1'>↩</a>
</li>
</ol>
</footer>
