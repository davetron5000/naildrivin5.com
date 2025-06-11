---
layout: post
title: "Neovim and LSP Servers Working with Docker-based Development"
date: 2025-06-12 9:00
ad:
  title: "Fix Your Dev Environment for Good"
  subtitle: "Stop Re-installing and Start Coding"
  link: "https://sowl.co/bhKWwy"
  image: "/images/docker-book-cover.jpg"
  cta: "Buy Now $19.95"
---

Working on an update to [my Docker-based Dev Environment Book](https://devbox.computer), I realized it would be important to show how to get an LSP server worker inside Docker.  And I have! And it's not that easy, but wasn't that hard, either.  It hits a lot of my limits of Neovim knowledge, but hopefully fellow Vim users will find this helpful.

<!-- more -->

## The Problem

Microsoft created the Language Server Protocol (LSP), and so it's baked into VSCode pretty well.  If you require a more sophisticated and powerful editing experience, however, you are using Vim and it turns out, Neovim (a Vim fork) can interact with an LSP via the lsp-config plugin.

Getting this all to work requires solving several problems:

1. Why do this at all?
2. How Can Neovim talk to an LSP server?
3. Which LSP Servers do I need and how do I set them up?
4. But how  do I do that inside a Docker development container?
5. What can I do with this power?

## What Does an LSP Server Do?

I had never previously pursued setting up an LSP server because I never felt the need for it.  To be honest, I couldn't even tell you what it did or what it was for.  I've used vi (and Vim and Neovim) for my entire career never using an IDE beyond poking at a few and deciding they were not for me.


The cornerstone of an LSP server is that it can understand your code at a semantic level, and not just as a series of strings. It can know precisely where a class named `HTMLGenerator` is defined and, whenever you cursor onto that class name, jump to that location, even if it doesn't conform to Ruby's conventions.

Traditional Vim plugins don't do this. They'd mangle `HTMLGenerator` to come up with `html_generator.rb` or `h_t_m_l_generator.rb` and then find that filename, hoping that's where the class was defined.

With this core feature, an LSP server can allow features not possible in Neovim (or at least not possible beyond string manipulation):

* Completion based on language and project.  When you enter a variable name and `.`, it will show a list
of possible methods to call.  This works in non-dot-calls-a-method languages, too.
* Jump to the definition of a symbol, regardless of the filename where it's defined.
* List all symbols in the current file to e.g. quickly jump to a method or variable.
* Pop up a window inside Neovim to show the documentation for a symbol, based on the documentation in the
source file you are using (i.e. and not fetching it from a website).
* See where the given symbol is being referenced.
* Perform a project-wide rename of a symbol.
* Show the method signature of a method you are calling
* Show the type hierarchy of the class you are in.
* Syntax highlighting based on language constructs and not regular expressions. For example, an LSP-based
syntax highlight could show local variables and method calls differently, even though in Ruby they look the same.
* "Inlay hints" which add context to the code where something implicit is going on.  The simplest example
for Ruby is the somewhat new Hash syntax:

  ```ruby
  foo = "bar"
  blah = 42

  doit({ foo:, blah: })
  ```

  Since the keys are the same as local symbols, this is the same as `{ foo: foo, blah: blah }`.  With inlay hints, the editor would show that:

  ```ruby
  foo = "bar"
  blah = 42

  doit({ foo: foo, blah: blah})
  ```

  This added information is not editable, and if your cursor is on the space after `foo:`, moving to the right skips over the "inlayed" `foo`, right to the next comma.
* Realtime compiler errors and warnings.  This shows a marker in the column of a line with an error,
  along with potentially red squiggles, and an ability to open a pop-up window showing the error message.

There is more that can be done per language and tons of extensions.  I have had a successful programming career of many years without these features, but they do seem useful.  They've just never seemed worth it to give up Vim and use an IDE, which usually provides a terrible text editing experience.

## Getting an LSP Server To Work with Neovim

Getting an LSP server to work requires figuring out how install the server, then configuring Neovim to use it via the [lsp-config plugin](https://github.com/neovim/nvim-lspconfig).  This creates the meta-problem of how to set up that plugin, because Neovim has a lot of plugin management systems.

I use a system that allows me to clone plugins from a Git repo inside `~/.vim` (for Vim) and `~/.local/share/nvim/site` (for Neovim) and restart Vim and stuff works. It's been so long I don't know what this is called.

After you've installed `lsp-config` however you install Neovim plugins, the next issue is that most of the configuration is documented in Lua. Because I am old, all my configuration is in VimScript.  Getting some Lua configuration is a single line of code, inside `~/.config/nvim/init.vim`:

```
lua require('config')
```

This assumes that `~/.config/nvim/lua/config.lua` exists, and then runs that configuration as normal.  With that in place, here's an outline of the configuration needed to use Shopify's Ruby LSP server and Microsoft's CSS and Typescript LSP servers.  These aren't complete, yet, but this gives you an idea:

```lua
local lspconfig = require('lspconfig')

-- Set up Shopify's LSP server. The string
-- "ruby_lsp" is magic and you must consult lsp-config's
-- documentation to figure out what string to use for
-- what LSP server.
lspconfig.ruby_lsp.setup({
  -- To be filled in
})

-- Set up Microsoft's CSS LSP server (again, "cssls" is magic)
lspconfig.cssls.setup({
  -- To be filled in
})

-- Set up Microsoft's TypeScript/JavaScript
-- server, "ts_ls" being magic.
lspconfig.ts_ls.setup({
  -- To be filled in
})
```

With this configuration, Neovim will attempt to use these LSP servers for Ruby, CSS, TypeScript, and JavaScript files.  Without those servers installed, you will get an error each time you load a file.

## Installing and Configuring LSP Servers

In  most cases, installing LSP servers can be done by installing a package with e.g. RubyGems or NPM.

* Ruby: `gem install ruby-lsp` (or put in `Gemfile`)
* CSS: `npm install --save-dev vscode-langservers-extracted`
* TypeScript/JavaScript: `npm install --save-dev typescript typescript-language-server` (Note: you may have `typescript` installed already if you are using it elsewhere in your project)

The lsp-config plugin assumes that the servers can be run as bare commands, e.g. `ruby-lsp` or `typescript-language-server`. In most cases, these don't work this way (e.g. you must use `npx` or `bundle exec`). When running them in Docker, they *definitely* won't work from the perspective of Neovim running outside Docker.

When the LSP Server and Neovim are running on the same machine, you can get it working easily by tweaking the `cmd` configuration option:

```lua
lspconfig.ts_ls.setup({
  cmd = { 'npx', 'typescript-language-server', '--stdio' },
})
```

If we want the servers to be run inside a Docker development container, we'll need to do a bit more tweaking of the configuration.

## Configuring LSP Servers to Run Inside Docker

Since the LSP servers will be installed inside the Docker container, but will need to be executed from your computer (AKA the host), you'll need to tell Neovim to basically use `docker compose exec` before running the LSP server's command.

<figure>
  <a href="/images/lsp-docker-exec.png">
    <img src="/images/lsp-docker-exec.png"
         srcset="/images/lsp-docker-exec.png 629w,
                 /images/lsp-docker-exec-320.png 320w,
                 /images/lsp-docker-exec-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="Diagram showing your computer and a docker container. Inside your computer is Neovim. There's an arrow from it labeled 'docker compose exec' that is connected to a box inside the docker container. The box is labeled 'ruby-lsp # e.g.' in a code font.">
  </a>
  <figcaption class="">
    <a target="_new" href="/images/lsp-docker-exec.png">Open bigger version in new window</a>
  </figcaption>
</figure>

The way I set up my projects, I have a script called `dx/exec` that does just this.  `dx/exec bash` will run Bash, `dx/exec bin/setup` will run the setup script, etc.

The command you ultimately want to run isn't just the LSP server command. You need to run Bash and have Bash run that command.  This is so your LSP server can access whatever environment set up you have.

To do this, you want Neovim to run `docker compose exec bash -lc «LSP Server command»`.  `-l` tells Bash to run it as a login shell. You need this to simulate logging in and running the LSP server, which is what is expected outside Docker.  `-c` specified the command for bash to run.

Given that I have `dx/exec` to wrap `docker compose exec`, here is what my configuration looks like:

```lua
local lspconfig = require('lspconfig')

lspconfig.ruby_lsp.setup({
  cmd = { 'dx/exec', 'bash', '-lc', 'ruby-lsp', },
  -- More to come
})

lspconfig.cssls.setup({
  cmd = { 'dx/exec',
          'bash',
          '-lc',
          'npx vscode-css-language-server --stdio' },
  -- More to come
})

lspconfig.ts_ls.setup({
  cmd = { 'dx/exec',
          'bash',
          '-lc',
          'npx typescript-language-server --stdio' },
})
```

Note that this is somewhat meta.  `cmd` expects a list of command line tokens.  Normally, `npx typescript-language-server --stdio` would be considered three tokens.  In this case, it's a single token being passed to bash, so you do not break it up like you would if running everything locally.

Once they are running, you'll need to make further tweaks to get them to talk to Neovim in a way that will work.

## Making LSP Servers Inside Docker Work with Neovim

<div data-ad></div>

The "protocol" in LSP is based around paths to files and locations in those files. This means that both Neovim and the LSP server must view the same files as having the same path.  When they both run on the same  computer, this is how it is.

In a Docker-based dev environment, the container is typically configured to mount your computer's files
inside the container, so that changes on your computer are seen inside the Docker container and
vice-versa.  If the filenames and paths aren't identical, the LSP servers won't work.

Consider a setup where `/home/davec/Projects/my-awesome-app` is the path to the code is on my computer, but I've mounted it inside my development container at `/home/appuser/app`:

<figure>
  <a href="/images/lsp-docker-mounts.png">
    <img src="/images/lsp-docker-mounts.png"
         srcset="/images/lsp-docker-mounts.png 629w,
                 /images/lsp-docker-mounts-320.png 320w,
                 /images/lsp-docker-mounts-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="A diagram showing your computer and a Docker container. Inside your computer is a folder labeled /home/davec/Projects/my-awesome-app. It has a bi-directional line to a folder inside the Docker container labeled /home/appuser/app.">
  </a>
  <figcaption class="">
    <a target="_new" href="/images/lsp-docker-mounts.png">Open bigger version in new window</a>
  </figcaption>
</figure>

When the LSP Server tells NeoVim that a symbol is defined in `/home/appuser/app/foo.br`, Neovim won't find it, because that file is really in `/home/davec/Projects/my-awesome-app/foo.rb`.


### Ensuring the LSP Server and NeoVim Use the Same Paths

What you want is for them to be mounted in the same location.

<figure>
  <a href="/images/lsp-docker-mounts-same.png">
    <img src="/images/lsp-docker-mounts-same.png"
         srcset="/images/lsp-docker-mounts-same.png 629w,
                 /images/lsp-docker-mounts-same-320.png 320w,
                 /images/lsp-docker-mounts-same-500.png 500w"
         sizes="(max-width: 320px) 320px,
                (max-width: 500px) 500px,
                629px"
         alt="A diagram showing your computer and a Docker container. Inside your computer is a folder labeled /home/davec/Projects/my-awesome-app. It has a bi-directional line to a folder inside the Docker container also labeled /home/davec/Projects/my-awesome-app.">
  </a>
  <figcaption class="">
    <a target="_new" href="/images/lsp-docker-mounts-same.png">Open bigger version in new window</a>
  </figcaption>
</figure>

In my case, I use Docker Compose to configure the volume mapping, so here's what it should look like:


```yaml
services:
  app:
    image: «image name»
    init: true
    volumes:
      - type: bind
        source: "/home/davec/Projects/my-awesome-project"
        target: "/home/davec/Projects/my-awesome-project"
        consistency: "consistent"
    working_dir: "/home/davec/Projects/my-awesome-project"
```

Note that because `docker-compose.yml` can interpret environment variables, you can replace the hard-coded paths with `${PWD}` so it can work for everyone on your team (assuming you run `docker compose up` from `/home/davec/Projects/my-awesome-project`).

```yaml
services:
  app:
    image: «image name»
    init: true
    volumes:
      - type: bind
        source: ${PWD}
        target: ${PWD}
        consistency: "consistent"
    working_dir: ${PWD}
```

This works great…for files in your project.  For files outside your project, it depends.

### Files Outside Your Project Must Have the Same Paths, Too

For JavaScript or TypeScript third party modules, those are presumably stored in `node_modules`, so the paths will be the same for the LSP server inside the Docker container and to Neovim.  Ruby gems, however, will not be, at least by default.

The reason this is important is that you may want to jump to the definition of a class that exists in a gem, or view its method signature or see its documentation.  To do this, because the LSP server uses file paths, the paths to e.g. `HTTParty`'s definition must be the same inside the Docker container as they are to Neovim running on your computer.

The solution is to set `GEM_HOME` so that Ruby will install gems inside your project root, just as NPM does for JavaScript modules.

This configuration must be done in **both** `~/.profile` and `~/.bashrc` inside the Docker container, since there is not a normal invocation of Bash that would source both files. I have this as `bash_customizations` which is sourced in both files. `bash_customizations` looks like so:

```
export GEM_HOME=/home/davec/Projects/my-awesome-app/local-gems/gem-home
export PATH=${PATH}:${GEM_HOME}/bin
```

You'll want to ignore `local-gems` in your version control system, the same as you would `node_modules`.

*Now*, re-install your gems and jumping to definitions will work great.

This leads to an obvious question: how **do you** jump to a definition?!

## Configuring Neovim to use LSP Commands

lsp-config does set up a few shortcuts, which you can read [in their docs](https://neovim.io/doc/user/lsp.html#_defaults). This isn't sufficient to take advantage of all the features.  You also can't access all the features simply by creating keymappings. Some features must be explicitly enabled or started up.

Of course, you don't want to set any of this up if you aren't using an LSP server. This can be addressed by putting all setup code in a Lua function that is called when the LSP "attaches".  This function will be called `on_attach` and we'll see it in a minute (note that I'm adding some configuration for Ruby LSP to make inlay hints work, as I couldn't find a better place to do that in this blog post :).

```lua
  local lspconfig = require('lspconfig')

  lspconfig.ruby_lsp.setup({
    cmd = { 'dx/exec', 'bash', '-lc', 'ruby-lsp', },
→   on_attach = on_attach,
→   init_options = {
→     featuresConfiguration = {
→       inlayHint = {
→         enableAll = true
→       }
→     },
    }
  })

  lspconfig.cssls.setup({
    cmd = { 'dx/exec', 'bash', '-lc', 'npx vscode-css-language-server --stdio' },
→   on_attach = on_attach,
    -- More to come
  })

  lspconfig.ts_ls.setup({
    cmd = { 'dx/exec', 'bash', '-lc', 'npx typescript-language-server --stdio' },
→   on_attach = on_attach,
    -- More to come

  })
```

`on_attach` will do two things: 1) set up keybindings to call the Lua functions exposed by lsp-config (which will then make the right calls to the right server), and 2) enable various LSP features that are off by default.

Here's how I have mine set up (you may want different keybindings). I've commented what each does:

```lua
local on_attach = function(client, bufnr)
  local opts = { buffer = bufnr, noremap = true, silent = true }

  -- When on a symbol, go to the file that defines it
  vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)

  -- When on a symbol, open up a split showing files referencing 
  -- this symbol. You can hit enter on any file and that file
  -- and location of the reference open.
  vim.keymap.set('n', 'gr', vim.lsp.buf.references, opts)

  -- Open up a split and show all symbols defined in the current
  -- file. Hitting enter on any symbol jumps to that location
  -- in the file
  vim.keymap.set('n', 'gs', vim.lsp.buf.document_symbol, opts)

  -- Open a popup window showing any help available for the 
  -- method signature you are on
  vim.keymap.set('n', 'gK', vim.lsp.buf.signature_help, opts)

  -- If there are errors or warnings, go to the next one
  vim.keymap.set('n', 'dn', function() vim.diagnostic.jump({ count = 1, float = true }) end)

  -- If there are errors or warnings, go to the previous one
  vim.keymap.set('n', 'dp', function() vim.diagnostic.jump({ count = -1, float = true }) end)

  -- If you are on a line with an error or warning, open a 
  -- popup showing the error/warning message
  vim.keymap.set('n', 'do', vim.diagnostic.open_float)

  -- Open the "hover" window on a symbol, which tends to show
  -- documentation on that symbol inline
  vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)

  -- While in insert mode, Ctrl-Space will invoke Ctrl-X Ctrl-o 
  -- which initiates completion to show a list of symbols that
  -- make sense for autocomplete
  vim.api.nvim_set_keymap('i', '<C-Space>', '<C-x><C-o>', { noremap = true, silent = true })

  -- Enable "inlay hints"
  vim.lsp.inlay_hint.enable()

  -- Enable completion
  vim.lsp.completion.enable(true, client.id, bufnr, {
    autotrigger = true, -- automatically pop up when e.g.  you type '.' after a variable
    convert = function(item)
      return { abbr = item.label:gsub('%b()', '') } -- NGL, no clue what this is for but it's needed
    end,
  })

  -- If the LSP server supports semantic tokens to be used for highlighting
  -- enable that.
  if client and client.server_capabilities.semanticTokensProvider then
    vim.lsp.semantic_tokens.start(args.buf,args.data.client_id)
  end
end

-- The documentation said to set this for completion
-- to work properly and/or well. I'm not sure what happens
-- if you omit this
vim.cmd[[set completeopt+=menuone,noselect,popup]]
```

Whew!  The lsp-config documentation can help you know what other functions might exist, but the setup above seems to use most of them, at least the ones for Ruby that I think are useful.

Once this is all set up, you will find that the CSS and JavaScript LSP Servers still don't work.

## Getting Microsoft's LSP Servers to Work Because They Crash By Default

Once I had Ruby working, I installed CSS and TypeScript and found that they would happily complete any single request and then crash.  Apparently, they assume the editor and server are running on the same computer and use a process identifier to know if everything is running normally.

Since this would not work with Docker (the process IDs would be different or not available), you need to configure both LSP servers in lsp-config to essentially not care about process IDs.

```lua
   lspconfig.cssls.setup({
     cmd = { 'dx/exec',
             'bash',
             '-lc',
             'npx vscode-css-language-server --stdio' },
     on_attach = on_attach,
→    before_init = function(params)
→      params.processId = vim.NIL
→    end,
   })
   lspconfig.ts_ls.setup({
     cmd = { 'dx/exec',
             'bash',
             '-lc',
             'npx typescript-language-server --stdio' },
     on_attach = on_attach,
→    before_init = function(params)
→      params.processId = vim.NIL
→    end,
   })
```

This is all great, but you may not want Neovim trying to connect to LSPs when you have not set them up.

## Don't Configure LSP if It's Not Available

When I open up a random Ruby script on my computer, I get errors about LSP servers not being available.  What I decided to do was configure LSP as opt-in in my Neovim configuration.

If the Lua setup script finds the file `.nvim.lua` in the project root, it will source it.  If that file sets `useLSP` to true, all of the above configuration happens. If `useLSP` is absent, no LSP configuration is done:

```lua
local project_config = vim.fn.getcwd() .. "/.nvim.lua"
if vim.fn.filereadable(project_config) == 1 then
  dofile(project_config)
end

if useLSP == nil then
  useLSP = false
end

if useLSP then
  -- configuration from above
end
```

## And Now We Can Work!

I've been using this configuration for a few days and to be honest, I can't quite tell how well it's working.  But it doesn't seem that fragile, and it seems useful to have setup in case other extensions or LSP servers become very useful.
