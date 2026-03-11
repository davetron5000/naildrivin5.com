---
layout: post
title: "Trying Linux Desktop Yet Again with More Success"
date: 2026-03-11 9:00
---


Almost a year ago, [I returned to the Linux Desktop][linux-post] after almost 20 years.  I abandoned it a month or so later out of frustration with a surprising lack of configurability and general exhaustion of addressing the myriad papercuts that come with trying to change computing platforms.

In the last few weeks, I've revisited it and had a lot more success.

[linux-post]: /2025/03/21/one-week-with-desktop-linux-after-a-20-year-absence.html

<!-- more -->


## The Core Problems

The main problems that kept me from adopting Linux day to day were:
* Inability to set keyboard shortcuts for apps to provide a Mac-like experience (namely, using <kbd>Meta</kbd> or <kbd>Alt</kbd> instead of <kbd>Ctrl</kbd> so I could have the same common shortcuts everywhere).
* Clipboard Managers didn't seem to really work.
* Lack of a Dash-like API lookup tool.

There were some papercuts, too. These were the most painful:
* Inability to configure the Framework 13's trackpad scrolling speed.
* Global text replacement/text expansion doesn't work
* PWA support with Firefox
* 1Password reliability and compatibility with Firefox

I've found solutions for some of these and set expectations about others, and have a decent working setup. It's not perfect, but it's usable.

## xremap Solves Keyboard Shortcuts

