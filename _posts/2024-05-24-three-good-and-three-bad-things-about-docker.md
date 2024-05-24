---
layout: post
title: "Three Good and Three Bad Things about Docker"
date: 2024-05-24 9:00
ad:
  title: "Fix Your Dev Environment for Good"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
related:
  - "The Katz Conjecture: You Must Understand What an Abstraction Abstracts"
  - "A Reasonable Development Environment"
  - "Choosing Technology"
  - "Creating a Culture of Consistency"
---

I could use Docker, but didn't understand it until I wrote [Sustainable Dev Environments with Docker and Bash](https://devbox.computer).  While I was expecting to kind hate it, there's actually some really cood stuff about Docker and its ecosystem.  But yeah, there's some crap, too.

<!-- more -->

To end on a high note, I'll start with one of three things that is pretty bad about Docker: The `latest` tag.

## The `latest` Tag is Not Even Wrong

A big learning I had with Docker was that image names *must have a colon in them*.  The part before the colon is the "repo" and
the part after that is the "tag".  And what I learned was that if do not provide a tag, one will be added silently by Docker, and it's name is "latest".

The thing is, this default behavior implies that a given image is the latest of something, but it *is no way guaranteed the latest of anything*.  Suppose I'm a maintainer of the Redis Docker images.  I can checkout the source code for Redis 4, build it, build a Docker image, and push it using the name "redis".  *That* will be the image available via `redis:latest`. Or, I could build Redis 5, push that as `redis:latest` explicitly, then push `redis:6` from another repo.  `latest` is anything but.

The best recommendation I can give is to never use the `latest` tag by always specifying one.  The book coins this as Asimov's First Law of Docker:

> Never use the "latest" tag or, through inaction, allow the "latest" tag to be used.

Docker's biggest strength is where these named images get pushed: DockerHub.

## DockerHub is a Pretty Reasonable One Stop Shop

Before Docker's ubiquity, running services like databases or caches was a pain. Each OS—including different Linux variants—would
have different instructions on how to set it up.  Sometimes, Linux package managers would coalesce on how to do it, but Linux
package managers are kinda like bamboo - there's more than you think and you can never get rid of them all.

Docker, like virtual machine technology before it, can make this problem less acute.  The instructions simply become "start up
this Docker container".  But Docker _Hub_ reduces the pain even further. It's a central repository (i.e. "hub") of pre-made
images.  This hub allows vendors to share their images with the community as a clear indicator that "this is the way to run our
service".

<aside class="pullquote">
Being able to install, start, and stop any complex piece of software with one command huge
</aside>

Although it's not perfect (as we'll see next), it's a net positive all around, *especially* when managing a dev environment.
While I can imagine that some production environments need customized installs of databases or message queues, your dev
environment usually will not. Being able to install, start, and stop any complex piece of software with one command is a huge
productivity boost.

Of course, Docker being Docker, DockerHub doesn't *quite* hit the mark on being able to rely on images you find there.

## DockerHub is also a Rusty Supply Chain in Need of Improvement

