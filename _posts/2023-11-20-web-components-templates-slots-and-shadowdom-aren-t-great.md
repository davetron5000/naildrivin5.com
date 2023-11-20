---
layout: post
title: "Web Components: Templates, Slots, and Shadow DOM Aren't Great"
date: 2023-11-20 9:00
ad:
  title: "Spend some Time on The Back-End"
  subtitle: "Advanced Topics on Sidekiq"
  link: https://pragprog.com/titles/dcsidekiq/ruby-on-rails-background-jobs-with-sidekiq/
  image: "/images/sidekiq-rails-cover.jpg"
  cta: "Buy Now $9.99"
related:
  - "What is WebComponents Buying Us?"
  - "Web Components Custom Elements Lifecycle is What Makes Them Useful"
---

In two [previous][first] [posts][second], I explored the custom elements part of Web Components, concluding that the lifecycle callbacks provide value beyond rolling your own.  I want to look at the other two parts of Web Components, which are the Shadow DOM and the `<template>` tag. These provide a templating mechanism that doesn't work like any other web application templating environment and is incredibly limiting to the point I must be just not understanding.

[first]: /blog/2023/11/17/what-is-lightdom-webcomponents-buying-us.html
[second]: /blog/2023/11/19/web-components-custom-elements-lifecycle-is-what-makes-them-useful.html

<!-- more -->

Let's start with the [`<template>` element](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element).
This element allows you to place markup into the DOM that is ignored by the browser and has no semantic meaning.  This is
pretty useful, because the only way to approach this is to do something hacky like make a `div` with `role="presentation"` or
something.

Here is how you could use it.  Let's create a template `<figure>` to show a random picture from `picsum.photos`:

```html
<template id="pic">
  <figure>
    <img width="64" />
    <figcaption />
  </figure>
</template>
<button>Create Picture</button>
<section>
  <!-- dynamically created figures will go here -->
</section>
```

