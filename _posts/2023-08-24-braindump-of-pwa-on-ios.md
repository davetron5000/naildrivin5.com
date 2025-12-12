---
layout: post
title: "Getting 'Save to Home Screen' to Kinda Work on iOS"
date: 2023-08-24 9:00
ad:
  id: "sus-dev"
---

iOS has a feature on any website called "Save to Home Screen", which creates an icon that then goes to that site.  If you
craft your website a certain way, this will launch the site in an app-like mode that is often referred to as a
"Progressive Web App" or PWA.  iOS does not support many features of PWAs that are available on Android or ChromeOS, but
it supports some.  This post will document exactly what you need to do, because it's not documented very well.

<!-- more -->

The reasons to configure a website as an iOS PWA are:

* Launching the site by tapping an icon, like a native app would allow.
* Running the app in its own context and not as a tab in Mobile Safari (again, like a native app).
* Ability to use the entire screen and avoid any browser chrome.  For example, the ability to allow taps to the bottom of
the screen, which doesn't work on Mobile Safari (since such taps bring up the browser chrome).
* Ability to use to-be-released features like notifications and badging

The challenges are:

* Little to no documentation from Apple.
* PWAs cannot easily be updated without the PWA itself including an update feature.
* Difficult to test without deploying to production.
* Without careful configuration, links will open up an in-app browser.

Here is what works for me.

## Set Up The `<head>` Appropriately

First thing to do is make sure you have the right stuff in the `<head>` section of all the pages of your app.  While some
of what I will show you is not strictly required, it is recommended.

The key things to make sure are there:

* A `<link rel="manifest" href="/manifest.json">`.  `manifest.json` can have any URL.  See [below](#manifest) for how to
set this up.
* `<meta name="apple-mobile-web-app-capable" content="yes">`, which tells iOS that this is a PWA.
* Setting the app icon title via `<meta name="apple-mobile-web-app-title" content="«title»">`

There are other things in the `<head>` you should set. The example below shows everything that I am using regularly.  For
demonstration purposes, the app is named "Arrakis Guide". Each line has a comment next to it or preceding it that explains its purpose.

```html
<!DOCTYPE html>
<html lang="en"> <!-- or whatever locale you are using -->
  <head>
    <!-- this ensures everything works inside mobile safari and
         doesn't show you the tiny zoomed-out desktop version of the site -->
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <!-- Always have a page title.  iOS should not use this
         so each page can have its own title. -->
    <title>Arrakis Guide</title>

    <!-- this links to structured metadata iOS will use. More on that later -->
    <link rel="manifest" href="/manifest.json">

    <!-- this is part of what makes iOS run the app in full screen mode in
         its own browser and NOT Mobile Safari -->
    <meta name="apple-mobile-web-app-capable" content="yes">

    <!-- this *should* prevent iOS from caching the page's HTML and assets
         but in practice does not work at all.  You may want to leave it
         here in case it starts working -->
    <meta http-equiv="Cache-control" content="no-store"/>
    
    <!-- These icons will be used as the icon on the home screen.  iOS will
         choose the size that works best for the phone where it's being saved. -->
    <link rel="apple-touch-icon"                 href="/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">

    <!-- This is what iOS will use as the icon title. If you don't specify this
         it will use <title>, but this is not what you want, since each page
         should have its own title -->
    <meta name="apple-mobile-web-app-title" content="Arrakis Guide">

    <!-- This changes the status bar when the app is running. The value (content) can
         be default, black, and black-translucent. It's not clear exactly what the differences
         are, so you may need to play with this -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <!-- rest of head -->
  </head>
  <! -- rest of doc -->
</html>
```

Be sure that you create the icons and that they are sized exactly as the value of `sizes` indicates.  The icon without a
size should use the largest one you have.

Next, you need a web manifest.

<a name="manifest"></a>
## Web Manifest

`<link rel="manifest" href="/manifest.json">` indicates the file that contains the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest).  You will note that Mobile Safari does not explicitly support much of what goes in this file, and that sites like <a href="https://caniuse.com">caniuse.com</a> indicate that Safari support is _unknown_. Despite this, iOS does seem to support some of the attributes.

