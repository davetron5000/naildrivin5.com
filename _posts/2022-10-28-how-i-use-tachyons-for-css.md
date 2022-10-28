---
layout: post
title: "How I Use Tachyons for CSS"
date: 2022-10-28 9:00
ad:
  title: "Get the Most out of Rails"
  subtitle: "A Deep Dive into Sustainability"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

I've long come to prefer the "functional" style of CSS, where each class represents a single CSS property set to a single value. I learned this from [Adam Morse](https://mrmrs.cc), author of [Tachyons](http://tachyons.io), which is a older framework, but it still checks out.  I'm not here to advocate for this style (read [Adam's post](https://mrmrs.cc/writing/scalable-css) for that), but to talk about how I use SASS to create higher-level re-usable styles with Tachyons, achieve the best of all worlds when managing CSS, all without some unstable, unfriendly JavaScript toolchain.

<!-- more -->

One benefit of Tachyhons-like frameworks is that you don't have to create a named component or
semantic class for everything you want to style.  If you only ever need a padded box with a grey
rounded border one time in your app, you can just create it directly:

```html
<div class="pa2 ba br3 b--gray">
Some Stuff
</div>
```

But even modest apps will end up with reusable components.  A common example is a button.   You might have a button like so:

```html
<a href="#" class="ph3 pv2 ba br3 white b--green bg-green">
  Click Me
</a>
```

<aside style="margin: 1rem;">
<a href="#" onclick="return false" style="display: inline-block; padding: 1rem 2rem; border: solid thin green; border-radius: 4rem; background: green; color: white;">
  Click Me
</a>
</aside>

(This says that our horizontal padding is the 3rd step of our design system's spacing, our
vertical spacing is the 2nd step (smaller), our border radius is the 3rd roundest, our text is
white and both our background and border colors are the green from our design system. Great.)


If we need to use a button like this a lot, we don't want to repeat that string of classes. In
fact, that is often what makes people bristle at this style.

## Remove Trivial Duplication with Your Templating System

This type of duplication, where you need almost identical markup in several places, can be
eliminated using the templating system of your web framework. In Rails, you could make a partial:

```erb
<%= render partial: "shared/button",
           locals: { href: "#", label: "Click Me" } %>
```

Or you could make a helper:

```ruby
def button(label,href)
  link_to label, href,
          class: "ph3 pv2 ba br3 white b--green bg-green"
end
```

The good thing about this is that your reusable components are modeled the same way, regardless
of what is being re-used.  In the case of our button, we are re-using styles, but we could also
make a component that reuses some display logic, or one that has both.  Regardless, they are
managed the same way (you can also use the wonderful [ViewComponent library](https://viewcomponent.org)).

Sometimes, you want to reuse only some of those classes.

## More Complex Re-use Can Create Problems

Consider the need for a secondary button:

```html
<a href="#" class="ph3 pv2 ba br3 green b--green bg-white">
  I'm Also Here
</a>
```

<aside style="margin: 1rem;">
<a href="#" onclick="return false" style="display: inline-block; padding: 1rem 2rem; border: solid thin green; border-radius: 4rem; background: white; color: green;">
  I'm also here
</a>
</aside>

This is similar to our original button, but uses different colors.  It also has a slightly different design. Our primary button is a solid background whereas our secondary button has an outline.

We could allow the re-use of the common classes as a parameter to our helper:

```ruby
def button(label,href, colors: "white b--green bg-green")
  link_to label, href, class: "ph3 pv2 ba br3 #{colors}"
end
```

Which is used thusly:

```erb
<%= button("I'm Also Here", "#",
           colors: "green, g--green bg-white") %>
```

This can become unwieldy.  If we acknowledge that we *do* have a reusable component on our hands,
it might be better if we had a class like `button-base` that defined everything about every
button that is consistent.  We could then use it like so:

```html
<a href="#" class="button-base white b--green bg-green">
  Click Me
</a>
<a href="#" class="button-base green b--green bg-white">
  I'm also here
</a>
```

The problem is that it's not clear how to do this without some uncomfortable duplication.

```css
.button-base {
  border-style: solid;
  padding: ???;
  border-radius: ???;
}
```

To provide values for `padding` and `border-radius` we can duplicate the sizes, thus creating
problematic duplication:

```css
.button-base {
  border-style: solid;
  padding: 2rem 4rem;  /* Where did these values come from?! */
  border-radius: 2rem; /* Where did these values come from?! */
}
```

We could use CSS variables, assuming Tachyons makes them available:

```css
.button-base {
  border-style: solid;
  padding: var(--spacing-small)
           var(--spacing-medium);
  border-radius: var(--border-radius-medium);
}
```

This re-uses our design system, but now we have two ways to specify values: the classes that
Tachyons provides, and the variables it uses to produce its classes.

[SASS](https://sass-lang.com) allows us to address this.

## SASS Can Re-use Classes

If we use the Tachyons SASS port, we can do this:

```scss
.button-base {
  @extend .ph3;
  @extend .pv2;
  @extend .ba;
  @extend .br3;
}
```

This is the best of all worlds:

* Whenever we specify a CSS property, we have exactly one way to do it: using the Tachyons class, either directly in our HTML, or via `@extend` in SASS.
* We don't have to name components that aren't reusable just so we can style them.
* We *can* name components that *are* reusable to control how our design system evolves and allow new code to more easily know what standard styles are in place: any class defined in our main `.scss` file is an intended-to-be-reused component.


This technique also provides benefits when you need to write CSS to solve a problem Tachyons
cannot.

## SASS `@extend` Works for Complex Components, too

An example of something that Tachyons alone cannot easily style is a custom checkbox, where you need to style against pseudo-selectors to achieve the design.  I'm sure there are other ways to do this, but this is a way I have done it that demonstrates the technique.

Instead of using Tachyons classes in our HTML, we change to a [BEM-like](https://getbem.com/introduction/) style:

```html
<div class="styled-checkbox-container">
  <label for="confirm">
    <input type="checkbox" id="confirm">
    <div class="styled-checkbox">
      <div class="styled-checkbox-check">&check;</div>
    </div>
    <div class="styled-checkbox-label">
      I get it
    </div>
  </label>
</div>

```

We define `.styled-checkbox-container`, `.styled-checkbox`, `.styled-checkbox-check`, and
`.styled-checkbox-label` in our app's `.scss` file, which will be just a series of `@extend`
calls to Tachyons classes:

```scss
.styled-checkbox-container input[type=checkbox] {
  @extend .absolute; // absolute position
  @extend .o-0:      // opacity 0
}

.styled-checkbox-container input ~ .styled-checkbox {
  @extend .b--moon-gray; // border moon gray
  @extend .ba;           // has a border
  @extend .dib;          // display inline block
  @extend .h2;           // height using 2nd level of scale
  @extend .pointer;      // pointer cursor on hover
  @extend .tc;           // text centered
  @extend .w2;           // width using 2nd level of scale
  .styled-checkbox-check {
    @extend .dn;         // display none
    @extend .f4;         // font size is fourth in our scale
    @extend .pa1;        // padding first in scale
  }
}
.styled-checkbox-container input ~ .styled-checkbox {
  @extend .br2;          // border radius 2nd in scale
}

.styled-checkbox-container input ~ .styled-checkbox-label {
  @extend .b--transparent; // transparent border
  @extend .ba;             // has a border
  @extend .br2;            // radius second in scale
  @extend .dib;            // display inline block
  @extend .f4;             // font size fourth in scale
  @extend .fw3;            // font weight 300
  @extend .ml2;            // margin left second in scale
  @extend .pa2;            // padding second in scale
  @extend .w-80;           // 80% width
}
```

<div data-ad></div>

Again, we have exactly one way to set CSS properties - the Tachyons classes.  And again, this is
the best of all worlds because we *can* do this if we need to, with a minimum of duplication, but
we don't have to.

And, we don't need a complicated JavaScript toolchain. We just need SASS, which is
a battle-hardened, build-time-only, stable tool.

