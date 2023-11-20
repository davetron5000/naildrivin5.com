---
layout: post
title: "What is WebComponents Buying Us?"
date: 2023-11-17 9:00
ad:
  title: "SIMPLIFY, MAN!"
  subtitle: "A Modern Framework to Make Great Web Apps"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
related:
  - "Web Components Custom Elements Lifecycle is What Makes Them Useful"
  - "Ruby on Rails: Still the Best Web App Framework for Most Teams"
  - "Web Components: Templates, Slots, and Shadow DOM Aren't Great"
---

People saying that "Web Components are having a moment" should look at the difference between Web Components and just using
the browser's API.  They are almost identical, so much so that I'm struggling to understand the point of Web Components at
all.

Let's take [Jim Neilsen's user avatar example](https://blog.jim-nielsen.com/2023/html-web-components-an-example/) and compare
his implementation to one that doesn't use Web Components.  This will help us understand why there is so much client-side
framework churn.

<!-- more -->

<aside style="padding: 1rem; border: solid thin #770000; background-color: #fffdfd; border-radius: 0.5rem">
    <strong style="color: #770000">Update on Nov 19, 2023:</strong> Based on reader feedback, I don't think custom elements are completely useless. See <a href="/blog/2023/11/19/web-components-custom-elements-lifecycle-is-what-makes-them-useful.html"> the follow up</a> for more details. Leaving this post as-is for posterity.
</aside>


<strong>Update on Nov 18, 2023:</strong> Added CodePens for all code + slight tweaks to the code to make it more clear what
behavior is dynamic.

Here's Jim's code, slightly modified.  HTML would look like so:

```html
<user-avatar>
  <img
    src="/images/DavidCopelandAvatar-512.jpeg"
    alt="Profile photo of Dave Copeland"
    width="64"
    height="64"
    title="Dave Copeland"
  />
</user-avatar>
```

Jim then uses the Web Components API to add a fancier tooltip via progressive enhancement.

The call to `customElements.define` is what registers the custom element, which must extend `HTMLElement`.  `connectedCallback` is part of `HTMLElement`'s API and is called by the browser when the element is "added to the document".

```html
<script>
  class UserAvatar extends HTMLElement {
    connectedCallback() {                 
      // Get the data for the component from exisiting markup
      const $img = this.querySelector("img");
      const src = $img.getAttribute("src");
      const name = $img.getAttribute("title");

      // Create the markup and event listeners for tooltip...

      // Append it to the DOM
      this.insertAdjacentHTML(
        'beforeend', 
        `<div>tooltip ${name}</div>`,
      );
    }
  }
  customElements.define('user-avatar', UserAvatar);
</script>
```

[Here is the CodePen](https://codepen.io/davetron5000/pen/zYeRYYJ) of this code.  I did change Jim's code slightly so you
could see the effect of the custom element (the `<div>`).

Jim is making a case for progressive enhancement and showing how to do that with a custom element.

But, most of the code is using the browser's API for DOM manipulation, which has existed for quite some time.

We could achieve the same thing without a custom element. We can add `data-tooltip` to the `<img>` tag to indicate it should have the fancy tooltip, like so:

```html
<div data-tooltip>
<img src="https://naildrivin5.com/images/DavidCopelandAvatar-512.jpeg"
     alt="Profile photo of Dave Copeland"
     width="64"
     height="64"
     title="Dave Copeland"
     />
</div>
```

To progressively enhance this, we can use the same code, without the use of custom elements:

```html
<script>
document.querySelectorAll("[data-tooltip]").
  forEach( (element) => {
    // Get the data for the component from exisiting markup
    const $img = element.querySelector("img")
    const src = $img.getAttribute("src");
    const name = $img.getAttribute("title");

    // Create the markup and event listeners for tooltip...

    // Append it to the DOM
    element.insertAdjacentHTML(
      'beforeend', 
      `<div>tooltip ${name}</div>`
    );
  })
```

Here is the [CodePen](https://codepen.io/davetron5000/pen/dyadyPx) of this.

I'm struggling to see what the benefit is of the custom element.  It doesn't affect accessibility as far as I can tell.  I
suppose it stands out more in the HTML that something extra is happening.

We can see a bit more of the difference if we enhance these components to be more suitable for actual use in production.

## Hello `if` Statements, My Old Friends

Jim said his code is for illustration only, so it's OK that it doesn't handle some error cases, but there is some interesting
insights to be had if we handle them.

There are two things that can go wrong with Jim's code:

* If the `<user-avatar>` element doesn't contain an `<img>` element, calls to `getAttribute()` will produce "null is not
an object".
* If the `<img>` attribute *is* present, but is missing a `src` or `name`, presumably the tooltip cannot be created.

You can see both issues [in this CodePen](https://codepen.io/davetron5000/pen/jOdZOra?editors=1111)

Addressing these issues requires deciding what should happen in these error cases.  Let's follow the general vibe of
progressive enhancement—and the web in general—by silently failing.

```javascript
class UserAvatar extends HTMLElement {
  connectedCallback() {
    // Get the data for the component from exisiting markup
    const $img = this.querySelector("img");
    if (!$img) {
      return
    }
    const src   = $img.getAttribute("src");
    const title = $img.getAttribute("title");
     if (!src) {
       return
     }
     if (!title) {
       return
     }

    // Create the markup and event listeners for tooltip...

    // Append it to the DOM
    this.insertAdjacentHTML(
      'beforeend', 
      `<div>tooltip ${name}</div>`
    );
  }
}
customElements.define('user-avatar', UserAvatar);
```

(see [CodePen](https://codepen.io/davetron5000/pen/rNPJNMq?editors=1111) version)

This has made the routine more complex, and I wish the browser provided an API to help make this not so verbose.  This is why
people make frameworks.

The vanilla version needs to perform these checks as well.  Interestingly, it can achieve this without any `if` statements by
crafting a more specific selector to `querySelectorAll`:

```javascript
document.querySelectorAll("[data-tooltip]:has(img[src][title])").
  forEach( (element) => {
    // Get the data for the component from exisiting markup
    const $img = element.querySelector("img")

    const src  = $img.getAttribute("src");
    const name = $img.getAttribute("title");

    // Create the markup and event listeners for tooltip...

    // Append it to the DOM
    element.insertAdjacentHTML(
      'beforeend', 
      `<div>tooltip ${name}</div>`
    );
  })
```

(see [CodePen](https://codepen.io/davetron5000/pen/Jjxpjbq?editors=1011) version).

It is perhaps happenstance that this example can be made more defensive with just a specific selector.  I don't want to imply
the vanilla version would never need `if` statements, but it certainly wouldn't require any more than the Web Components
version.

I fail to see the benefit of using a custom element. It doesn't simplify the code at all.  The custom element perhaps jumps
out a bit more that something special is happening, but I don't think it enhances accessibility or provides any other benefit
to users or developers.

## What Problem Are We Solving?

Whether you are using progressive enhancement or full-on client-side rendering, the job of the JavaScript is the same:

1. Locate the elements of the document that will need to change.
2. Identify the events you want to respond to.
3. Ensure all input and configuration needed to control behavior is available.
4. Wire up the events to the document based on the inputs and configuration.

In the User Avatar example, both versions address these steps almost identically:

<figure class="dn db-ns">
  <table style="width: auto;" class="border-rows">
    <thead>
      <tr>
        <th class="text-l">Step</th>
        <th class="text-l">Web Components</th>
        <th class="text-l">Vanilla</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="text-l nowrap">1 - Locate</th>
        <td class="text-l">
          <code>querySelector</code> + defensive <code>if</code> statements
        </td>
        <td class="text-l">
          <code>querySelectorAll</code> with specific selectors + defensive <code>if</code> statements
        </td>
      </tr>
      <tr>
        <th class="text-l nowrap">2 - Events</th>
        <td class="text-l">
          N/A, but presumably <code>querySelector</code>, defensive <code>if</code> statements, and <code>addEventListener</code>
        </td>
        <td class="text-l">
          N/A, but presumably <code>querySelector</code>, defensive <code>if</code> statements, and <code>addEventListener</code>
        </td>
      </tr>
      <tr>
        <th class="text-l nowrap">3 - Configuration</th>
        <td class="text-l">
          <code>getAttribute</code> + defensive <code>if</code> statements
        </td>
        <td class="text-l">
          <code>getAttribute</code> + defensive <code>if</code> statements
        </td>
      </tr>
      <tr>
        <th class="text-l nowrap">4 - Integration</th>
        <td class="text-l">
          Code inside <code>connectedCallback</code>
        </td>
        <td class="text-l">
          Code inside <code>forEach</code>
        </td>
      </tr>
    </tbody>
  </table>
</figure>
<figure class="db dn-ns text-l">
<ol class="pl0">
  <li>
    <strong>Locate</strong>
    <ul class="pl0">
      <li>
        <i>Web Components</i> - <code>querySelector</code> + defensive <code>if</code> statements
      </li>
      <li>
        <i>Vanilla</i> - <code>querySelectorAll</code> with specific selectors + defensive <code>if</code> statements
      </li>
    </ul>
  </li>
  <li>
    <strong>Events</strong>
    <ul class="pl0">
      <li>
        <i>Web Components</i> - N/A, but presumably <code>querySelector</code>, defensive <code>if</code> statements, and <code>addEventListener</code>
      </li>
      <li>
        <i>Vanilla</i> - N/A, but presumably <code>querySelector</code>, defensive <code>if</code> statements, and <code>addEventListener</code>
      </li>
    </ul>
  </li>
  <li>
    <strong>Configuration</strong>
    <ul class="pl0">
      <li>
        <i>Web Components</i> - <code>getAttribute</code> + defensive <code>if</code> statements
      </li>
      <li>
        <i>Vanilla</i> - <code>getAttribute</code> + defensive <code>if</code> statements
      </li>
    </ul>
  </li>
  <li>
    <strong>Integration</strong>
    <ul class="pl0">
      <li>
        Web Components - Code inside <code>connectedCallback</code>
      </li>
      <li>
        Vanilla - Code inside <code>forEach</code>
      </li>
    </ul>
  </li>
</ol>
</figure>

The reason these approaches are so similar is that the Web Components APIs aren't a high level API for the existing DOM APIs, with one seldomly-needed exception<sup id="back-1"><a href="#1">1</a></sup>.

React, however, *does* provide such an API, but at great cost.

<figure class="dn db-ns">
  <table style="width: auto;" class="border-rows">
    <thead>
      <tr>
        <th class="text-l">Step</th>
        <th class="text-l">Web Components</th>
        <th class="text-l">React</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="text-l nowrap">1 - Locate</th>
        <td class="text-l">
          <code>querySelector</code> + defensive <code>if</code> statements
        </td>
        <td class="text-l">
          React generates the HTML entirely.
        </td>
      </tr>
      <tr>
        <th class="text-l nowrap">2 - Events</th>
        <td class="text-l">
          N/A, but presumably <code>querySelector</code>, defensive <code>if</code> statements, and <code>addEventListener</code>
        </td>
        <td class="text-l">
           <code>addEventListener</code> + React's synthetic events (which are complex).
        </td>
      </tr>
      <tr>
        <th class="text-l nowrap">3 - Configuration</th>
        <td class="text-l">
          <code>getAttribute</code> + defensive <code>if</code> statements
        </td>
        <td class="text-l">
          Props hash with limited validations.
        </td>
      </tr>
      <tr>
        <th class="text-l nowrap">4 - Integration</th>
        <td class="text-l">
          Code inside <code>connectedCallback</code>
        </td>
        <td class="text-l">
          Code inside <code>render</code>
        </td>
      </tr>
    </tbody>
  </table>
</figure>
<figure class="dn-ns db text-l">
  <ol class="pl0">
    <li><strong>Locate</strong>
      <ul class="pl0">
        <li>
          <i>Web Components</i> - <code>querySelector</code> + defensive <code>if</code> statements
        </li>
        <li>
          <i>React</i> - generates the HTML entirely.
        </li>
      </ul>
    </li>
    <li><strong>Events</strong>
      <ul class="pl0">
        <li>
          <i>Web Components</i> - N/A, but presumably <code>querySelector</code>, defensive <code>if</code> statements, and <code>addEventListener</code>
        </li>
        <li>
           <i>React</i> - <code>addEventListener</code> + React's synthetic events (which are complex).
        </li>
      </ul>
    </li>
    <li><strong>Configuration</strong>
      <ul class="pl0">
        <li>
          <i>Web Components</i> - <code>getAttribute</code> + defensive <code>if</code> statements
        </li>
        <li>
          <i>React</i> - Props hash with limited validations.
        </li>
      </ul>
    </li>
    <li><strong>Integration</strong>
    <ul class="pl0">
    <li>
      <i>Web Components</i> - Code inside <code>connectedCallback</code>
    </li>
    <li>
      <i>React</i> - Code inside <code>render</code>
    </li>
    </ul>
    </li>
  </ol>
</figure>

React may look nicer in this analysis, but React comes at great cost: you must adopt React's complex
and brittle toolchain. If you want server-side rendering, that is another complex and brittle toolchain.  If you want to use
TypeScript to make props validation more resilient, that is a third complex toolchain, along with untold amounts of
additional complexity to the  management of your app.

React essentially elimilnates `if` statements from Step 1—locating DOM elements—at the cost of significant complexity to your
project.  It doesn't offer much that's compelling to the other steps we need to take to set up a highly dynamic UI.

## Why is There no Standard API for This?

<div data-ad></div>

The browser has a great low-level API but no real higher level abstraction.  It seems reasonable that the browser wouldn't
provide some high-level component-style framework, but that doesn't mean it can't provide a better API to wrap the
lower-level DOM stuff.  Who uses those APIs and *doesn't* need to check the existence of elements or attributes that are
required for their use-case?

A web page is a document comprised of elements with attributes.  Those elements—along with the browser itself—generate
events.  *This* is what a web page is.  Abstractions built on that seem logical, but they don't exist in general, and the
browser definitely is't providing them.

React and friends *are* abstractions, but they are top down, starting from some app-like component concept that is
implemented in terms of elements, attributes, and events.  And those abstractions are extremely complex for, as we've seen,
not a whole lot of benefit, especially if you are wanting to do progressive enhancement.

React and the like just don't make it that much easier to locate elements on which to operate, register the events, manage configuration, and wire it all up.  And they create a conceptual wrapper that doesn't really help make accessible, responsive, fast web experiences.  But you can see why they are there, because the browser has no answer.

## Appendix on Shadow DOM and `<template>`

`<template>` exists and can be used to generate markup.  This is only useful for client-side rendering and the Web Components
API does not provide almost any additional features to manage templates.  It will automatically use `<slot>` elements, so if
you have this HTML

```html
<template id="my-template">
  <h2>Hello</h2>
  <h3>
    <slot name="subtitle">there!</slot>
  </h3>
</template>
```

Assuming you manually load the template, manually clone it, manually add it to the Shadow DOM, it allows this:

```html
<my-component>
  <span slot="subtitle">Pat</span>
</my-component>
```

to generate this HTML:

```html
<h2>Hello</h2>
<h3>
  <span>Pat</span>
</h3>
```

You don't have to locate the `<slot>` elements, or match them up and dynamically replace them.


Of note:

* `<slot>`s cannot be used for attributes, only for elements.
* You must use the Shadown DOM for this to work, and Shadow DOM adds constraints you may not want.

I can't see why you would use slots, given all this. Having to adopt the Shadow DOM is incredibly constraining. You cannot
use your site's CSS without hacky solutions to bring it in.

See this in action in [this CodePen](https://codepen.io/davetron5000/pen/zYepgVZ).

As a vehicle for re-use, Web Components, `<template>`, `<slot>`, and the Shadow DOM don't seem to provide any real
benefit over the browser's existing DOM-manipualtion APIs.

<aside style="padding: 1rem; border: solid thin #770000; background-color: #fffdfd; border-radius: 0.5rem">
    <strong style="color: #770000">Update on Nov 19, 2023:</strong> Based on reader feedback, I don't think custom elements are completely useless. See <a href="/blog/2023/11/19/web-components-custom-elements-lifecycle-is-what-makes-them-useful.html"> the follow up</a> for more details. Leaving this post as-is for posterity.
</aside>

----

<footer class='footnotes'>
<ol>
<li id="1">
<a name='1'></a>
<sup>1</sup>The only rich API Web Components provides is <code>attributeChangedCallback()</code>, which provides a pretty decent way to be notified when your custom element's attributes have been changed.  This can be achieved with <code>MutationObserver</code>, but it's much more verbose.  Nevetheless, I struggle to identify a remotely common use-case for this, especially in light of the <strong>far</strong> more common use-case of "make sure an element I need to attach behavior to is in the DOM so I don't get 'undefined is not a
function'".<a href='#back-1'>↩</a>
</li>
</ol>