[`xremap`](https://github.com/xremap/xremap) seems to inject itself at the right layer of the OS to allow remapping keyboard shortcuts.  The best example of what was throwing me off was Firefox's use of <kbd>Ctrl</kbd> as the modifier (and zero ability to change this setting).  My fingers are used to using the Cmd key on mac, *and* used to consistent shortcuts across apps (for example, <kbd>Ctrl</kbd>-<kbd>C</kbd> isn't "copy" in terminal apps, since that sends a control sequence).

`xremap` solves this, once I figured out the magic strings required to make it work and found a way to run it on login.  At a high level, you create a YAML file like so:

```yaml
- name: Firefox
  application:
    only: "firefox"
  remap:
    Alt-q: C-q
    Alt-c: C-c
    Alt-v: C-v
    Alt-t: C-t
```

### Figuring out Magic Strings is Hard

The string given to `only:` is surprisingly hard to figure out.  Even now, the only way I know to figure it out is to run xremap with debugging and observe the log with what it outputs when you interact with a window (I'm running Wayland-only, and most of the internet searches for debugging this problem only work with X11).

But, the `remap:` section is where you set things up: when I type <kbd>Alt</kbd>-<kbd>c</kbd>, it sends <kbd>Ctrl</kbd>-<kbd>c</kbd>.  You can set this up for any app and it seems to work pretty consistently (in fact, this is probably the most consistent behavior of any piece of software on the Linux desktop).  You can even have it match wildcards, so here is how I apply all these settings to all Firefox PWAs:

```yaml
- name: FirefoxPWA
  application:
    only: /^FFPWA/
  remap:
    Alt-q: C-q
    Alt-c: C-c
    Alt-v: C-v
    Alt-t: C-t
```

At this point, the main annoyance is having to set up a mapping for new apps I install or use.  But basically, if you are logging xremap's output, you can click on an app, try to use a keyboard shortcut, and it will usually output that app's name, which you can then use in this file. 

For example, the file browser's name is `org.gnome.Nautilus`, which I would never figured out in a million years.

### Getting Things to Run at Login is Hard

It also helps to run `xremap` with `--watch` so it will pick up changes without having to be manually restarted.

I will say that getting this to run on login was amazingly difficult to do. I have no idea if what I came up with is the best way to do it, but it was the last of many attempts to get it working.  I had to make a wrapper script and much with `/etc/udev/rules.d/input.rules`.

[Here is the script](https://github.com/davetron5000/dotfiles/blob/main/linux-setup/0200-install-xremap.sh) for setting it up that I used.  Oof.

## Clipboard Management Doesn't Really Work

I tried a lot of clipboard managers, and ended up using [GPaste](https://github.com/Keruspe/GPaste). I wouldn't say it works, but it seems to provide the easiest way to access previously-copied snippets.  

**How Clipboard Management should work:** Focus a text field in any app
(including vim), invoke a keyboard shortcut to show a menu of available
snippets on the clipoboard, select one, it is inserted into the text field.
This is how all clipboard management works on the Mac.

**How Clipboard Mac works on Linux:** Focus a text field in any app, but you
can't have a global keyboard shortcut for whatever reason, so using the mouse
invoke the app and using the mouse select the snippet to paste, then use the
mouse to focus the text field again, then paste.  This sucks, but is workable.

From what I can tell, global keyboard shortcuts are difficult or impossible to
configure.  It also seems like there is not a universal text input system in
Linux, so the idea that an app can appear, be interacted with, go away, and
leave you back at the text input you started with is not possible to do
consistently.

I tried *a lot* of clipboard managers and *a lot* of different ways to invoke
them.  None of them truly worked, so I've settled for the workflow above. It's
not great, but it works and is less friction than I would've thought.


## Lack of API Lookup App

To see the workflow for API lookups on the Mac, check out [my original post](/blog/2025/03/21/one-week-with-desktop-linux-after-a-20-year-absence.html#api-documentation-lookup).  It's awesome to go from either Alfred (launcher) or vim to looking at API docs.

This just doesn't seem possible on Linux.  I tried two solutions:

* [Zeal](https://zealdocs.org/) is an attempt to build Dash
for Linux, but a) it is missing almost all documentation I would want, like
various RubyGems, and b) there is no way to programmatically invoke a search
such that it performs the search and focuses/activates the window.  This means
you have to use the mouse to interact with it.
* [DevDocs](https://devdocs.io) is a website that can be installed as a PWA.
You *can* programmatically perform a search and have it focus/activate by
properly and carefully configuring the PWA setup in Firefox. Unfortunately, a)
DevDocs has almost none of the documentation I want to look up (RubyGems), 
b) it's extremely flaky, often showing no results or just hanging, and c) it
remembers the scroll position when loading new pages, meaning each new search
requires grabbing the mouse and scrolling back up to the top of the page.
Linux requires a *lot* of mousing.

For now I'm using DevDocs and back to web searches for everything else.  This
really does suck, but I think I could live with it.

## Do Not Use Snap or, through inaction, allow Snap to be used.

I was banging my head against a wall for hours because I had installed Firefox and 1Password via Snap as that is what the OS was telling me to do.  In this setup, Firefox and 1Password do not work together. 1Password barely works at all, and Firefox PWAs do not work, period.

Unwinding this was not easy, despite using `snap` to uninstall them.  I had to first install these tools via apt, which was a huge amount of code and setup.  *Then* I was seeing snap just re-install these apps anyway.  So I had to do [further munging](https://github.com/davetron5000/dotfiles/blob/main/linux-setup/0130-firefox.sh#L8) in some configuration to try to prevent that. I'm not sure if I have succeeded, but once I stopped using Snap, applications started working.

And, given how often Linux requires rebooting and logout/login, it seems to
have stuck to the Firefox/1Password versions I installed.

**Update While Writing This Post:** Snap re-installed Firefox, even though I had
set the priority for it to not do that!  What a great fucking system!

I'm not sure what the point of Snap is, but my official policy is I hate it.

## PWAs Sorta Work!

Progressive Web Apps AKA PWAs AKA running websites as if they were native apps are a really cool concept.  They really would be a [sweet solution](https://www.youtube.com/watch?v=p1nwLilQy64) if they were properly supported by browsers and operating systems.  Chrome/Chromium/Edge appear to offer good support, but in practice, their PWAs don't work - they are just windows of Chromium and not their own apps.  I think the reason has to do with something something Gnome something Wayland, but I have no idea. I tried *a lot* of configurations and Chrome-derived browsers. None worked property.

Ultimately, I was able to use the [Progressive Web Apps for Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/pwas-for-firefox/), which provides the best support I could find.  The main issue with it is that it doesn't really respect or support a lot of metadata and behavior for PWAs, so you have to muck in `about:config` to get things working well.

I was able to script this almost entirely, so the process of installing a PWA is as painless as I could make it.  But it still sucks.

The reason PWAs matter is that most services don't make apps for Linux, but with a modicum of server-side configuration, and support from a browser/OS, a website can be made to act like an app. 

I also created [pwa.support](https://pwa.support) to try to document how PWAs
work across browsers and operating systems, plus details on how to use the PWA
for Firefox extension effectively.

## Things I have Yet To Solve

### The Trackpad Sucks

The trackpad on the Framework 13 is absolute garbage for a lot of reasons, and two things make it hard to use that I couldn't fix:

* Clicking moves the mouse cursor so you get a lot of clicks in the wrong place.  Macs must have some way to counter this. The trackpad seems designed for a Windows world where you only ever click on the lower left part of the trackpad. Macs haven't worked like that for over a decade and I cannot believe PC trackpads are still the same as they were 10 or even 20 years ago.
* Scrolling is hard-coded to the speed of light and not configurable that I could tell.  I think it has something to do with Wayland, but it's just mind-boggling.  The scroll speed of my mouse is also not configurable, but it seems set at something usable.

While I prefer a trackpad, and my Magic Trackpad does work, the scroll speed
makes them both unusable, so I try to use the mouse whenever I can't use the
keyboard. Desktop Linux requires a ton of mousing, but it's generally fine.

### Fingerprint Doesn't Really Work

Using the Framework's fingerprint to login pretty much doesn't work.  About 50%
of the time, I open my laptop to a message that it's timed out.  The remainder
of the time, if I don't succeed on my first attempt it won't try again.  I
set the PAM configuration to try more than once, but it just won't.

For `sudo`  and 1Password unlocking it works more reliably, but also does not try more than once.  I did try to set up multiple fingerprints, but the UX is so bad. It took me 10 minutes of tapping my finger to get the first one set up.  The UI provides no real feedback about what's happening or what to do.

### Text Expansion Not Really Possible
I don't use a lot of text expansions, but I do have a few. I set up espanso and in some text fields in some apps when Mercury is in retrograde, it works.  All other times it doesn't.  I think this is related to why clipboard management doesn't work: there is no way to make a truly global keyboard shortcut and no API to interact with all text entry mechanisms in the OS.  Oh well.

### Installation Hell
There are many ways to install software and they all require a lot of nonsense.  I've settled on using `apt` if possible, even if it requires `sudo cat whatever to /etc/whatever`.  I mean, [look at this nonsense](https://github.com/davetron5000/dotfiles/blob/main/linux-setup/0610-terraform.sh) required to install Terraform!  WTF is any of that?  The only reason I trust it is because it's from their website<sup id="back-1"><a href="#1">1</a></sup>.

Finding install instructions for software was not easy.  My general strategy
was to ask an AI, then use what it told me to find the actual instructions from
the vendor or developer's website.  The AI was usually accurate, but given that
I have no fucking idea what `gpg --dearmor` does, I wasn't about to trust it
outright.

I realize that each distro having at least one, if not three, package managers
makes this problem difficult for maintainers and vendors.  I also think
creating yet more package managers is not a solution. Ideally, there could be
some repository of "here's how to install this software on this distro"
metadata that maintainers could provide, but that's not how things work.

### Notifications are Cursed

No app seems able to consistently maintain its own state and the state of its notifications, nor do they respond to clicks consistently.

For example, Ghostty allows apps to send notifications.  When this happens, I click the notification and…nothing happens.  Sometimes the notification is removed from the notification center, sometimes not. But clicking it never activates Ghostty.  Another example is Fastmail - it shows a badge and a notification for some number of unread messages. Sometimes that number is the exact number of unread messages! Frequently, it is not.

However notifications work under the hood, it's either broken by design, or so complicated that no apps can figure out how to use it properly.  I would honestly prefer if apps just ran `xmessage` (not that you can programmatically activate and raise an app reliably [ and yes, I have the Gnome extension that claims to do that and it sometimes works! ])

## Stuff I Still Need a Mac For
I still use my Mac for a few things:
* Apple Ecosystem stuff like iPhotos. These can be read from Linux via the iCloud website, but my iPhone photos go here.
* Right-click in Finder to scan documents from my Phone. OMG this is so useful, especially during the US's tax season!
* iMessage - having to use my phone only for text messaging my friends sucks.
* Pixelmator and Omnigraffle are great apps.  I don't use them often, but they work well.

## Where I go From Here
Because of `xremap` it's in good enough shape that I can use this laptop without losing my mind and wreaking havoc with learned keyboard shortcuts.  I disabled a lot of pre-existing shortcuts and generally have a setup that isn't hard to use.

As I mentioned in a previous post, I'm using AI code generators to understand how they work and how to use them, and doing this on a Linux box means the blast radius is contained.  There's nothing on this laptop's hard drive that matters.

But even beyond that, I am enjoying using it.  I realize there are other
distros and other window managers and all that.  I think for this second
attempt, since I wrote down everything I had to do to set stuff up, I'm more
confident in trying another window manager or distro<sup id="back-2"><a href="#2">2</a></sup>.  You can see [my setup scripts](https://github.com/davetron5000/dotfiles/tree/main/linux-setup) in all their glory if you want to see what I've done.

For now, Desktop Linux *is* working well as a dev machine, despite my many complaints above.

---

<footer class='footnotes'>
<ol>
<li id="1">
<sup>1</sup>I realize that all of this stuff is ensuring the integrity of the
packages being installed and that it's 100% more observable and auditable than
whatever Apple does to solve the same problem.  And I realize that the lack of
Linux standardization is both a benefit and a downside, but it
<strong>is</strong> just annoying to deal with.<a href='#back-1'>↩</a>
</li>
<li id="2">
<sup>2</sup><strong>Do not</strong> let me know about Hyprland or Omakub or
Omarchy. As I said in a previous post, these people can all go fuck themselves.
I run a lot of software created by horrible people, or from companies run by 
horrible people. I get it. We can't live a life free of compromise. But I can
at least, for now, not use bullshit created by millionaire fascist race car
drivers. <a href='#back-2'>↩</a>
</li>
</ol>
</footer>
