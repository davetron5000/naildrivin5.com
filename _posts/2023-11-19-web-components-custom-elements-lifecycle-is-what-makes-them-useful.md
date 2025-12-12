---
layout: post
title: "Web Components Custom Elements Lifecycle is What Makes Them Useful"
date: 2023-11-19 9:00
ad:
  id: "sus-dev"
related:
  - "What is WebComponents Buying Us?"
  - "Web Components: Templates, Slots, and Shadow DOM Aren't Great"
  - "Ruby on Rails: Still the Best Web App Framework for Most Teams"
---

Feedback from [my previous post on Web Components](/blog/2023/11/17/what-is-lightdom-webcomponents-buying-us.html) was that
the lifecycle callback methods like `connectedCallback` are actually what makes custom elements useful.  After exploring this
more, I can see why and want to demonstrate.

<!-- more -->

<div data-ad></div>

The examples in my previous post demonstrated progressive enhancement for a server-rendered page.  I anchored to this as that
was the crux of Jim Neilsen's blog post, and a lot of discussion around Web Components is how they can support progressive
enhancement.  In that scenario, the callbacks on a custom element don't seem useful.

But, as was pointed out to me a few times on Mastodon and email, these callbacks vastly simplify managing dynamic insertion of custom elements.  If you want to insert (or remove) a component, the callbacks provided by the custom elements API trigger automatically.

If you are just using the DOM APIs—my so-called "vanilla" implementation—you have to do a lot of heavy lifting yourself.
Let's see all this in action.

## Manual Lifecycle Management

Let's enhnace the user avatar example and create a button that, when clicked, inserts a new user avatar component into the
DOM, without re-rendering the page or performing any server-side interaction.

```html
<div data-tooltip>
  <img
    src="https://naildrivin5.com/images/DavidCopelandAvatar-512.jpeg"
    alt="Profile photo of Dave Copeland"
    width="64"
    height="64"
    title="Dave Copeland"
    />
</div>
<hr>
<button data-add-new>Add New Component</button>
<h2>New Components are added here</h2>
<section></section>
```

To focus on the behavior, I'm not going to extract the markup into a template—there will be some duplication but set that
aside for a moment.  Here is the JavaScript for the
button press:

```javascript
document.querySelectorAll("[data-add-new]").forEach( (e) => {
  e.addEventListener("click", (event) => {
    event.preventDefault()
    const section = document.querySelector("section")
    section.insertAdjacentHTML("beforebegin",`
<div data-tooltip>
  <img src="https://naildrivin5.com/images/DavidCopeland-old.jpeg"
       alt="Old Profile photo of Dave Copeland"
       width="64"
       title="Younger Dave Copeland"
       />
</div>`)
  })
})
```

