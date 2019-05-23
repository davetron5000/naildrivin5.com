---
layout: post
title: "Brustalist Web Design Dark Mode"
date: 2019-05-23 9:00
link: https://brutalist-web.design
---

[Brutalist Web Design Guidelines][link] now support dark mode!  If you are using a system that supports dark mode (e.g. MacOS) then the site will show you a
different theme with less sun-blasting white background (see image below).  I'm viewing this as an accessibility issue, so right in line with the ethos of
Brutalist Web Design.  Some users need a darker theme or want to have a less bright experience on their computer.

This is likely only supported in Safari on later MacOS, but it's activated by the media query <span class="nowrap">`prefers-color-scheme: dark`</span>.  Since the site uses [Tachyons][tachyons], I chose to override Tachyons' color styles rather than create meta styles like “background” and “text color”.

```css
@media (prefers-color-scheme: dark) {
  .bg-near-black { background-color: #eeeeee; }
  .bg-near-white { background-color: #111111; }
  .black { color: #ffffff; }
  .dark-gray { color: #CCCCCC; }

  /* and so forth... */
}
```

<figure>
  <img src="/images/brutalist-web-design-dark-and-light.png" alt="Rendering of brutalist-web.design's website in dark mode and light mode side-by-side" />
  <figcaption class="dn">
    brutalist-web.design in both modes
  </figcaption>
</figure>

[link]: https://brutalist-web.design
[tachyons]: http://tachyons.io
