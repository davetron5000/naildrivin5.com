---
layout: post
title: "One Week With Desktop Linux After a 20 Year Absence"
date: 2025-03-19 9:00
ad:
  title: "Fix Your Dev Environment for Good"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

I bought a Framework laptop a couple weeks ago, set it up with stock Ubuntu, and used it for my
primary computer for a week.  It's the first time I've used Linux in earnest in *20 years*.
It's amazing how much has changed and how much hasn't.

<!-- more -->

The tl;dr for this post is that I don't know if I could use Linux as my desktop full time for web development.  While there are many papercuts, the three main issues I can't see a way around are: lack of integrated API documentation lookup (e.g. [Dash.app](https://kapeli.com/dash)), inability to customize keyboard shortcuts consistently across all apps, and the absolute tire-fire of copy and paste.

## Why Even Do This?

I actually grew up on UNIX and then Linux.  All through college and for my first 12 years of
professional experience, I used UNIX or Linux.  OS X made it clear that Desktop Linux was
possible, it was just made by Apple and based on BSD Unix.

I didn't really miss Linux, but when writing [Sustainable Dev Environments with Docker and Bash](https://devbox.computer), I never actually tried anything on a real Linux.  I checked it all on WSL2 and that was that.

It turns out that running a devcontainer as root creates a lot of problems on Linux, and I
figured the best way to truly solve them was to revisit day-to-day Linux.  However, I have lost a lot of enthusiasm for messing with configs and trying to get something working on hardware not
designed for it.

Since it doesn't seem like you can easily run Linux on an M3 Mac, I decided to get a Linux
laptop whose vendor officially supported some sort of Linux.

## The Hardware

My requirements for hardware were:

* Vendor must officially support at least one Linux distro, so I know it will work with their
hardware
* 13" Laptop I could take with me
* Can use my LG Ultrafine 4K Thunderbolt monitor as a secondary display

### The Framework Laptop 13

I considered System76 and [Framework](https://frame.work).  Anecdotal reviews of System76
hardware were mixed, and I liked the idea of a modular laptop, so I went with a [Framework Laptop 13 DIY Edition (Intel® Core™ Ultra Series 1)](https://frame.work/products/laptop13-intel-ultra-1/configuration/new).  This is not the latest one they recently announced, but the now older model.  I also opted for Intel as that was the only processor I could determine should support my Thunderbolt display. I could not figure out if AMD did, and didn't want to find out that it didn't.

My configuration was pretty basic.  I stuck with the default processor, but opted for the
"better" of the two screens.  I don't need HDMI, Ethernet, or an SD card reader, so I went with
three USB-C ports and a USB-A port.  I stuck with the boring black bezel.

### Assembly and Setup

It was fun putting the laptop together - I haven't shoved RAM into a socket in quite a few
years, so it was cool seeing all the parts and putting it all together. Framework's
instructions were spot on and I had no real issues.  Most everything either went into a secure
socket or was magnetically attached.  I did need to screw some tiny screws in, but they
provided a nice screwdriver for their Torx screws.

The last time I did this, I was building a desktop PC and all the parts came in these
anti-static foil thingies in very basic packaging.  Framework has gone the complete other way,
with Apple-style packaging that was very easy to open and deal with.

That said, even though it's all recylcable, it felt like a ton of waste.  Not having something
to recycle beats recyling any day of the week.

<figure>
  <img src="/images/framework-waste-1024.jpg" alt="Photo of the packaging from the Framework laptop. It's a laptop-sized box open, containing many thinner cardboard boxes and protective sheets of compostable plastic." />
  <figcaption>
  At least it's all recylcable? <a href="/images/framework-waste.jpg" target="_blank">View the
  full size image.</a>
  </figcaption>
</figure>

The DYI edition does not come with an OS, but Framework officially supports Ubuntu and Fedora.
Since I've used Ubuntu as the basis for Docker containers, I went with that.  I followed
their instructions to flash a USB drive with an ISO and install from there. It all worked
perfectly, exactly as they had documented.

I'll discuss the software side in a minute

### How Is The Hardware?

While the Framework is by no means a Macbook Pro, it does feel high quality.  Yes, it's made of
plastic and has holes for fans.  And yes, there are seams in it where the modular parts
connect. I'm fine with all of that.

<div data-ad></div>

The screen looked a lot better than I was expecting. It seems retina-quality, or at least
nowhere near as bad as the $400 Lenovo Windows laptop I used for testing my book.

The keyboard felt as good as the one on my Macbook Pro.  The trackpad…well…it's OK. It's not as
big as I'd like, and the way Linux responds to it is not great. It ends up feeling very cheap
and partially broken.  For what it's worth, the Apple Magic Trackpad feels the same way on
Linux, so this is maybe not Framework's fault (see below).

I don't use tap-to-click, and have spent well over a decade using Apple's trackpads.  If that's
you, it will be annoying. If not, it's probably fine. I would say that, after a week of using
it, the trackpad is serviceable, and I worked around its flaws.


Battery life seems very good. Not Mac-level, but I have left it closed for 24 hours and the battery is still pretty well charged.  It seems to last several hours, and I didn't feel like I was in danger of losing work when out and about.

## The First Day Was Rough

The first day with Linux was rough for me.  Mostly due to two things:

* Muscle memory of keyboard shortcuts that aren't set up or do other bizarre things on Linux. This is purely my fault.
* The trackpad/mouse configuration is woefully inadequate. Scroll speeds are 100MPH, acceleration is weird, and clicking with the trackpad causes numerous mislicks.  Each click on either my Magic Trackpad or the laptop's resulted in the mouse moving down a tiny bit.  This was often enough to miss a click target.  I have to assume Apple's drivers account for this.

As we'll see, I somewhat tamed the keyboard shortcuts, though not sufficiently, and I ended up
getting a mouse which was much easier for me to control.

That said, after the first day, I realized I need to slow down and not try things until I knew
they would work. It felt like trying to type on a new keyboard layout or using my left hand for
mousing.

## My Workflow

My goal was to recreate as much of my workflow from the Mac to this new Linux laptop.  In the
end, I was mostly able to do so, however some apps or behaviors were simply not possible.

At a high level, my workflow when programming is something like this:

* A terminal is for running command line apps and scripts.
* Neovim is my editor, however it runs as a GUI app, *not* in the terminal
* All development is done inside a Docker container, with source code mounted. This allows
editing in Neovim, but alleviates me from having to manage a bunch of version managers and
databases.
* A launcher like Alfred responds to <kbd>Cmd-Shift-Space</kbd> to allow me to type the name of an app or initiate a web search.
* I use copy and paste liberally, and have a clipboard manager (Alfred, again) to manage
multiple pastable things.
* I heavily rely on a core set of keyboard shortcuts supported by all Mac software (including bad citizens like Firefox and Electron).
* 1Password manages my passwords, which I unlock with TouchID.
* <kbd>Cmd-Tab</kbd> allows switching apps..
* Inside Neovim (or through my launcher) I can look up API documentation using Dash. This means
if my cursor is in a `.css` file in the middle of `max-height`, I can type `K` and Dash will
raise to the top, get focus, and show me the MDN docs for the `max-height` CSS property.
* For Mail, Calendar, Mastodon, BlueSky, or Plex, I expect to be able to <kbd>Cmd-Tab</kbd> or use my launcher to select them—they do not run as tabs in Firefox.
* Occasionally, I run the iPhone simulator, draw diagrams with Omnigraffle, or edit images with
Pixelmator.
* I rarely use the Finder

I was able to get *most* of this working, however, keyboard shortcuts were challenging, copy
and paste is confusing, and the API documentation options pale in comparison to Dash.

## Software

I basically got to the setup below by working on real projects and, when I hit a wall, figured
out the Linux way of addressing the issue.  This usually involved installing a lot of stuff
with `sudo apt-get install` and I did not write down any of what I did.

I quickly learned that the Ubuntu "App Center" should never be used unless the people building
the software say to use it.  Several apps did not work until I uninstalled them via App
Center and re-installed them on command line.

<div class="comparison">
    <img src="/images/linux-desktop/terminal-192.png">
    <p><span class="name">Terminal.app</span> on Mac</p>
    <img src="/images/linux-desktop/ghostty-192.png">
    <p><span class="name">Ghostty</span> on Linux</p>
    <div class="description">
            <span role="img" aria-label="thumbs up"> 👍</span>
        <p>
            Gnome-terminal was very hard to configure and very limited.  Ghostty allowed me to configure all of my keyboard shortcuts and worked well. I don't use it on Mac since Terminal.app works well and Ghostty killed my battery life.  It doesn't seem to have that issue on Linux.
        </p>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/vimr-app-icon-192.png">
    <p><span class="name">VimR</span> on Mac</p>
    <img src="/images/linux-desktop/neovide-128x128.png">
    <p><span class="name">Neovide</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="handing facing right">🫱</span>
        <div>
    <p>
        Neovide has the most bizarre set of defaults I've ever seen. It is configured to animate every move of the cursor at an extremely slow animation rate.  It is almost impossible to use.  But, this can all be turned off very easily and the documentation is great.
    </p>
    <p>
    I was also unable to get Neovide to behave as its own "app". I can Cmd-Tab to it as a separate
    window, but it shows a default icon and is considered a window of Ghostty.  I tried creating
    magic <code>.desktop</code> files, but they didn't seem to do the trick.
    </p>
    </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/docker-mark-blue-192.png">
    <p><span class="name">Docker</span> on Mac</p>
    <img src="/images/linux-desktop/docker-mark-blue-192.png">
    <p><span class="name">Docker</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="thumbs up"> 👍</span>
        <div>
            <p>
                I installed Docker per their Linux instructions, which does not include a
                desktop GUI. That's fine, as I never use the GUI anyway.  I 
                <a href="https://docs.docker.com/engine/install/linux-postinstall/">
                followed the Linux post-install instructions
                </a> to allow my user to access Docker.  This was 1) because it was much easier
                than the rootless setup, and 2) required for me to get the details in the book
                right.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/alfred-192.png">
    <p><span class="name">Alfred</span> on Mac</p>
    <img src="/images/linux-desktop/albert-192.png">
    <p><span class="name">Albert</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="handing facing right">🫱</span>
        <div>
            <p>
            Albert looks inspried by Alfred and works pretty well.  I had to configure a
            system-wide keyboard shortcut inside the Ubuntu/Gnome/??? Settings app. Albert
            doesn't seem able to do this, even though it has a configuration option for it.
            Fortunately, <code>albert open</code> will open, raise, and focus Albert.
            </p>
            <p>
            Albert includes a clipboard manager, but it didn't work as well as Alfred's. I
            think this is because Linux lacks a system-wide clipboard and/or has multiple
            clipboards. I eventually gave up on relying on it.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/1password-192.png">
    <p><span class="name">1Password</span> on Mac</p>
    <img src="/images/linux-desktop/1password-192.png">
    <p><span class="name">1Password</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="thumbs up"> 👍</span>
        <div>
        <p>1Password worked great…once I got it installed</p>
                <p>
                Installing 1Password and Firefox from App Center resulted in the browser
                extension not working and caused 1Password to ask for 2FA every time I opened it.
                It was actually not easy to delete both apps from App Center, but once I
                re-installed them, they both worked fine.
                </p>
                <p>
                On Linux only, the browser extension will randomly open up 1Password's web page
                and ask to me log in, though if I ignore this, everything still works.  This is
                what it does on Safari on macOS (except there it just doesn't work).
                </p>
                <p>
                Even now, the browser extension can no longer be unlocked with the fingerprint
                scanner and I have to enter my passphrase frequently. It's extremely annoying.
                But at least it works, unlike on Safari, which just does not.
                </p>
        </div>
    </div>
</div>
<div class="comparison">
    <kbd>Cmd-Tab</kbd>
    <p><span class="name">Switch apps</span> on Mac</p>
    <kbd>Cmd-Tab</kbd>
    <p><span class="name">Switch <strong>windows</strong> of all apps</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="thumbs down">👎</span>
        <div>
                <p>
                In theory, the Gnome task switcher allows switching between apps like on macOS.
                In practice, because I could not get Neovide to run as a separate “app” in the
                eyes of Gnome, I could not <kbd>Cmd-Tab</kbd> to it. I would have had to
                <kbd>Cmd-Tab</kbd> to
                Ghostty, then <kbd>Cmd-~</kbd> to Neovide.
                </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/dash-192.png">
    <p><span class="name">Dash</span> on Mac</p>
    <img src="/images/linux-desktop/mess-192.png"
         itemref="mess-icon-acd-version mess-icon-acd-level mess-icon-acd-ai-name mess-icon-acd-details">
    <p><span class="name">A Mess</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="thumbs down">👎</span>
        <div>
            <p>
                More on this below, but Zeal didn't work for me. I ended up using a hacky
                system of FirefoxPWA, DevDocs, and some config.
            </p>
        </div>
    </div>
</div>
<data id="mess-icon-acd-version" itemprop="ai-content-declaration:version" content="1.0.0"></data>
<data id="mess-icon-acd-level" itemprop="ai-content-declaration:level" content="total"></data>
<data id="mess-icon-acd-ai-name" itemprop="ai-content-declaration:ai-name" content="ChatGPT"></data>
<data id="mess-icon-acd-details" itemprop="ai-content-declaration:details" content="create me an app icon of a mess"></data>
<div class="comparison">
    <img src="/images/linux-desktop/fastmail-192.png">
    <p><span class="name">FastMail</span> on Mac (as Safari Web App)</p>
    <img src="/images/linux-desktop/fastmail-192.png">
    <p><span class="name">FastMail</span> on Linux (as Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="thumbs up"> 👍</span>
        <div>
            <p>
                More on FirefoxPWA below, but this worked great.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/fantastical-mac-icon-192.png">
    <p><span class="name">Fantastical</span> on Mac</p>
    <img src="/images/linux-desktop/fastmail-192.png">
    <p><span class="name">Fastmail</span> on Linux (as Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="thumbs up"> 👍</span>
        <div>
            <p>
                More on FirefoxPWA below. I could not set a custom icon, but this works fine.
                FastMail's calender UI is pretty good.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/ivory-192.png">
    <p><span class="name">Ivory</span> on Mac</p>
    <img src="/images/linux-desktop/mastodon-192.png">
    <p><span class="name">Mastodon.com</span> on Linux (as Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="handing facing right">🫱</span>
        <div>
            <p>
                First time really using Mastodon's web UI and it's not very good. But works
                well enough.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/Bluesky_Logo-192.png">
    <p><span class="name">Bluesky</span> on Mac (as Safari Web App)</p>
    <img src="/images/linux-desktop/Bluesky_Logo-192.png">
    <p><span class="name">Bluesky</span> on Linux (as Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="handing facing right">🫱</span>
        <div>
            <p>
            It's the same crappy UI in both.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/plex-192.png">
    <p><span class="name">Plex</span> on Mac (as Safari Web App)</p>
    <img src="/images/linux-desktop/plex-192.png">
    <p><span class="name">Plex</span> on Linux (as Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="thumbs up"> 👍</span>
        <div>
            <p>
            Plex is plex.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/apple-music-192.png">
    <p><span class="name">Apple Music</span> on Mac</p>
    <img src="/images/linux-desktop/apple-music-192.png">
    <p><span class="name">Apple Music</span> on Linux (as Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="handing facing right">🫱</span>
        <div>
            <p>
        Kindof amazed this existed and works!  Firefox insists on "installing DRM" but also
        didn't seem to actually do anything.  I think the Apple Music app is really just this
        web player. It works the same, and is still just as crappy as it was the day it
        launched as iTunes.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/messages-192.png">
    <p><span class="name">Messages</span> on Mac</p>
    <span class="linux" role="img" aria-description="Crying Emoji">😢</span>
    <p><span class="name">Nothing</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="thumbs down">👎</span>
        <div>
            <p>
                Messages is an Apple-only thing, so I was stuck taking out my phone <strong>a
                lot</strong>.  I just didn't interact with my friends on text nearly as much.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/maps-192.png">
    <p><span class="name">Maps</span> on Mac</p>
    <img src="/images/linux-desktop/wego-192.png">
    <p><span class="name">Wego Here</span> on Linux (as a Firefox PWA)</p>
    <div class="description">
        <span role="img" aria-label="handing facing right">🫱</span>
        <div>
            <p>
                I have tried to avoid having Google in my life, and Apple's maps are pretty
                good, at least in the US.  OpenStreetMap is servicable, but <a href="https://wego.here.com">Wego Here</a> is a bit nicer.
            </p>
        </div>
    </div>
</div>
<div class="comparison">
    <img src="/images/linux-desktop/keychron-192.png">
    <p><span class="name">Keychron Launcher</span> on Mac (to customize my keyboard)</p>
    <span class="linux" role="img" aria-description="Crying Emoji">😢</span>
    <p><span class="name">Nothing</span> on Linux</p>
    <div class="description">
        <span role="img" aria-label="thumbs down">👎</span>
        <div>
            <p>
                Chrome could not access USB no matter what I did. I <code>chmod</code>'ed
                everything in <code>/dev/</code> to be owned by me and it didn't work.
                I ended up having to program the keyboard on my Mac, plug it into the Framework
                to check it and switch it back. Ugh.
            </p>
        </div>
    </div>
</div>

I realize there are alternatives to Pixelmator, Omnigraffle, and Lightroom, but they are just
not as good.  I'm sure I could deal with whatever Linux alternatives there are, but I'm bought
into those apps.

## How it Worked

To toot my own horn, every single dev environment worked without any changes. I pulled down a
repo, ran <code>dx/build</code> to build images, ran <code>dx/start</code> to start containers,
<code>dx/exec bin/setup</code> to set up the app inside the container and <code>dx/exec
bin/ci</code> to run all tests, which all passed.

Once I started actually making changes to my code, I <strong>did</strong> run into issues running all containers as root. I have sorted that out and <a href="https://devbox.computer">the book will be updated</a> to reflect this.

Aside from that, the experience was overall pretty great once I had installed everything and
configured as much as I could to have keyboard shortcuts I could live with.  To use this full
time for software development, however, a few things would need to change.

Instead of "The Good, The Bad, and The Ugly", I'm going to list Dealbreakers, Papercuts, and
Pleasntries.

### Dealbreakers

There are three major issues that I would have to address to use  Linux full time: clipboard
craptitude, keyboard shortcut inconsistency, and API documentation lookup.

#### Clipoard Craptitude

Just do a web search for "Copy and Paste on Linux" or "Clipboards on Linux" and you will find a
stream of confusion about the clipboard situation on Linux.  I mean, just <a href="https://www.jwz.org/doc/x-cut-and-paste.html">read this</a>.

On Mac (and on Windows, I believe), there is a single system-wide clipboard. When you copy
something into it, it becomes available to paste anywhere. You can run an optional clipboard
manager that stores the history of stuff you have copied and allow you to paste it.

On Linux, it absolutely does not work this way.  There is a clipboard that's filled when you
select text (and there may be one for X11 apps and one for Wayland apps?). There's a system
clipboard, too, but it's not always clear if you've copied to it, or if you are pasting from
it.

In Neovim, I could not tell what was happening.  Usually <kbd>:*p</kbd> will paste and
<kbd>:*y</kbd> will yank. Neither seemed to do what I expected.  I ended up mapping
<kbd>Alt-C</kbd> and <kbd>Alt-V</kbd> in NeoVim's configuration to do copy and paste. It worked
better, but not 100% of the time.

I'm sure the way copy and paste on Linux can be learned, but I found myself failing to successfully copy and/or paste on numerous occasions.  Eventually, I learned to always type <kbd>#</kbd> in the terminal before pasting, because I never knew exactly what was going to be pasted there.

Albert's clipboard manager didn't allow pasting in all apps, and it didn't store an accurate
history of stuff I had copied (and pasted). I'm not sure how it works, but I just stopped using
it after a while.

I cannot fathom why this clipboard behavior is the default, and I would probably need to go on a deep dive to understand and remedy it, if I were to use Linux full time. It's hard to overstate how frustrating it is to not have copy and paste work.  Christ, it works better on <strong>iOS</strong>, which I thought had the worst copy and paste experience ever created.

#### Keyboard Shortcut Inconsistency

On a Mac, there are certain keyboard shortcuts that every app responds to, even bad citizens
like Firefox and Electron. Not so on Linux.

The source of this problem is, I guess, due to terminals relying on the Control key for
non-alphanumeric sequences.  The Control key was adopted by Linux GUI apps as the key to use
when you want to invoke a shortcut.

On a Mac, this has historically been either the "Apple Key" or now the Command (Cmd) key.  This
key not only is irrelevant to any terminal emulator, it also is right under your left thumb.

IMAGES

This makes it ergonomically easy to use, even with other modifiers.  <kbd>Cmd-Shift</kbd> or <kbd>Cmd-Option</kbd> are far easier to use than <kbd>Control-Shift</kbd> or <kbd>Control-Alt</kbd>.

I have a ton of muscle memory built up using the key under my thumb. On Mac, that key is Cmd or Super. On the Framework laptop, it's Alt.  I rarely use Control, since it's almost never a modifier on Mac.  I also have Caps Lock mapped as Escape, since I have not had a keyboard with Escape on it in quite a while (thus, I cannot use that for Control, which would be slightly better, ergonomically).

To make matters worse, apps on Linux do not have consistent keyboard shortcuts.  Copying and
Pasting in Gnome-Terminal is different than in Firefox.  And to make matters <strong>even
worse</strong>, Firefox provides no way to customize keyboard shortcuts. You
<strong>have</strong> to use <kbd>Ctrl-C</kbd> to copy (e.g.).

What this means is twofold:

* Any new app I install, I have to inspect its configuration to see if I can configure the
keyboard shortcuts I want. Namely, using the "key under my thumb that is not Control" as the
modifier.
* When using Firefox, I have to internalize and use its Control-based shortcuts, since they
can't be modified.

To try to deal with this situation, I accepted that Linux uses <kbd>Alt</kbd> way more than
<kbd>Super</kbd>, so I set the "Windows Mode" of my Keychron keyboard to have <kbd>Alt</kbd> as
the "key under my thumb" (which is the left space bar).

This meant switching from my desktop keyboard to the laptop wasn't so jarring.  It also meant, a few default shortcuts worked like on Mac.

For Firefox, the situation is dire, but I did find an extension that gave me some ability to
control the shortcuts. I was able to get it to allow changing tabs with <kbd>Alt-{</kbd> and <kbd>Alt-}</kbd>, however it only works 90% of the time.

I'm not sure how I would deal with this day-to-day. I guess I'd just build up muscle memory
that when I'm in Firefox, I do things differently.

I <strong>do</strong> think this inconsistency is a contributor to some of my copy and paste
woes.  I'm sure I <em>thought</em> I copied something when I didn't, only to paste whatever was
last on the clipboard.

#### API Documentation Lookup

For my entire career, I'm used to being able to quickly go from a symbol in my editor (which has always been some form of vi) to API documentation. Yes, [I wrote a Java Doclet that generates vimdoc for the Java Standard Library](https://github.com/davetron5000/vimdoclet).  Nowadays, I use Dash.

I use it in two ways.  First, I can use Alfred to lookup something in Dash, say "max-height":

<figure>
  <img src="/images/linux-desktop/alfred-dash.png" alt="Screenshot of Alfred with 'max-height' typed into it, doing a Dash lookup" />
</figure>

Hitting return shows the docs in MDN for this property:

<figure>
  <img src="/images/linux-desktop/dash-max-height-600.png" class="bordered" alt="Screenshot of Dash, showing MDN's documentation for max-height">
  <figcaption>
  <a href="/images/linux-desktop/dash-max-height.jpg" target="_blank">View the full size image.</a>
  </figcaption>
</figure>

I can do this directly from vim by placing the cursor on a symbol and hitting <kbd>K</kbd>.

<figure>
  <img src="/images/linux-desktop/vim-dash.png" alt="Screenshot of Vim showing Ruby source code, with the cursor on the symbol 'File'">
</figure>

This brings up Dash, perform a search in the context of only Ruby documentation:

<figure>
  <img src="/images/linux-desktop/dash-file-600.png" class="bordered" alt="Screenshot of Dash, showing the results for searching Ruby documentation for 'File'">
  <figcaption>
  <a href="/images/linux-desktop/dash-max-height.jpg" target="_blank">View the full size image.</a>
  </figcaption>
</figure>

One bit that you can't see from these examples is that Dash allows you to install documentation
for pretty much any Ruby Gem (or other code library).  That means I can have esoteric stuff
like the Ruby Playwright bindings or the Faker gem's RubyDoc available.  Searching in Dash is
far faster than web searching or trying to use GitHub.

First, I tried [Zeal](https://zealdocs.org/).  Zeal did not seem to have a way to install
documentation for arbitrary Ruby Gems.  Worse, I could not ever get Zeal to get focus, raise to
the top, and show me search results.  I tried a lot of options and it just never worked.

Next, I tried [DevDocs](https://devdocs.io).  I ran DevDocs in a FirefoxPWA (more on that
below), so it behaved like a separate app. I configured both Albert and Neovim to use
<code>open</code> to open a magic URL that would search DevDocs and show the results in the
PWA.

This behavior works about 90% of the time (the other 10% it shows as different URL).  DevDocs
does not allow installing arbitrary documentation. You get whatever they have, and they aren't
looking to install docs for RubyGems.

This sucks for my workflow. I would have to sort this out.  I guess devs today who aren't
letting AI write their code are just hitting Cmd-Space and seeing what VSCode shows them?  I
just can't work that way.

### Papercuts

These are issues that were annoying, but I could live with.

* Mouse/Trackpad scrolling speed cannot be adjusted. I could not find a way that worked on
Wayland and X11.
* I *did* find a way to configure my extra mouse buttons and extra mousewheel, using
input-remapper.  It sometimes just stops working and needs to be restarted, but it did exactly
what I wanted.
* Too many ways to install software. Sometimes you use App Center, sometimes you use
`apt-get`, sometimes you download a file and dump it into your path, sometimes you do something
else. This is how it was 20 years ago, and it still is like this and it sucks.
* No system wide text replacement. I can type `dtk` anywhere on my Mac and it replaces it with
my email address.  I found a version of this for Linux and it just didn't work. I ultimately
programmed a macro into my Keychron keyboard.
* The font situation is baffling.  I'm going to set aside how utterly hideous most of the fonts are.  For some reason, Linux replaces fonts in websites, making `font-family` totally useless.
If I specify, say, `Helvetica, 'URW Gothic', sans-serif`, and URW Gothic is installed, Linux
will send Noto Sans, because that is a replacement for Helvetica.  I can't understand the
reasoning for this.
* No ApplePay on websites means using PayPal or swtiching to my phone.
* Cannot copy on iPhone and paste on Linux or vice-versa.
* Web-only access to iCloud. Apple is not good at web apps.

### Pleasantries

I realize this is a lot of criticism, but I did actually miss just how *fun* it was to use an
operating system that I could tweak, and that wasn't being modified by whims of Apple designers
looking to get promoted.  While Apple is great at hardware, and good at software/hardware
integration, their software has gotten much worse over the last 10 years, often foisting
zero-value features on users.

The other thing that surprised  me was just how many apps I use are web apps, and that those
apps are pretty good, especially when run as a standalone "web app" and not as a tab in
Firefox.

Ironically, Apple provides a great UI for doing this via Safari Web Apps (it's too bad they also hamstring what a PWA can do on iOS). The situation on Linux is rather dire. Chrome supports it, but it's cumbersome, and Firefox, of all browsers, provides zero support for it.  But, [FirefoxPWA](https://addons.mozilla.org/en-US/firefox/addon/pwas-for-firefox/) to the rescue!

#### Firefox PWA

The good and bad parts of Linux are both its flexibility and configurability. FirefoxPWA is no
different.  The general protocol of a "Web App Running as a Standalone App" is, in my mind:

* Separate app in the app switcher, complete with icon and title.
* Navigation within the app's website stays in the app.
* Navigating outside the app's website opens in the system browser.
* Activating or opening the app from another context (e.g. app launcher or command line) brings
the app into focus, but does not reload the app's start page.

This is possible with FirefoxPWA, but requires some tweaking.

Once you've created your app and relaunched it, it will use the Web Manifest to get icons and
names.  It does not respect the `scope` attribute, so by default all links open in the PWA and not Firefox.  By default, when a PWA is launched or activated by the OS, it will reload the start page. It also won't allow you to override icons.  Well, it will, it just doesn't work.

Fortunately, the author(s) of FirefoxPWA have done a good job with configuration and
documentation.  In any app, you can do <kbd>Control-K</kbd> to go to a URL and type
`about:config` to get into the settings.

From there, to fix app activation, set `firefoxpwa.launchType` to "3".  To ensure URLs outside the app are opened in Firefox, set `firefoxpwa.openOutOfScopeInDefaultBrowser` to true, and set
`firefoxpwa.allowedDomains` to the domains of the app.

I couldn't figure out a way to make these the defaults, but this is all one time setup, so
worked fine.  Once I had this setup, Mastodon, Bluesky, Plex, and Fastmail all behaved like
their own apps.

#### DevDocs

While DevDocs isn't perfect, when used with FirefoxPWA, it is serviceable.  DevDocs has a URL
format that will perform a search.  Basically, `devdocs.io/#q=keyword` will search all your
configured docs for "keyword", and `devdocs.io/#q=ruby keyword` will search only Ruby docs for
"keyword".

Thus, I needed to be able to run `open devdocs.io/#q=keyword` and have it open the DevDocs PWA
and load the given URL.  This was somewhat tricky.

First, I had to change `firefoxpwa.launchType` for DevDocs to "2", which replaces the existing
tab with whatever the URL is.  This requires setting "Launch this web app on matching website"
for DevDocs and setting automatic app launching for the extension.

The result is that `open devdocs.io/#q=ruby keywdord` will open that URL in regular Firefox,
which triggers Firefox PWA to open that URL in the DevDocs web app.  And this works about
90% of the time.

FirefoxPWA installs Firefox profiles for each Web App, but I could not figure out how to use
this to open a URL directly in the DevDocs PWA.  There might be a way to do it that I have not
discovered.

#### Other Cool Stuff

Alt-click anywhere in a window to drag it. Yes! I had forgot how much I loved being able to do
this. Mouse over a window to activate—but not raise—it.  Makes it really handy to enter text in
a browser window while observing dev tools.

I also missed having decent versions of UNIX command-line tools installed.  macOS's versions
are woefully ancient and underpowered.

Time will tell if I take advantage of Framework's upgradeability.  At the very least, I can
swap out ports if needed.

## Where I Go from Here

I still need to update _Sustainable Dev Environments with Docker and Bash_, and I plan to do
that entirely on the Framework laptop.  My book-writing toolchain is Docker-based, so should
work.

Depending on how that goes, I may spend more time addressing the various major issues and
papercuts to see if I could use it for real, full time, for web development and writing.

