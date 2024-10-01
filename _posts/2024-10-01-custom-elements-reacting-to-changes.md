---
layout: post
title: "Custom Elements Reacting to Changes"
date: 2024-10-01 9:00
ad:
  title: "Own Your Dev Environment"
  subtitle: "By Learning Fundamentals"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

In the [end
notes](https://naildrivin5.com/blog/2024/09/30/html-web-components-re-use-logic-which-is-what-you-want.html#end-notes)
of my [post on creating a sorting and filter table using custom
elements](https://naildrivin5.com/blog/2024/09/30/html-web-components-re-use-logic-which-is-what-you-want.html),
I mentioned that my solution would not work if the `<table>` inside `<fancy-table>` was modified.  This post
outlines how to address that using `MutationObserver`, and it's kinda gnarly.

<!-- more -->

## The Problem - Your DOM Changes out From Under You

The contract of the `<fancy-table>` as that if `sort-column` was set, the table's rows would be sorted, and if
`filter-terms` was set, only rows matching the filter would be shown.  That contract breaks if the inside of the
`<table>` is modified.

Ideally, whatever behavior an HTML Web Component bestows upon the DOM it wraps is bestowed to whatever is in
there, no matter when or how it got there. The most acute version of this problem is how the elements are
initialized when the DOM is loaded.


## Element Initialization And `DOMContentLoaded`

In my previous solution you'll note that I had to call `customElements.define` inside a
`DOMContentLoaded` event, or the custom elements wouldn't have access to the DOM they wrap in order to do what
they need to do.

To explain this secondary point more, here is my understanding of the order of operations.

1. In the `<script>` tag, `customElements.define("fancy-table",FancyTable)` is called, which tells the browser that `<fancy-table>` is a custom element implemented by `FancyTable`.
2. As the DOM is loaded, when `<fancy-table>` is parsed, a `FancyTable` is created and `connectedCallback()` is called.  At this point, `this.innerHTML` is empty, since the browser has not examined anything beyond the `<fancy-table>` element it's currently parsing.
3. The rest of the DOM is parsed.  There is no callback for this as part of the custom element spec, so the custom elements essentially don't do anything at all.

By moving `customElements.define` into `DOMContentLoaded`, things are reversed:

1. The DOM is parsed and loaded.
2. `customElements.define(...)` is called.
3. This causes the browser to call `connectedCallback` on all the custom elements. At this point each elements' `innerHTML` is present, so `this.querySelector` and friends work.

Both this startup issue and the need to handle changes made external to the element can be solved by using a [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

## `MutationObserver` Tells You When the DOM Changes

If you recall [my implementation](https://codepen.io/davetron5000/pen/qBeOXZo), each custom element class
implemented a method called `#update()` that did whatever the element was supposed to do. `#update()` was called
from `connectedCallback` as well as `attributeChangedCallback`.  This provided centralization of the custom
elements' core behavior.

To address both the startup problem *and* the "someone changed our DOM" problem, we need to call `#update()`
whenever the DOM changes.  We can arrange that with `MutationObserver`.

It works like so:

```javascript
// 1. Create a callback called when something changes
//    mutationRecords is an array of MutationRecord instances
//    describing the changes
const mutated = (mutationRecords) => {
}

// 2. Create the observer
//    NOTE: nothing is being observed yet
const observer = new MutationObserver(mutated)

// 3. Start observing changes to `element`, based on
//    the contents of `options` (see below)
observer.observe(element,options)
```

For a custom element to observe changes to itself, it will need to call `observe` like so:

```javascript
observer.observer(
  this,
  {
    subtree: true,   // observe `this` and all children
    childList: true, // get notified about additions/removals
  }
)
```

You can also observe attribute and `CDATA` changes if you like, but for my purposes here, it's just enough to
know that any element inside the subtree was added or removed. And, it's not necessary to know what happened. I just need to call `#update()` whenever there is a change, so the element can  re-sort and re-filter the table's rows.

The problem is that `#update()` creates changes that are observed that trigger the observer that then call
`#update()`, thus creating an infinite loop.

## Pausing Observation While Changing Things

The way I addressed this was to stop observing changes before calling `#update()`, then resuming observation
again after that.  I'm assuming no DOM changes are happening during `#update()` because I think all changes to
the DOM must happen in a single, synchronous thread (though I'm not 100% sure).

First, I created two method, `#observeMutations` and `#stopObservingMutations`:

```javascript
// Inside FancyTable

#mutationObserver = null;

#mutated = () => {
  this.#stopObservingMutations();
  this.#update();
  this.#observeMutations();
};

#observeMutations() {
  this.#stopObservingMutations();
  if (!this.#mutationObserver) {
    this.#mutationObserver = new MutationObserver(this.#mutated);
  }
  this.#mutationObserver.observe(this, { subtree: true, childList: true });
}
```

Next, observation has to start when the element is connected, thus it's called in `connectedCallback`:

```javascript
connectedCallback() {
  this.#observeMutations()
  this.update();
}
```

Lastly, the callback will stop observation, call `#update()` and then resume observation:

```javascript
#mutated = (records,observer) => {
  if (this.update) {
    this.#stopObservingMutations()
    this.#update();
    this.#observeMutations()
  }
}
```

<div data-ad></div>

In general, this worked, however it needed to be added to all my custom elements.  Since it's so complicated, I created a base class to hold this and slightly changed the code from the previous post. You can see it all [on CodePen](https://codepen.io/davetron5000/pen/abedoJX). Notice that the elements are no longer defined inside a `DOMContentLoaded` event handler.

When you add as new row to the table, the form will essentially add a `<tr><td>…</td><td>…</td></tr>` to the end of the table's `<tbody>`. If you first sort or filter the table, you'll notice that the row ends up sorted in the right place.  Here is how things happen:

1. The form is submitted.
2. The form's submit handler creates a new `<tr>` and puts two `<td>` elements in it.
3. The form's submit handler locates the `<fancy-table>`'s `<tbody>` and calls `appendChild(tr)`.
4. The new `<tr>` is added as the last row of the table.
5. This triggers the mutation observer, so `FancyTable`'s `#mutate` is called, which pauses observation and calls `#update()`
6. `#update()` then sorts the table based on its `sort-column` and `sort-direction` attributes.
7. `#update()` completes and mutation observation is resumed.

This all happens in the blink of an eye, so it appears that the new row is inserted into the right place.

## The Browser is Powerful, but Could Do More

I'm glad `MutationObserver` exists so that these issues could be solved.  I do wish the custom elements API had
richer callbacks so all of this could be avoided.  Much like `attributeChangedCallback` is called when observed
attributes are changed, it would be nice to have, say, `domChangedCallback` to be invoked whenever the DOM was
changed, *and* have it not result in an infinite loop if the DOM was changed from that callback.

Still, the existence of `MutationObserver` demonstrates the web's power and flexibility.  And while
`MutationObserver` can be complex, our degenerate case didn't end up requiring too much code.  And it all seems
to be working pretty well.

## Other Notes

While working on this, I realized that using `nth-child(odd)` and `hidden` doesn't work properly.  There is no
way I could determine to properly select even and odd `tr` elements that were not `hidden` using only CSS.  It seems `nth-child` just doesn't work that way.

So, what I did was added a `#stripe()` helper that goes through each non-hidden `<tr>` and adds
`data-stripe="odd"` or `data-stripe="even"`, which CSS then uses.  I hate to have to use a `data-` element, but
again, this is the depth of the platform.  If you can't do something at a high level, you can do it at a low
level.



