---
layout: post
title: "It's not Naming That's Hard—It's Types"
date: 2016-03-15 9:00
---

Katrina Owen wrote an interesting piece on SitePoint Ruby called [“What’s in a Name? Anti-Patterns to a Hard Problem”](http://www.sitepoint.com/whats-in-a-name-anti-patterns-to-a-hard-problem/).  She identifies a lot of pitfalls around naming and method design, but the solutions to the problems she's identified aren't as much about naming as they are about using data types effectively.

<!-- more -->

I'm having a hard time with this statement from her post:

> Type information is just not that compelling. 

Type information is *everything*.  Every line of code is filled with types, and the correctness of code, as well as our ability to use it properly, relies
on knowing type information.  Just because Ruby has “duck typing” doesn't mean it has *no* types.

And, types are a better way to solve the problems Katrina identifies in her post.

She starts with this routine, arguing that the names are bad since they encode type information:

```ruby
def anagrams(string, string_array)
  string_array.each do |str|
    str != string && same_alphagram?(string, str)
  end
end
```

For me, it's plainly obvious how to properly use this method: I pass in a string and an array of strings.  Katrina's improved version makes it harder to
know what I'm expected to pass in:

```ruby
def anagrams(subject, candidates)
  candidates.each do |candidate|
    subject != candidate && same_alphagram?(subject, candidate)
  end
end
```

What is a "subject"?  What is a "candidate"?  My first guess would be some sort of `Subject` or `Candidate` class.  The author of this code had *something*
in mind that I should be passing in, but it's no longer clear.  With no guidance I would have to read the source to `same_alphagram?` (and whatever its dependencies are).

The real problem is that a string is not a word and an array of strings is not a set of words.  We shouldn't be using strings to solve this problem, and no
efforts of naming will change that.  What the `anagrams` method is trying to do is tell us if one word has anagrams in a set of other words.  That says to me we might need a word class.

```ruby
class Word
  def initialize(string)
    @string = word
  end

  def to_s
    @string
  end
end
```

This may seem superfluous, but we have now named the thing we are operating on.  We've also created a place for ourselves to put code about this type of
data.  For example, a word should only contain alphabetics and spaces.

```ruby
class Word
  def initialize(string)
    unless string =~ /^[\a\s]+$/
      raise ArgumentError, "#{string} is not a word" 
    end
    @string = word
  end
end
```

We've now described—in code—what a word is.  We've written code that explains what the parameters to `anagrams` actually are supposed to be.  And we
communicate that by naming the parameters after the data type:

```ruby
def anagrams(word, candidate_words)
  candidate_words.each do |candidate_word|
    word != candidate_word && same_alphagram?(word, candidate_word)
  end
end
```

With an actual data type available to us—instead of a string—we can also get rid of that pesky `same_alphagram?` free-floating method.


```ruby
class Word

  def letters
    @string.chars
  end

  def same_alphagram?(other_word)
    self.letters.sort == other_word.letters.sort
  end
end
```

Now, our `anagrams` routine is a bit better:

```ruby
def anagrams(word, candidate_words)
  candidate_words.each do |candidate_word|
    word != candidate_word && word.same_alphagram?(candidate_word)
  end
end
```

While the names in the original routine weren't great, the solution wasn't to mask the method's intent and proper use by using different names.  The
solution is use code to describe the parameters.

But wait.  `letters` is returning an array of strings.  Shouldn't it return a `Letter`?

Yup.  Let's do that.

```ruby
class Letter
  def initialize(char)
    unless char =~ /^[\a\s]$/
      raise ArgumentError,"'#{char}' is not a letter" 
    end
    @char = char
  end

  def to_s
    @char
  end

  def ==(other_letter)
    self.to_s == other_letter.to_s
  end

  def <=>(other_letter)
    self.to_s <=> other_letter.to_s
  end
end
```

Before we re-implement `letters`, let's take a moment.  We have duplicated code now in the initializers of these two classes.  Because we now have a
`Letter` class that describes a letter, and we know that a `Word` is an ordered list of `Letters`, we can change our implementation of `Word` to make that
abundandtly clear.

```ruby
class Word

  attr_reader :letters

  def initialize(string)
    @letters = string.chars.map { |char|
      Letter.new(char)
    }
  rescue ex => ArgumentError
    raise ArgumentError, "'#{string}' is not a word: #{ex.message}"
  end

  def to_s
    @letters.map(&:to_s).join("")
  end

  def same_alphagram?(other_word)
    self.letters.sort == other_word.letters.sort
  end
end
```

This may seem like a lot of code, and possibly even ridiculous, but if we really *are* writing code that does anagrams, doesn't it make sense to have classes to describe the building blocks of our domain?

Strings (and Hashes) are great for exploring your domain, but once you understand your domain, data types will make your code easier to
understand and easier to change. It also alleviates you from stressing about parameter names.  [Thinking in Types](http://naildrivin5.com/blog/2014/06/30/thinking-in-types.html) will make your code better and make you a better programmer.  They also help *greatly* in naming things.
