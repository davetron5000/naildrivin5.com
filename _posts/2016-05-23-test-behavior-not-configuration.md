---
layout: post
title: "Test Behavior, not Configuration"
date: 2016-05-23 08:00
---
I've become re-acquainted with the pattern of testing ActiveRecord classes using stuff like `expect(parent).to belong_to(:child)` and I just don't understand why anyone would ever write a test like that.  It provides no value, and the implementation provided by [shoulda][shoulda] isn't actually testing the behavior.  It's testing configuration.

<!-- more -->

In Rails, the following code is configuration:

```ruby
class Address < ActiveRecord::Base
  belongs_to :country
end

class Country < ActiveRecord::Base
end
```

There is literally no reason to write this test:

```ruby
describe Address do
  it "belongs to a country" do
    expect(Address.new).to belong_to(:country)
  end
end
```

Why?

First, it's basically asserting the exact code that it's testing.  It could just as well be:

```ruby
describe Address do
  it "belongs to a country" do
    source_code = File.read(File.join(
                              __FILE__,
                              "../../app/models/address.rb"))
    expect(source_code).to =~(/^  belongs_to :country$/)
  end
end
```

Second, it actually doesn't test the configuration behavior.  It uses a [ridiculous](https://github.com/thoughtbot/shoulda-matchers/blob/b58f0a1807a4346399aa3b9bb5b88923ab9aa2e5/lib/shoulda/matchers/active_record/association_matcher.rb) [amount of](https://github.com/thoughtbot/shoulda-matchers/blob/b58f0a1807a4346399aa3b9bb5b88923ab9aa2e5/lib/shoulda/matchers/active_record/association_matchers/model_reflector.rb) [logic and meta-programming](https://github.com/thoughtbot/shoulda-matchers/blob/b58f0a1807a4346399aa3b9bb5b88923ab9aa2e5/lib/shoulda/matchers/active_record/association_matchers/model_reflection.rb) to determine what Active Record methods appear in the class under test.

It does not assert any particular behavior.

This means that it actually doesn't test the one thing that most people mess up with ActiveRecord, which is putting the `belongs_to` on the wrong class.

It's also _highly_ unlikely that this test would ever find a real bug, and I can't imagine a TDD scenario in which this test takes our code from red to green.

But, since it *doesn't test behavior* it makes refactoring difficult.

What if we tested the behavior instead?

Here's one way to do that:

```ruby
describe Address do
  it "has a country" do
    address = Address.new
    country = Country.new
    address.country = country

    expect(address.country).to eq(country)
  end
end
```

This is how we expect `Address` instances to behave.  We want to give them countries, and have them return them to us.  It's almost certain that most uses of an address and a country will do it this way.

Now, suppose we've decided that storing countries in its own table is too difficult, becuase the geo-political situtation on our planet is chaotic.  Instead, we'll store it as a string on `addresses` called `country_code`.  This way, when countries change, we don't have to maintain our `countries` list.

```ruby
class Address < ActiveRecord::Base

  belongs_to :legacy_country, foreign_key :country_id

  def country
    Country.new(code: self.country_code)
  end

  def country=(new_country)
    self.country_code = new_country.code
  end
end

class Country < ActiveRecord::Base
  def ==(other_country)
    self.code == other_country.code
  end
end
```

With this change, the _behavior_ of our `Address` stays the same, and our test still passes.  If we had asserted the configuration instead, our test would break, even though the behavior was the same.

Don't test configuration.  Test behavior.

[shoulda]: https://github.com/thoughtbot/shoulda-matchers