The `<template>` is available via normal DOM API calls, however it's contents are *not* its children, so to use the
template's contents, you must use [`.content`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content) to access them.  This returns a
[`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment), which you can then clone via
`cloneNode(true)`.  The clone can be manipulated and inserted into the DOM:

```javascript
const template = document.getElementById("pic")
const button   = document.querySelector("button")
const section  = document.querySelector("session")
const content  = template.content

button.addEventListener("click", (event) => {
  event.preventDefault()

  const node    = content.cloneNode(true)
  const img     = node.querySelector("figure img")
  const caption = node.querySelector("figure figcaption")

  const randomNumber = Math.round(Math.random() * 200)

  img.setAttribute("src",`https://picsum.photos/${randomNumber}`)
  img.setAttribute("alt","Random picture")

  caption.innerText = `Picsum ${randomNumber}`

  document.body.appendChild(node)
})
```

You can [see this in action on CodePen](https://codepen.io/davetron5000/pen/XWOZmdx). Each time you click the button, a new
node is inserted (note that it will appear slow because `picsum.photos` is slow—the code executes quickly). Note that the
CodePen includes the following CSS, which isn't needed for the functionality, but which will become relevant later:

```css
figure {
  padding: 1rem;
  border: solid thin grey;
  border-radius: 1rem;
}
figure img {
  border-radius: 0.5rem;
}
figure figcaption {
  font-weight: bold;
}
```

## Where Templates Fall Down

This isn't what most web developers think of as a template.  For as long as I can remember, templates for web apps provided a
more direct way to insert dynamic elements.  If we created a Rails version of this template, it might look like so:

```rhtml
<!-- views/partials/_pic.html -->
<figure>
  <img width="64" 
       src="<%= image_src %>"
       alt="<%= image_alt %>" />
  <figcaption>
    <%= caption %>
  </figcaption>
</figure>
```

<div data-ad></div>

There would then be code to set `image_src`, `image_alt`, and `caption` in much the same way as our JavaScript does above.

The `<template>` version really doesn't make it clear what is going to be set dynamically, though perhaps it's a feature that
you can manipulate any part of the internals.  Almost all web app templating systems boil down to string manipulation, and
the `<template>` version of the code is more sophisticated, as it can manipulate the DOM using the browser's APIs.

That seems useful, but, as we will see, will result in a ton of verbose low-level code.

That said, custom elements can add some features to templates, so let's change this to a custom element that can display a
picture and a caption.

## Using Templates in Custom Elements

Instead of a button to create a random picture, let's create a `picsum-pic` element.  For this example, we'll use it four
times: twice in the normal way, once omitting the caption, and once omitting everything.  This will allow us to understand
all reasonable edge cases.

```html
<template id="pic">
  <figure>
    <img width="64" />
    <figcaption />
  </figure>
</template>

<picsum-pic number="123"
            caption="Moon rocks">
</picsum-pic>

<picsum-pic number="665"
            caption="Mountain trail">
</picsum-pic>

<picsum-pic number="12">
</picsum-pic>

<picsum-pic>
</picsum-pic>
```

The `<template>` is the same as before, as is the CSS.  For the JavaScript, we'll extend `HTMLElement`.  In the constructor, we'll grab `number` and `caption`:

```javascript
class PicsumPic extends HTMLElement {
  constructor() {
    super()
    this.number = this.getAttribute("number")
    this.caption = this.getAttribute("caption")
  }
```

Next, we'll implement `connectedCallback` to run basically the same code we saw earlier, however we'll follow the vibe of
silent failures and do nothing if there is no `number` and omit the `<figcaption>` if there is no caption. We'll also define
the custom element as `picsum-pic` after the class definition.

```javascript
  connectedCallback() {
    const template = document.getElementById("pic");
    const content  = template.content;
    const node     = content.cloneNode(true);

    const img     = node.querySelector("figure img");
    const caption = node.querySelector("figure figcaption");

    if (!this.number) {
      return
    }
    img.setAttribute("src", `https://picsum.photos/id/${this.number}/200`);
    if (this.caption) {
      img.setAttribute("alt", this.caption)
      caption.innerText = this.caption      
    }
    this.appendChild(node);
  }
}
customElements.define("picsum-pic",PicsumPic)
```

You can [see this in action on CodePen](https://codepen.io/davetron5000/pen/BaMYoRW).

There are two things that aren't great about this:

* We have to manually grab the attributes from the custom element.
* The way we manage dynamic data feels super manual and low-level.

## Accessing Attributes via Lifecycle Callback

Given that our `connectedCallback()` can handle the situation when `number` or `caption` are omitted, we can make use of the
lifecycle callback method `attributeChangedCallback()`, which will be called if an attribute we are observing is changed.
Crucially, this callback is called when the attributes are given their initial values<sup id="fn_1"><a href="#1">1</a></sup>

First, we must declare a static member named `observedAttributes` like so:

```javascript
class PicsumPic extends HTMLElement {
  static observedAttributes = [
    "number",
    "caption",
  ]
```

Then, if the values for `number` or `caption` change—including being given their initial values—the method
`attributeChangedCallback` will be called.  We can remove the `constructor()` and add that method instead:

```javascript
attributeChangedCallback(name,oldValue,newValue) {
  this[name] = newValue
}
```

The custom element works the same way, as you can [see in the CodePen](https://codepen.io/davetron5000/pen/ExrQVwJ).  That's
nice!

But, `attributeChangedCallback` is called *anytime* the attributes are changed, so we really should respond to those changes
and update the state of the custom element's child nodes.  Doing this requires a significant change in the class, but let's
look at that.

## Responding to Attribute Changes

First, let's change the HTML to allow a form to submit a number and a caption:

```html
<template id="pic">
  <figure>
    <img width="64" />
    <figcaption />
  </figure>
</template>
<picsum-pic />
<form>
  <label for="number">
    Number
    <input type="text" name="number" id="number">
  </label>
  <label for="caption">
    Caption
    <input type="text" name="caption" id="caption">
  </label>
  <button>View Pic</button>
</form>
```

Next, we'll add some code to grab the input values when the button is clicked and pass those along to the custom element:

```javascript
const numberInput  = document.querySelector("input[name='number']")
const captionInput = document.querySelector("input[name='caption']")
const button       = document.querySelector("button")
const picsumPic    = document.querySelector("picsum-pic")

button.addEventListener("click", (event) => {
  event.preventDefault()

  const number  = numberInput.value
  const caption = captionInput.value

  picsumPic.setAttribute("number", number)
  picsumPic.setAttribute("caption", caption)
});
```

I'll be honest, I'm not sure the best way to structure the custom element's code, so what I did was to create `updatePic` and
`updateCaption` to handle updating their respective bits of the element, and calling them from `connectedCallback` as well as
`attributeChangedCallback`.

Here's `attributeChangedCallback`:

```javascript
attributeChangedCallback(name, oldValue, newValue) {
  this[name] = newValue
  this.updatePic()
  this.updateCaption()
}
```

For `connectedCallback`, it's a bit tricky because we need the `Element` that is inserted into the DOM.  The only way I could
find to do this was to access `firstElementChild` from the cloned `Node`.  This won't work if the `<template>` contains
mulitple nodes at the top<sup id="fn_2"><a href="#2">2</a></sup>. I'll save that as an instance variable so that
`updatePic` and `updateCaption` can use it:

```javascript
connectedCallback() {
  const template = document.getElementById("pic")
  const content  = template.content
  const node     = content.cloneNode(true)

  this.element = node.firstElementChild

  this.updatePic()
  this.updateCaption()
  this.appendChild(node)
}
```

Now, `updatePic()` will handle updating the `<img>` element.  If `this.element` isn't defined, it will do nothing.  If
`this.number` is defined, it'll set the `src` attribute, otherwise clear it.  If `this.caption` is defined, it'll set the
`alt` attribute, otherwise clear it.

```javascript
updatePic() {
  if (!this.element) {
    return;
  }

  const img = this.element.querySelector("figure img");
  if (this.number) {
    img.setAttribute("src", `https://picsum.photos/id/${this.number}/200`);
  } else {
    img.removeAttribute("src");
  }

  if (this.caption) {
    img.setAttribute("alt", this.caption);
  } else {
    img.removeAttribute("alt");
  }
}
```

Lastly, `updateCaption` will work similarly:

```javascript
updateCaption() {
  const caption = this.element.querySelector("figure figcaption");
  if (this.caption) {
    caption.innerText = this.caption;
  } else {
    caption.innerText = "";
  }
}
```

You can [see this working on CodePen](https://codepen.io/davetron5000/pen/vYbdNRK).

This is pretty complex, and if you write React or Vue or anything, it probably feels very verbose.  If you were to do
this without `attributeChangedCallback`, you'd need to use `MutationObserver` and it would be even more verbose and
complicated that what we have here. So, `attributeChangedCallback` does save some code and is useful.

OK, so that handles managing the attributes, but is there a way to improve how dynamic data is set?

The answer is…sort of.

## Slots…Are a Part of the Spec, I Can Say That Much for Them

The `number` attribute is used to create a URL that is then placed into the `src` attribute of the `<img>` tag.  The
`caption` attribute is kinda dumped into `<figcaption>` and it turns out we can avoid managing that by using *slots*.

Slots are not super great, and they come at great cost. Let's see.

The way they work is that you put markup inside your custom element and add the `slot` attribute.  If the template contains a
`<slot>` element, it is replaced with the markup with the `slot` attribute.

For example, here is our updated template:

```html
<template id="pic">
  <figure>
    <img width="64" />
    <figcaption>
      <slot name="caption" />
    </figcaption>
  </figure>
</template>
```

If we use our custom element like so:

```html
<picsum-pic>
  <h3 slot="caption">Some Caption</h3>
</picsum-pic>
```

…it can produce the following HTML (but requires a small change in our code, which we'll see in a second):

```html
<figure>
  <img width="64" />
  <figcaption>
    <h3>Some Caption</h3>
  </figcaption>
</figure>
```

So, what is this change? The change is that we must use the *Shadow DOM*, which creates a completely isolated document where
our custom element's markup will go and that document is inserted where we've referenced the custom element. If none of that
sounds like it has anything to do with dynamic replacement of information in a template, you are not alone.

Shadow DOM has a few implications, but the immediate one is that *slots don't work* if you aren't using the Shadow DOM. I
don't know why.

Here is the updated `connectedCallback`.  Instead of appending the child to the custom element, we attach a *Shadow Root* to
the element (via `attachShadow`), then call `appendChild` on that. It is during this part of the process that the slots are
used.

```javascript
connectedCallback() {
  const template = document.getElementById("pic");
  const content  = template.content;
  const node     = content.cloneNode(true);

  this.element = node.firstElementChild;

  this.updatePic();
  const shadowRoot = this.attachShadow({ mode: "open" });
  shadowRoot.appendChild(node);
}
```

`attributeChangedCallback()` no longer needs to call `updateCaption`.  In fact, `updateCaption` can be removed.

```javascript
attributeChangedCallback(name, oldValue, newValue) {
  this[name] = newValue;
  this.updatePic();
}
```

Our form-handling code will now need to set the `innerText` of the slot to the value of the caption:

```javascript
button.addEventListener("click", (event) => {
  event.preventDefault();

  const number      = numberInput.value;
  const caption     = captionInput.value;
  const captionSlot = picsumPic.querySelector("[slot='caption']")

  picsumPic.setAttribute("number", number);
  captionSlot.innerText = caption;
});
```

Lastly, we will remove some code from `updatePic` that used the caption to get the alt text.

```javascript
  updatePic() {
    if (!this.element) {
      return;
    }

    const img = this.element.querySelector("figure img");
    if (this.number) {
      img.setAttribute(
            "src",
            `https://picsum.photos/id/${this.number}/200`);
    } else {
      img.removeAttribute("src");
    }
  }
```

You [can see this on CodePen](https://codepen.io/davetron5000/pen/dyadYaM).  It's…sort of working.

I believe the alt text could still be set like it was before, but it requires digging into the slotted element, which is now
potentially more than just text, and figuring out how to turn that into alt text.  You can fork the CodePen if you want to
try :)

That said, the behavior where the `<h3 slot="caption">` is being put into the custom element is working.  Despite the
limitations on what can be inserted where, this is a nice bit of functionality to not have to write ourselves.

What's *not* working is our styles.  Way back at the top, I put a border around the component and put a border radius on the image.  Those aren't there any more.

This is the Shadow DOM.  Our document fragment cannot access the document's stylesheet.  This is by design.

## Shadow DOM's Limitations

The DOM tree created by `shadowRoot.appendChild(node)` is encapsulated from the rest of the DOM tree.  This means that CSS
does not affect it (it also means the way JavaScript interacts is different, but that's another post).

In order to style the `<figure>`, `<img>`, and `<figcaption>`, we must provide styles to the markup separately.  There are a
lot of ways of doing this, but if we want our custom element to use our global styles, it's a huge pain.

To demonstrate *a* way to do this, we can create a `<style>` element, add that to the `shadowRoot`, like so:

```javascript
const style = document.createElement("style");
style.innerText = `
figure:has(img[src]) {
  padding: 1rem;
  border: solid thin grey;
  border-radius: 1rem;
}
figure img {
  border-radius: 0.5rem;
}
figure figcaption {
  font-weight: bold;
}`;
shadowRoot.appendChild(style);
```

This is…gross. It's not sustainable at all.  If you use utility CSS, this becomes a total nightmare. Yes, you can put a
`<link>` tag into the Shadow DOM root, but it's *incredibly* slow when you have more than few components on the page.


Konnor Rogers has a [detailed blog post](https://konnor.netlify.app/posts/2023/web-components-tailwind-and-ssr/)  on various
options to do this with Tailwind, which are somewhat generalizable.  They will at least give you an example of what you are up against.  Some options are better than others, but this seems like there is friction no matter what.  They all seem like using the Shadow DOM in a way that was not intended.

To be honest, I'm not sure *how* the Shadow DOM is intended to be used or *how* styles are intended to be managed. Even if you use semantic CSS everywhere (e.g. hanging styles off of a semantic `class=` value), you still need access to a shared set of custom properties that define the design system's fonts, colors, sizes, and spacings.  There's no obvious way to share
that with elements inside a Shadow DOM.

*And* it is super odd to me that these two features are intertwined.  Why does using templates and slots require using a
Shadow DOM?  It makes no sense to me.

## What Web Components Do Is Not Much…but Not Nothin'

From what I can tell, the Web Components APIs provide a two things that you can't do any other way:

* Receive code callbacks during DOM lifecycle events, such as the addition/removal of elements or the modification of attributes.
* Isolate a document, its CSS, and its JavaScript from the larger document containing it.

Custom elements and Shadow DOM are just the way you access these features.

What seem like design errors to me are:

* Inability to replace attributes in a `<template>`
* Coupling of `<slot>` behavior with Shadow DOM
* Inability to allow Shadow DOM to access some global styles or some code
* Inability to package a custom element for re-use with a single line of code

Still missing, after years, is a way to locate elements defensively.  Events are still wired and managed by ensuring magic
strings are the same across the codebase.  And now, with Web Components, we can use undefined custom elements without an
error or even a warning, and specify markup for a nonexistent slot.

The web's vibe of silently failing with no messaging on code that is 99.44% buggy is endlessly frustrating.  It is the
biggest driver of the creation and adoption of frameworks.

Presumably, existing frameworks will refactor their internals to use these APIs under the covers where it makes sense.  New
frameworks will continue to be built using these APIs.  But there is no world in which "Web Components" are the alternative
to stuff like React, Vue, or Angular. Building re-usable code using only the APIs provided by the browser will still leave
you wanting more.  Which means the continuation of internal and open source frameworks.

----

<footer class='footnotes'>
<ol>
<li id="1">
<sup>1</sup>I really tried reading the spec, but it's impenetrable to me.  MDN's documentation on
<code>attributeChangedCallback</code> is pretty vague on when it is called.  To be honest, this is one of the major problems
with Web Components is that the spec is unreadable to someone who is not building a web browser, and ancillary documentation
is Webpack-level terrible. It's nothing but vague descriptions and happy-path-only examples. <a href='#fn_1'>↩</a>
</li>
<li id="2">
<sup>2</sup>I think it might not be allowed for <code>&lt;template&gt;</code> to have more than one child node inside it, but
the spec, again, is impenetrable to me.  And, let's be honest, even if it is not allowed, the entire way the web handles
errors is to just let them happen and silently break everything. <a href='#fn_2'>↩</a> </li>
</ol>
