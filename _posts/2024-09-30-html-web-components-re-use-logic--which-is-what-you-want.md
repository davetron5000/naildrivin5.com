---
layout: post
title: "HTML Web Components Re-Use Logic, Which is What You Want"
date: 2024-09-30 11:00
ad:
  title: "When You Need a Dev Environment"
  subtitle: "Make a reliable one that lasts"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
related:
  - "Web Components in Earnest"
  - "Web Components Custom Elements Lifecycle is What Makes Them Useful"
  - "Web Components: Templates, Slots, and Shadow DOM Aren't Great"
---

[Custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) that wrap HTML (AKA "HTML Web Components") can be extremely useful for re-using logic without requiring the user of the custom element to adopt any particular UI or styling.  And this is usually the sort of re-use you actually want.

Let me demonstrate by creating a way to sort and filter any HTML table. Sorry, this is a bit long.

<!-- more -->

HTML Web Components used in this way are extremely powerful because they work with the HTML you already have, no
matter how that HTML generated.  Unlike a sortable/filterable table made with React, the HTML Web Component
we'll create doesn't require that the HTML be generated on the client, or from any particular server process. It
works with static HTML served from a CDN.

## Semantic Markup

This example was inspired by a [Vue Example](https://vuejs.org/examples/#grid), shared with me on Mastodon, but I've done everything from scratch.  Here is the most basic HTML needed for this task:

```html
<table>
  <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Power
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Chuck Norris</td>
      <td>Infinite</td>
    </tr>
    <tr>
      <td>Bruce Lee</td>
      <td>9001</td>
    </tr>
    <tr>
      <td>Jet Li</td>
      <td>8000</td>
    </tr>
    <tr>
      <td>Jackie Chan</td>
      <td>7000</td>
    </tr>
  </tbody>
</table>
```

Pretty standard stuff.  Next, we need the search form, which can be created with, again, basic HTML:

```html
<form>
  <label>
    <span>Search</span>
    <input type="search" name="filter-terms">
  </label>
  <button>Search</button>
</form>
```

You can see this [on CodePen](https://codepen.io/davetron5000/pen/BaXoQqJ), along with some basic styles that
don't affect behavior (though we *will* be using CSS as part of this).

The requirements for our table are:

* Clicking on the header elements will sort the table by that column, alternating ascending and descending.
* There should be an indicator of what column is the sort column and which direction.
* Entering text in the form filters the rows to only those with a cell containing the matching text.

## Custom Elements Augment Regular Elements

We'll do this by creating a few custom elements, each of which will bestow behavior on the markup they contain:

* `<fancy-table sort-column sort-direction filter-terms>` will do most of the work.  Any `<table>` it contains
will be sorted based on the `sort-column` in the direction specified by `sort-direction`, filtering based on
`filter-terms`.  When this attributes change, the table will update itself to conform to the new attributes
* `<fancy-table-sort-button>` will manage the state of the sort of the `<fancy-table>` and respond to click
events of a `<button>` it contains to trigger attribute changes that will cause sorting.
* `<fancy-table-filter>` will wrap the `<form>` and, when submitted, update the `filter-terms` attribute of the
`<fancy-table>`, thus filtering the table.


Let's look at the table first, as it's the most complex.

### `<fancy-table>`

First, we'll surround our `<table>` with `<fancy-table>`:

```html
→ <fancy-table>
    <table>
      <!-- ... -->
    </table>
→ </fancy-table>
```

To create our custom element, we'll need a bit of boilerplate.  We need to extend `HTMLElement` and declare the
attributes we wish to observe.  I also like to create a static property `tagName` that can be used in
`querySelector`/`querySelectorAll` to reduce duplication.

We'll then need to call `define` on `window.customElements` to tell the browser about our custom element.  I'm
doing this inside the `DOMContentLoaded` callback because I don't want the element to be initialized until the
entire DOM has been loaded.  If the element is initialized before that, it won't find the `<table>` element it
wraps (see [end notes](#end-notes) for some nuance around this).

```javascript
class FancyTable extends HTMLElement {
  static tagName = "fancy-table"
  static observedAttributes = [
    "sort-column",
    "sort-direction",
    "filter-terms",
  ]
}
document.addEventListener("DOMContentLoaded", () => {
  window.customElements.define(FancyTable.tagName,FancyTable)
})
```

The approach we'll take is to have a single method called `#update` that examines the element's attributes and
contents and re-arranges the contents as needed.  Of note, this approach will *not* generate any HTML and it
will not blow away its innards to accomplish its goals.

The `#update` method will be called by two callbacks that are part of the custom element spec: `connectedCallback` and `attributeChangedCallback`.  This will allow the element to react to changes (again, don't skip the [end notes](#end-notes) for some further discussion).

```javascript
  class FancyTable extends HTMLElement {
    static tagName = "fancy-table"
    static observedAttributes = [
      "sort-column",
      "sort-direction",
      "filter-terms",
    ]
  
→   #sortColumn    = NaN
→   #sortDirection = "ascending"
→   #filterTerms   = null
→
→   attributeChangedCallback(name, oldValue, newValue) {
→     if (name == "sort-column") {
→       this.#sortColumn = parseInt(newValue)
→     } else if (name == "sort-direction") {
→       this.#sortDirection = newValue
→     } else if (name == "filter-terms") {
→       this.#filterTerms = newValue ? newValue.toLowerCase() : null
→     }
→     this.#update()
→   }
→
→   connectedCallback() {
→     this.#update()
→   }
  }
```

I like to use `attributeChangedCallback` as a place to normalize the values for the attributes.  When an
attribute is removed, the `newValue` will be the empty string which, while falsey, is annoying to deal with.

Next, we'll sketch `#update`:

```javascript
  class FancyTable extends HTMLElement {
  
  // ...

→   #update() {
→     this.#sortTable()
→     this.#filter()
→   }
  }
```


#### Sorting 

`#sortTable()` will sort each `<tr>` based on the value for `this.#sortColumn` and `this.#sortDirection`.  This
is where we'll examine the contents of our custom element, and there will need to be a fair bit of defensive
coding to handle cases where we don't find the elements we expect.

First, locate the body and return if we don't find it:

```javascript
// Member of the FancyTable class
#sortTable() {
  const tbody = this.querySelector("table tbody")
  if (!tbody) {
    return
  }
```

(Note: I'm not `console.warn`ing in this case because I don't think custom elements should emit warnings unless really necessary. See [my previous post on how I set up debugging mistaken use of elements](https://naildrivin5.com/blog/2024/01/24/web-components-in-earnest.html#warnings-silent-failure-and-debugging))

Next, we'll sort the rows based on the content of the cells in the selected column.  This is gnarly, but it should be rock solid:

```javascript
  // Still inside #sortTable
  const rows = Array.from(tbody.querySelectorAll("tr"))
  rows.sort((a, b) => {
    let sortColumnA = a.querySelectorAll("td")[this.#sortColumn]
    let sortColumnB = b.querySelectorAll("td")[this.#sortColumn]

    if (this.#sortDirection == "descending") {
      const swap = sortColumnA

      sortColumnA = sortColumnB
      sortColumnB = swap
    }
    if (sortColumnA) {
      if (sortColumnB) {
        return sortColumnA.textContent.localeCompare(
          sortColumnB.textContent
        )
      } else {
        return 1
      }
    } else if (sortColumnB) {
      return -1
    } else {
      return 0
    }
  })
```

Now that the rows are sorted, we can take advantage of [the behavior of `appendChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild):

> If the given child is a reference to an existing node in the document, appendChild() moves it from its current position to the new position

```javascript
  rows.forEach((row) => tbody.appendChild(row))
}
// end of #sortTable method
```

Check out [the implementation on CodePen](https://codepen.io/davetron5000/pen/QWejGJB).  You can set the
`sort-column` and `sort-direction` attributes in the HTML pane and the table will sort itself.  You can also do
this in the console with `setAttribute` and the same thing will happen.

#### Filtering

To filter rows, we'll use the `hidden` attribute on any filtered-out row. This should prevent the row from being rendered as well as read out by screen readers.

We'll go through each `<tr>` and, if we have a value for `this.#filterTerms`, set `hidden` on the `<tr>` by
default, then removing it if the term is a substring of any `<td>`'s `textContent` (case insensitively).  If
there's no value to filter on, we'll remove `hidden` if it was there.

```javascript
  class FancyTable extends HTMLElement {

    // ...

→   #filter() {
→     this.querySelectorAll("tbody tr").forEach((tr) => {
→       if (this.#filterTerms) {
→         tr.setAttribute("hidden", true)
→         tr.querySelectorAll("td").forEach((td) => {
→           const lowerContent = td.textContent.toLowerCase()
→           if (lowerContent.indexOf(this.#filterTerms) != -1) {
→             tr.removeAttribute("hidden")
→           }
→         })
→       } else {
→         tr.removeAttribute("hidden")
→       }
→     })
→   }
  }
```

You can see this [on CodePen](https://codepen.io/davetron5000/pen/oNKjBgY). Set the `filter-terms` attribute on
`<fancy-table>` and table will filter its elements.

#### Review of `<fancy-table>`

This is the bulk of it.  `<fancy-table>` does whatever its attributes tell it to do and updates as those
attributes change.  The rest of the requirements can be met by connecting user actions to changes in those
attributes:

* When the form is submitted, `filter-terms` is updated to match.
* When the user clicks on a header, `sort-column` and `sort-direction` are updated.

Let's tackle filtering first, as it's a bit simpler.

### `<fancy-table-filter>`

As with `<fancy-table>`, let's surround our `<form>` with `<fancy-table-filter>`:

```html
→ <fancy-table-filter>
    <form>
      <label>
        <span>Search</span>
        <input type="search" name="filter-terms">
      </label>
      <button>Search</button>
    </form>
→ </fancy-table-filter>
```

As before, we'll need a class for the custom element. We'll use the same `#update` method pattern we used
before. Note that there are no `observedAttributes`.

```javascript
→ class FancyTableFilter extends HTMLElement {
→   static tagName = "fancy-table-filter"
→   connectedCallback() {
→     this.#update()
→   }
→ }

  document.addEventListener("DOMContentLoaded", () => {
    window.customElements.define(FancyTable.tagName, FancyTable)
→   window.customElements.define(FancyTableFilter.tagName, FancyTableFilter)
  })
```

Inside `#update`, we'll need to setup an event listener for the form.  This is a critical piece here, because a
lot of Web Components blog posts I have read do this sort of set up inside the constructor.  The thing about
custom elements is that the callbacks can be called multiple times (especially if we were to have `observedAttributes`), so you have to write any setup code to be *idempotent*.

This means that any setup code has to be written in a way that it's safe for it to be called over and over.
Generally, "safe" means that we won't add an infinite number of event listeners.

To do that, we'll take advantage of the behavior of `addEventListener` that will not add the same listener more
than once.  That means we need to create our event listener as a member of the class and not as an anonymous
function.

Given that, let's see `#update` first:

```javascript
// Inside FancyTableFilter
#update() {
  const form = this.querySelector("form")
  if (form) {
    form.addEventListener("submit", this.#formSubmitted)
  }
}
```

Note again, we have to check that there is a `<form>` available.  If there is, we add our listener to the
`"submit"` event.

Our event listener will disable submitting the form to the server, then locate a `<fancy-table>` in the page
(see [end notes](#end-notes) for a better, but more complicated, way to do this).  Once the table is located, it will access the `FormData` for the
form, extract the `filter-terms` and set that on the table:

```javascript
// Inside FancyTableFilter
#formSubmitted = (event) => {
  event.preventDefault()
  const fancyTable = document.querySelector(FancyTable.tagName)
  if (!fancyTable) {
    return
  }
  const formData = new FormData(event.target)
  const filterTerms = formData.get("filter-terms")
  if (filterTerms) {
    fancyTable.setAttribute("filter-terms", filterTerms)
  } else {
    fancyTable.removeAttribute("filter-terms")
  }
}
```

As we saw, merely setting the `filter-terms` attribute on the `<fancy-table>` will cause it to filter.

You can try this now [on CodePen](https://codepen.io/davetron5000/pen/yLmYgeW).

Next, let's implement user-initiated sorting.

### `<fancy-table-sort-button>`

There are several ways to accomplish sorting the table based on a user click.  The details of the requirements
we want to meet are:

* Clicking the header indicates that column should be used for sorting.
* If the table is already sorted by that column, flip the ordering of the sort.
* There should be a visual indicator of the sort (e.g. an up or down arrow).
* Appropriate `aria-` attributes should be set and consistent with the sort of the table.

Here is the approach I took, that I'll show below:

* The `<th>` elements will contain a `<fancy-table-sort-button>` that itself contains a regular `<button>` that
will be styled to fill the entire header and appear clickable but not look like a button.
* The current state of the sorting will be reflected in the `aria-sort` attribute set on the `<th>`.
* CSS will be used to place an up or down arrow in the right place.
* The `<fancy-table-sort-button>` will listen for a click of its `<button>` and set `sort-column` and
`sort-direction` on the `<fancy-table>` containing it, thus sorting the table.

As before, here's the basics of the custom element:

```javascript
→ class FancyTableSortButton extends HTMLElement {
→   static tagName = "fancy-table-sort-button"
→
→   connectedCallback() {
→     this.#update()
→   }
→ }

  document.addEventListener("DOMContentLoaded", () => {
    window.customElements.define(FancyTable.tagName, FancyTable)
    window.customElements.define(FancyTableFilter.tagName, FancyTableFilter)
→   window.customElements.define(
→     FancyTableSortButton.tagName,
→     FancyTableSortButton
→   )
  })
```

`#update` will set up an event listener, again using a member of the class:

```javascript
// Inside FancyTableSortButton
#update() {
  const button = this.querySelector("button")
  if (!button) {
    return
  }

  button.addEventListener("click", this.#sort)
}
```

All the work is done in `this.#sort`.  It's a bit tricky, because we need to use `closest` to figure out where we are in the DOM.  Namely, we'll find the `<fancy-table>` that contains us, find the `<th>` that contains us, and then figure out which index we are. And, we'll look at the `<th>` that contains us's `aria-sort` attribute to figure out if we are already being sorted.

Once we have that, we can set the new values for `aria-sort`, `sort-direction`, and `sort-column`:

```javascript
#sort = (event) => {
  const fancyTable = this.closest(FancyTable.tagName)
  if (!fancyTable) { return }

  const th = this.closest("th")
  if (!th) { return }

  const tr = th.closest("tr")
  if (!tr) { return }

  const direction = th.getAttribute("aria-sort")
  let myIndex = -1
  tr.querySelectorAll("th").forEach((th, index) => {
    if (th.querySelector(FancyTableSortButton.tagName) == this) {
      myIndex = index
    }
    th.removeAttribute("aria-sort")
  })
  if (myIndex == -1) {
    return
  }
  const newDirection = direction == "ascending" ? 
                         "descending" : 
                         "ascending"

  th.setAttribute("aria-sort"              ,newDirection)
  fancyTable.setAttribute("sort-direction" ,newDirection)
  fancyTable.setAttribute("sort-column"    ,myIndex)
}
```

The last bit is CSS.  If you've looked at the CodePens, I put a small amount of CSS there just to make things
look decent.  I'll just focus on the table's header.

First, the `<button>` inside the `<th>` is styled so it fills the entire space and doesn't look like a button,
  but generally indicates that it is clickable and indicates it's been clicked:

```css
fancy-table-sort-button button {
  width: 100%;
  display: block;
  border: none;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
  background-color: #004400;
  color: white;
  font-size: 1.25rem;
}
fancy-table-sort-button button:active {
  background-color: #006600;
}
```

None of this was needed to make this feature work.  Now, we use the `aria-sort` attribute and the `content:`
property to show a sort indicator:

```css
fancy-table-sort-button button:after {
  content: " ";
}
th[aria-sort="ascending"] fancy-table-sort-button button:after {
  content: "\2191"; /* Up arrow */
}
th[aria-sort="descending"] fancy-table-sort-button button:after {
  content: "\2193"; /* Down arrow */
}
```

You can see this all working [on CodePen](https://codepen.io/davetron5000/pen/VwovWVX).

Of note, a designer could style this table and the sorting indicators however they wanted without worrying about
breaking the functionality.

## Review: Neat!

<div data-ad></div>

All in all, this is around 150 lines of JavaScript, and only a few extra lines of HTML beyond what is needed to
markup the form and table.  The Vue version of this is a bit smaller, however it requires HTML generation in the
client (though perhaps there is some way to generate this on the server first?).

Here is what I find interesting about the HTML Web Components version:

* It is completely agnostic of any look and feel or styling.  This logic could be applied to any `<table>`
markup, no matter how it's generated.  In theory, this would allow developers to focus on styling only, and not
worry about sorting tables (though see [end notes](#end-notes) for some nuanced discussion).
* This agnostic of any *framework* as well!  You could create a React component that generated this markup and
it would work!
* The HTML and CSS are 100% standard.  There's not even the need for a `data-` element!
* By starting with an accessible approach using semantic markup and necessary `aria-` attributes, the logic and
styling can hang off of that (again, see [end notes](#end-notes)).
* Although this doesn't do any HTML generation, it's not hard to imagine fetching data from an AJAX request and inserting it into the `<tbody>`.  A [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) could be used by `FancyTable` to detect this and call `#update`, thus maintaining the sort.
* I honestly don't know if this is "reactive", but it feels like it either is or is close.  None of the code
we've seen tells any other object what to do.  The code either sets attributes on other elements or reacts to
those attributes having been changed.  Although there is coupling between the various custom elements having to
know about their attributes, this could be abstracted if the overall state on the page is more complex.
* I'm not sure how to think about the performance, but [a version with 1,000
entries](https://codepen.io/davetron5000/pen/jOgbLrW) seems to work well enough.  I don't think an HTML page
with a 1,000 row table is very useful, but it seems fast enough.

Despite this, here is what is annoying and I wish could be made to go away without having to have some
framework:

* Tons of defensive coding around elements potentially not being where they are expected.  This is the main
advantage to frameworks like React and Vue. Since they are generating the markup, they don't have to worry that
whatever they expect isn't there.  I don't think this advantage outweighs the downsides, but it's still annoying
to have to check if elements exist before executing logic.
* It would be nice to have a callback that amounted to "the DOM inside you has changed". `MutationObserver` is
so complicated, I just don't want to deal, but it would vastly improve the behavior of custom elements.
* We didn't see any `<template>` or `<slot>` elements, but those leave some room for improvement.

## End Notes

I am not sure if I have properly or completely handled all accessibility concerns.  I continue to find
it really hard to know what is the right way to handle this stuff, and generally my process is to use the proper
elements for things and to peruse the `aria-` attributes and roles to see if anything jumps out that I might
need to use. Please get in touch with any feedback on this.

Another consideration with this implementation is that the `<fancy-table-filter>` just plucks the first
`<fancy-table>` it finds and operates on that.  The way I have handled this in the past requires a bit more
code, but basically, what I would do is:

* Allow `<fancy-table-filter>` to observe an attribute like `fancy-table` that is intended to be the `id` of the
`<fancy-table>` it's supposed to interact with.
* Allow this attribute to be optional *only* if there is one or zero `<fancy-table>` elements on the page.

You could also imagine the `<fancy-table-filter>` setting *every* attribute from its `FormData` onto the
`fancy-table`. That would make the coupling between the two elements even lighter.

Also, the use of `<fancy-table-sort-button>` may not really be necessary. I could see a case being made that
`<fancy-table>` can locate `<button>` elements inside its `<th>` elements and assuming those exist to sort the
table.  That may be a cleaner implementation.

Further, the sorting could be made more convenient by respecting an attribute or other custom element that
indicates the sortable value:

```html
<tr>
  <td>
    <fancy-table-sort-value>Charles Norris</fancy-table-sort-value>
    Chuck Norris
  </td>
  <td>
    <fancy-table-sort-value>!!!!!!!</fancy-table-sort-value>
    Infinity
  </td>
</tr>
```

Lastly, to make the component truly bullet-proof would require using the aforementioned `MutationObserver` to
ensure that any changes to the DOM inside the element triggered a re-sort and re-filter.

To make a truly universal custom element that sorts a table would require thinking through a lot more edge
cases.

