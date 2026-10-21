--- 
wordpress_id: 51
title: Ruby's awesomely dangerous awesomeness
wordpress_url: http://www.naildrivin5.com/daveblog5000/?p=51
layout: post
---

While packaging <a href="http://github.com/davetron5000/daves-resume">my resume</a> creator/formatter as a Ruby Gem, I noticed my command line parser was preventing my code from running.  It has this hook that sets up an "auto run" sequence (your code just defines a <code>main</code> method):

```ruby
def self.inherited(child_class)
  @@appname = caller[0][/.*:/][0..-2]
  @@child_class = child_class
  if @@appname == $0
    __set_auto_run
  end
end
```

the problem is that <code>$0</code> from gem is the <code>/usr/bin</code> location and <code>@@appname</code> is the <b>actual</b> location in the Gem repository.  Not sure why this check was there, but I had a problem.



Not feeling like overhauling the command line interface code and not being able to patch OptionParser, I opted instead to use the dangerous-sounding ruby feature of <i>replacing the method with my own implementation</i>:

```ruby
class CommandLine::Application
  class << self
    alias old_inherited inherited

    def inherited(child_class)
      @@appname = caller[0][/.*:/][0..-2]
      @@child_class = child_class
      normalized_appname = @@appname.gsub(/^.*\//,"");
      normalized_dollar0 = $0.gsub(/^.*\//,"");
      if normalized_appname == normalized_dollar0
        __set_auto_run
      end
    end
  end
end
```

Now <b>that's</b> pretty cool.  My code just dynamically patches the broken Gem!  The power of open source and dynamic languages.  Of course, this feature allows so much awful code to be written....