Let's check out the [Redis DockerHub](https://hub.docker.com/_/redis) page.  You'd do this because you want to run the official,
vanilla version of Redis, not [whatever whoever Bitnami is's is](https://hub.docker.com/r/bitnami/redis). And the Redis DockerHub *does* look official.

It has a green badge and green text that states "Docker Official Image".  Whatever this means is unclear, as you cannot click
that to go anywhere.  It is maintained by "The Docker Community". This *can* be clicked, and takes you to [a GitHub
page](https://github.com/docker-library/redis) for an organization called `docker-library`.

Going to that organization's page tells us that it's the org for "Docker Official Images" and…that's it.  This sure looks official, but given that [it's possible to verify an organization on GitHub](https://docs.github.com/en/organizations/managing-organization-settings/verifying-or-approving-a-domain-for-your-organization) and Docker have not done so makes this look pretty sketchy to me.

<aside class="pullquote">
Given that it’s possible to verify an organization on GitHub, yet Docker have not done so, makes this look pretty sketchy
</aside>

I guess I can try to figure out if the three actual humans listed as People actually work for Docker?  The [documentation on
official images](https://docs.docker.com/trusted-content/official-images/) does not link to this.

Now, it's like 99% likely that this is all fine. I did find the GitHub link from Docker's website, but there's just nothing
connecting all these dots. Why not verify the `docker-library` org to  make it clear? Why not document clearly how verification works?

This is a low-effort thing to do.  Without it, I would be very hesitant to trust any of this in a regulated production environment. But, for local dev environments, it's not a big deal.  Which leads to the next great thing about Docker: Docker Compose

## Docker Compose Is an Isolated Dev Environment That Lasts a Long Time

While it's easy to start a Docker container from an image with one line of code, getting several of them working together in
isolation is not so simple.  For example, if you work on two projects that both use Postgres, you need to make sure that neither
project is connecting to the others' Postgres.

Before Docker, you could play games with ports or database names, and with plain old Docker, you'd still have to.  But Docker
Compose entirely solves this. Granted, it does so with YAML, but consider this short snippet:

```yaml
services:
  app:
    image: my-app:ruby-3
    volumes:
      - type: bind
        source: "./"
        target: "/root/work"
    working_dir: /root/work
    ports:
      - "3000:3000"
  db:
    image: postgres:15
```

This will start up a Postgres 15 that *only* the app running inside the `my-app:ruby-3` image can see.  This completely isolates that
Postgres from any other app.  Meaning: you never have to worry about this creating problems outside of itself.

I realize Docker Compose was probably created to manage production deployments. I wonder if anyone does this?  For local dev, this is pretty great.  If you want to add a memcached, just add two lines to this YAML and your memcached is now part of this completely isolated network. Have another project using an older version of Postgres? Not a problem: just use the image for the older version. Nice!

Of course, figuring out the versions of these things is needlessly convoluted.

## Docker Doesn't Support Image Versions Despite the Entire History of Software

If you look at any Docker Hub page, you'll see image names that kinda look like they have versions in them: `redis:7.0.14`, `ruby:3`, etc.  **These aren't versions at all, not even a little bit**. These are *image names* that *must contain a colon* and the stuff after the colon is a *tag*, not a version.

Because of this image naming convention, there's no way to clearly indicate what version of a piece of software is contained within the image.  Most vendors have adopted a convention to how they name tags that will indicate what version is inside:

```
MAJ.MIN.PATCH-QUALIFIER
-+-|-+-|--+--|---+----|
 |   |    |      |
 |   |    |    optional - indicates a 
 |   |    |               different OS than default
 |   |    |
 |   |    optional, specifies the patch
 |   |              level of the software.
 |   |              if omitted, latest patch is assumed.
 |   |              Requires that MIN is specified
 |   |
 |   optional, specifies the minor verison
 |             if omitted, latest minor is assumed.
 |
 required, specifies the major version
```

For example, `redis:6-alpine` means that the image contains (as of this writing), Redis 6.2.14, running on Alpine Linux.
`redis:7.0.15-bookworm` is Redis 7.0.15 running on Debian Bookworm.

This convention isn't documented anywhere, it's not supported on any level by Docker's tooling, but is ubiquitous. And it only
works when the vendor makes sure their tag is formatted in a particular way. How many unique Bash scripts do you think exist to
manage these tags?

<aside class="pullquote">
The notion that software is versioned has existed long before that…essentially forever
</aside>

While I understand that a Docker image's purpose isn't just to wrap one piece of software, it is mind-boggling to me that there
is no explicit way to version images. Semantic Versioning was first popularized *thirteen years ago*.  The notion that software
is versioned has existed long before that…essentially forever. Docker images should be versionable without relying on tags.

OK, that's enough bad news, but the latest bit of good news is Docker's biggest strength: its ubiquity.

## Docker and Containers Are Everywhere. That's Good for Sustainable Software

A big reason why I think developers should base their dev environments on Docker and Bash, as opposed to Microsoft's
DevContainers (or random devtools startups) is that Docker (and Bash) are ubiquitous. Docker is everywhere.  Even though
Docker's documentation isn't great, it's not bad, and a zillion people understand it.

<div data-ad></div>

In fact, I would say that while Docker isn't necessarily easy to use, it *is* relatively simple. This means that it's
understandable by a good chunk of developers.


A tool that works well and is extremely widely understood is a great tool to use.  It removes a lot of risk in what is every
single developer's core competency.  Devcontainers, as an example, is not widely understood, usable in only one code editor, and
amazingly complex under the hood (NodeJS documents exactly three lines of code to install Node; Microsoft instead does it in 400+ lines of Bash).

To be clear, the ubiquity of a tool that is not fit for purpose is irrelevant.  The point is that while Docker, Nix, and DevContainers can all be used to create a functional dev environment, Docker is the quickest to get an understanding of, since it's so widely used and widely understood.

Docker is so ubiquitous that it has spawned standards that can outlive it: [The OCI](https://opencontainers.org) specifies
container formats, [containerd](https://github.com/containerd/containerd) is an open-source piece of software to run containers
without the need for Docker's software.

This is good.  And I think the good outweighs the bad with Docker, especially for managing your dev environment.