The two critical attributes to set are:

* `start_url` - the URL that should be loaded when the icon is tapped.
* `scope` - a URL that controls which links stay in the app-like mode and which will open an in-app Mobile Safari
browser.  If you omit this, *all* links open in the in-app browser.  The value to use is essentially the prefix of any
URL that should *not* open the in-app browser.

Here is an example. Note this the file format is JSON, but I've included JavaScript comments in it to explain what each thing does.

```javascript
{
  // unclear if iOS uses this - specify for safety
  "name": "Arrakis Guide",

  // unclear if iOS uses this - specify for safety
  "short_name": "Arrakis Guide",

  // unclear if iOS uses this - specify for safety
  "description": "Get the most out of your pilgrimage to Arrakis",

  // iOS DOES seem to use this. It's the url to load when
  // the icon is tapped
  "start_url": "/",

  // iOS DOES seem to use this. It says that any url that
  // starts with this value is "in navigation scope" and
  // thus will NOT open up a separate web view.
  // Although the default for this is /, omitting this
  // DOES NOT WORK in iOS - all links will open
  // Mobile Safari. So set this.
  "scope": "/",

  // unclear if iOS uses this - specify for safety
  "display": "standalone",

  // unclear if iOS uses this - specify for safety
  "theme_color": "#F6FFFE"
}

```

Note that if you also want your app to work as a PWA on Chrome or Android, you can specify a lot more stuff.  That's
outside the scope of this post.

## Dealing with Updates

If you were to update the HTML files (or any asset) on your site, anyone who has installed your app on iOS via "Save to
Home Screen" would not *ever* see those updates unless they deleted the app and re-added it to the homescreen.  This is
annoying.

To deal with this, I would recommend you build two features into your app:

* A visible string somewhere that shows a version reference.  It has to be visible because opening the dev console on a
running app on a real iPhone is incredibly difficult and complicated.
* A link or button that triggers `window.location.reload()`.  This is the only way I have found to reliable force the app
to re-download updated HTML.

Remember, you don't really have any observability into the behavior of the browser running your PWA on iOS, so it's very
hard to debug why things don't work.

## Testing it Out

You will need a real URL on the Internet to actually test this.  If you don't have something like `test.arrakisguide.com`
to try things before putting them into production, you may need a service like <a href="https://ngrok.com">ngrok</a> that
creates a publicly-accessible URL for dev environment.

<div data-ad></div>

Once you have that set up:

1. Navigate to your app via Mobile Safari.
1. Bring up the Sharing Sheet.
1. Scroll Down to "Add to Home Screen" and tap it.
1. You'll see a popup asking to confirm and allowing you to change the icon's name.  Tap "Add".
1. The app should be on your home screen and the icon should be one that you set up in your `<head>` section.
1. Tap the icon, your app should launch without any browser chrome.
1. Tap around and make sure it works the way you'd like.

If this doesn't work, you should remove the saved icon from your iPhone and try it all again after changing whatever you
think the problem is.  It's really annoying.

Once it *is* working, make a substantive update so you can make sure your reload function works.  Also make sure you can find your version number easily.  This may be critical when providing support to others.

Once you've verified everything is working, you aren't likely to have to worry about this aspect again.

## References

[`first.dev`'s overview of support](https://firt.dev/notes/pwa-ios/) is a great reference.  That site recommends a few
things differently than I do.  In particular, it recommends against `apple-mobile-web-app-title`, which you can probably
omit, but I'm going with what works for me.

Other links to support some of what is in this article:

* [`apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, and `apple-mobile-web-app-status-bar-style`](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)
* [App Icon Sizes](https://developer.apple.com/design/human-interface-guidelines/app-icons#App-icon-sizes)
* [Definition of navigation scope](https://w3c.github.io/manifest/#dfn-navigation-scope)

## Final Thoughts

There's more you can do with a PWA than just open it up full screen.  Based on `first.dev`'s site, you can probably make a
decent app-like experience with just a web app.  But, you probably can't approach anything like what you'd get with true native app.  That said, it's nice that
Apple is continuing to suppor this, even if slowly.
