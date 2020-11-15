---
layout: post
title: "Docker on Mac for Development with Fast Disk Access and Webpack Dev Server"
date: 2020-05-13 09:00:00
ad:
  title: "Sustainable Rails"
  subtitle: "Build Apps to Last for Years"
  link: "http://bit.ly/sus-rails"
  image: "/images/sustainable-rails-cover.png"
  cta: "Buy Now $49.95"
---

I am somewhat obsessed with clean, repeatable, maintainable dev environments and Docker has all the pieces to
create one.  For the past several months on several projects, I've been using Docker (and `docker-compose`) to not
only run services like Postgres and Redis, but also as a virtual machine in which to run all my dev commands. My
Mac is only running Docker and vim.

The problem is that Docker on Mac has *very slow* file system access.  Running `bin/rails server` on a fresh Rails
app can take almost a minute to come up.  I recently discovered that, by using NFS, file system access is *way*
faster.  This creates a bit of a problem for `webpack-dev-server`, but this, too, can be fixed.  I want to write
out what I did in case it's helpful.

<!-- more -->

## My Setup

I have a single `docker-compose.yml` file that runs services like Postgres, but also runs a custom-built image for
developing my Rails app.  I start all the containers in the `docker-compose.yml` file and then run bash inside the
app's container to do development.  Here's what my `docker-compose.yml` file looks like:

```yaml
version: "3.7"
services:
  db:
    image: postgres:12
    environment:
      POSTGRES_PASSWORD: postgres
  redis:
    image: redis:5
  myapp-development:
    image: myapp-development
    entrypoint: "tail -f /dev/null"
    ports:
      - "9001:3000"
      - "8001:3035"
    volumes:
      - 'nfsmount:/root/apps'
      - type: volume
        target: /usr/dependencies-cache
volumes:
  nfsmount:
    driver: local
    driver_opts:
      type: nfs
      o: addr=host.docker.internal,rw,nolock,hard,nointr,nfsvers=3
      device: ":/Users/davec/Projects/NewCo"
```

A few notes:

* The reason `myapp-development` is running `tail` as the `entrypoint:` is that the container needs to run
something, but I ultimately intended to log into it, so tailing nothing works.  I then use `docker exec -it «container_id» bash -l` to "log in". From there I can run my various dev commands like `bin/rails test` or whatever.
* `webpack-dev-server` runs on port 3035, which I'm mapping to `8001`.  We'll see the Webpack side of that config in a bit.
* The `/usr/dependencies-cache` is part of a custom base image I use. That base image installs a default set of
Ruby Gems and NPM modules into that location. It's got nothing to do with NFS but wanted to point it out to avoid
confusion.
* The `nfsmount` volume is what this post is about.  Will explain in a sec.

To make this work, you have to set up NFS on your Mac

## Set up NFS on your Mac

First, edit `/etc/exports`, which lists all the directories to export over NFS:

```
sudo vim /etc/exports
```

You can use any editor you like instead of `vim`.  Then add this line:

```
/Users/davec/Projects/NewCo -alldirs -mapall=501:20 localhost
```

Here's what's going on here (I will admit I cargo-culted this line and finding out what these options do is…not easy):

* The first bit is the path to the directory to export.
* The `-alldirs`, I *believe* allows you to mount subdirectories of the exported directory if you like.
* The `-mapall=501:20` is specifying the user and group.  Type `id` at a terminal prompt to see your user ID and groups.  I believe the default on macs is that your user is 501 and in group 20, which is staff.
* The `localhost` part allows the path to be mounted on the same host exporting it, which is what has to happen.

Next, edit `/etc/nfs.confg` so it has this line:

```
nfs.server.mount.require_resv_port = 0
```

By default, NFS only allows mount requests from "privileged" ports, which are ports below 1024.  Docker is not
going to use these ports, so we set the verbose-yet-still-abbreviated `require_resv_port` option to `0`, which
means "allow any ports".  Bet you don't think YAML is so bad now, do you?

Then, restart `nfsd` (which is running NFS) so all this config is read in:

```
sudo nfsd restart
```

Now that that's done, we use this in Docker.

## Use NFS in Docker

Here's the part of the `docker-compose.yml` above that's relevant:

```yaml
services:
  # «snip»
  myapp-development:
    # «snip»
    volumes:
      - 'nfsmount:/root/apps'
      «snip»
volumes:
  nfsmount:
    driver: local
    driver_opts:
      type: nfs
      o: addr=host.docker.internal,rw,nolock,hard,nointr,nfsvers=3
      device: ":/Users/davec/Projects/NewCo"
```

<div data-ad></div>

The bit inside `myapp-development` says that there is a volume named `nfsmount` that will be available inside the
Docker container as `/root/apps`.  Anything in `~/Projects/NewCo` on my Mac will be in `/root/apps` in the Docker
container.

The `volumes:` key contains an `nfsmount:` key that describes what the `nfsmount` volume actually is.  Here be
dragons.

First, we use the `local` driver for reasons I don't understand.  Next we give `driver_opts`, which is highly
dependent on the value for `type:`.  The entire line with `o:` is arcane. I have no idea what it's doing, why or if
it must be `o:` or anything.  I believe this are options to the NFS process running in the Docker container.

The `device:` is what's critical. It must have that leading colon and then the path you used in `/etc/exports`
(though it can be a subdir of it, too).

With that in place, you can `docker-compose up`, then `docker exec -it «container_id» bash -l` into your app's
container. If you `ls /root/apps` you'll see your Mac's disk. And it will be almost as fast as local!

This does break `webpack-dev-server`, however.

## Making `webpack-dev-server` work

By default, `webpack-dev-server` uses file system events to know when to rebuild.  An NFS-mounted volume, like the
one we just created, does not supply such events.  So we must modify our Webpack config to poll.

The options needed are documented in [Webpack's `watchOptions`](https://webpack.js.org/configuration/watch/#watchoptions).  Specifically, you must set `poll` to either `true` or a number of milliseconds.  I set it to 300.

If you are using Webpacker in Rails, you have to modify this in `config/webpacker.yml` (*more* YAML):

```yaml
default: &default

  # «snip»

development:
  <<: *default
  compile: true

  check_yarn_integrity: true

  dev_server:
    # «snip»
    host: 0.0.0.0
    port: 3035
    public: localhost:8000
    watch_options:
      ignored: '**/node_modules/**'
      poll: 300
      aggregateTimeout: 200

```

While it's not part of making NFS work, note the `host:` and `public:` values above.  `host:` must be 0.0.0.0 to
work inside Docker.  Since your browser on your computer will connect to `webpack-dev-server`, it needs a localhost
URL.  We mapped 3035 to 8000 in `docker-compose.yml`, so for `public:` we have to put `localhost:8000` since
that's how the browser will access `webpack-dev-server`.

The `watch_options` are what make this work on NFS.  With `poll:` and `aggregateTimeout` set, `webpack-dev-server` will check every 300ms for changed files, and wait 200ms to allow other changes to be found before rebuilding.  The rebuild itself is pretty fast, but I find the polling to be quite flaky.  Not sure why.  Nevertheless, it's way better than when using Docker's macOS file system support.

## Conclusion

Having a repeatable, reliable dev environment can be a boon to team productivity, and Docker is a good tool to make
that happen.  It *is* slower than local development, but using an NFS-mounted filesystem can make it much better.

Other than the newly-discovered NFS mount, I have been doing development in Docker for the past several months and
it's *really* nice to not have to worry about macOS updates breaking everything. I can run `bin/setup` and am good
to go.
