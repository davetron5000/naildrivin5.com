---
layout: post
title: "Confirmation Dialog with BrutRB, Web Components, and no JS"
date: 2025-08-18 9:00
link: https://video.hardlimit.com/w/4y8Pjd8VVPDK372mozCUdj
---

I created [a short (8 minute) screencast][link] on adding a confirmation dialog to form submissions using [BrutRB](https://brutrb.com)'s bundled Web Components. You don't have to write any JavaScript, and you can completely control the look and feel with CSS.

<iframe title="Add A Confirmation Dialog in Brut with Zero JS in like 8 Minutes" width="560" height="315" src="https://video.hardlimit.com/videos/embed/4y8Pjd8VVPDK372mozCUdj" frameborder="0" allowfullscreen="" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>

There's also a [tutorial](https://brutrb.com/tutorials/02-dialog.html) that does the same thing or, if you are super pressed for time:

```html
<form>
  <brut-confirm-submit message="Are you sure?">
    <button>Save</button>
  </brut-confirm-submit>
</form>

<brut-confirmation-dialog>
  <dialog>
    <h1></h1>
    <button value="ok"></button>
    <button value="cancel">Nevermind</button>
  </dialog>
</brut-confirmation-dialog>
```

Progressive enhancement, and no magic attributes on existing elements.

* [`<brut-confirm-submit>` docs](https://brutrb.com/brut-js/api/ConfirmSubmit.html)
* [`<brut-confirmation-dialog>` docs](https://brutrb.com/brut-js/api/ConfirmationDialog.html)

[link]: https://video.hardlimit.com/w/4y8Pjd8VVPDK372mozCUdj