If you run this (see [CodePen version](https://codepen.io/davetron5000/pen/YzBezbN?editors=1010)), you'll notice that while
the `<img>` tag is inserted, the tooltip is not added.  This is because there is nothing to trigger the code that does the
enhancement.  That code already ran.

## The Complexity of Doing it Yourself

To make this work, we need to create our own abstraction so that we can create a new component that we then enhance.  There
are a ton of ways to do this, but here is one that introduces the fewest new concepts.

First, we create a class that wraps the element and exposes an `enhance` method that does the progressive enhancement:

```javascript
class UserAvatar {
  constructor(element) {
    this.element = element
    const $img = element.querySelector("img")
    this.src = $img.getAttribute("src");
    this.name = $img.getAttribute("title");
  }

  enhance() {
    this.element.insertAdjacentHTML(
      'beforeend', 
      `<div>tooltip ${this.name}</div>`
    );
  }
}
```

Now, our initialization code will create an instance of this class and call `enhance`:

```javascript
document.querySelectorAll("[data-tooltip]:has(img[src][title])").
  forEach( (element) => {
    const userAvatar = new UserAvatar(element)
    userAvatar.enhance()
  })
```

Here's where it gets really nasty.  Because we ultimately need an `Element`, we have to create one using DOM methods and not
strings:

```javascript
document.querySelectorAll("[data-add-new]").forEach( (e) => {
  e.addEventListener("click", (event) => {
    event.preventDefault()
    const section = document.querySelector("section")
    const element = document.createElement("div")
    const img = document.createElement("img")
    img.setAttribute("src","https://naildrivin5.com/images/DavidCopeland-old.jpeg")
    img.setAttribute("alt","Old Profile photo of Dave Copeland")
    img.setAttribute("width","64")
    img.setAttribute("title","Younger Dave Copeland")
    element.appendChild(img)
    const userAvatar = new UserAvatar(element)
    section.appendChild(userAvatar.element)
    userAvatar.enhance()
  })
})
```

Yech.  You can [see this working on CodePen](https://codepen.io/davetron5000/pen/vYbdEGJ?editors=1010).  Sure enough, when
the dynamic component is added, the enhancement runs.  There are a lot of ways to make this better, but that's not the point
of this post.

Let's see Jim Neilsen's custom element do this.

## Automatic Lifecycle Management

The additional code to handle the button is similar to what I used in my vanilla version (again,  bear with me on the markup duplication—that can be eliminated and we'll discuss how in a future post):

```javascript
document.querySelectorAll("[data-add-new]").forEach((e) => {
  e.addEventListener("click", (event) => {
    event.preventDefault();
    const section = document.querySelector("section");
    section.insertAdjacentHTML(
      "beforebegin", `
<user-avatar>
  <img src="https://naildrivin5.com/images/DavidCopeland-old.jpeg"
       alt="Old Profile photo of Dave Copeland"
       width="64"
       title="Younger Dave Copeland"
       />
</user-avatar>`);
  });
});
```

If you [run this on CodePen](https://codepen.io/davetron5000/pen/RwvQNbg?editors=1010), it…just works.  The reason
is `connectedCallback()`.  This is documented as running "when the element is added to the document",
and the words *add* and *document* mean something specific.  It means when the element is dynamically put into the `Document`
being shown, `connectedCallback()` is called.

*This* is a significant savings.  We *could* create helper functions or classes that allow our vanilla JS version to work
like this, but that would be some made-up, non-standard thing.

## Revising the Four Steps to be Five

In my previous post, I outlined four steps that any JavaScript has to handle:

1. Locate the elements of the document that will need to change.
2. Identify the events you want to respond to.
3. Ensure all input and configuration needed to control behavior is available.
4. Wire up the events to the document based on the inputs and configuration.

It seems that there should be a new step:

<ol start="5">
<li>Ensure proper initialization and deinitialization when the document is dynamically manipulated.</li>
</ol>

With this fifth step, there is now a clear difference to use a custom element:

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
      <tr>
        <th class="text-l nowrap">5 - Initialize/De-initialize</th>
        <td class="text-l">
          Code inside <code>connectedCallback</code> or <code>disconnectedCallback</code>.
        </td>
        <td class="text-l">
          A lot of non-standard code you have to write and manage.
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
  <li>
    <strong>Initialize/De-initialize</strong>
    <ul class="pl0">
      <li>
        Web Components - Code inside <code>connectedCallback</code> or <code>disconnectedCallback</code>.
      </li>
      <li>
        Vanilla - A lot of non-standard code you have to write and manage.
      </li>
    </ul>
  </li>
</ol>
</figure>

What this tells me is that there is no real downside to Web Components, but some upside for situations when you will be
adding or removing components dynamically.  If you are using Hotwire (part of Rails), it works by sending server-rendered
markup to the browser for dynamic insertion.  This is a key benefit to that strategy.

Notably, React *also* provides a solution for this problem as its beuilt into the lifecycle of a component.

## Why Wasn't This Clear?

I think there are three reasons this isn't clear:

* I was anchored on a progressive enhancement scenario where there wasn't any addition of custom elements.
* The documentation around all this is…pretty bad.  It's pretty academic<sup id="fn_1"><a href="#1">1</a></sup> in that it presents information without contedxt, and doesn't outline any real benefit for using it or reason it exists.
* The other aspects of Web Components—Shadow DOM, templates, slots—don't seem optimized for the decades-old use case of
managing re-usable markup.  We'll dig into that in a future post.

I think the real approach is to not judge Web Components on a problem *I think they should solve*, but against the problem they were *designed to solve*. And that problem is a very tiny subset of the problems facing web developers.  It's almost too small to notice.

----

<footer class='footnotes'>
<ol>
<li id="1">
<sup>1</sup>I don't know about you, but almost every single class in college—undergrad and grad—boiled down to “presenting
information to memorize but without any context for why it was useful to know”.  Certainly high school was like this.  I
don't understand why educational systems are so afraid of practical appilcations or contextualizing information. <a href='#fn-1'>↩</a>
</li>
</ol>
