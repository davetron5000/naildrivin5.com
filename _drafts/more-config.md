---
title: "Mo Config Mo Problems"
date: 2019-08-19 8:00
ad:
  title: "Make the Right Decisions"
  subtitle: "11 Practices to Help You Evaluate Technology"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
related:
  - "Configuration Design is User Experience Design…and it's hard"
  - "Explicit Code is Inclusive"
---

When Stitch Fix converted over to [Circle CI 2.0][circle2], we had to author *a lot* more YAML configurations.
I've also been using [Terraform][terraform] to manage my personal infrastructure.  Both of these configuration
formats do a good job of erring toward the side of [explicit, and thus more inclusive][inclusive-post], but they
both fall victim to usability and learnability problems due to designing their configurations for parseability and
not human learnability.

I want to talk about why, which will give some insight in how to do a better job designing configuration formats.

<!-- more -->

In [Configuration is User Experience][config-post], I talk in detail about the unique problem in designing a
configuration system.  The main thesis (that I assert applies to Terraform and Circle CI) is that the developers
whose job is to edit these files don't spend much of their time doing so.  Because of this, the economies you get
my having a steep learning curve resulting in a highly usable system (e.g. vim) don't ever apply.

Let's talk about why.

Circle CI uses a YAML-based format, whereas Terraform uses their own custom language, called
[HCL](https://github.com/hashicorp/hcl2/blob/master/hcl/hclsyntax/spec.md).  These core languages aren't what I'm
going to talk about (yes, YAML *is* highly problematic just on its own, but this is about how Circle has chosen to use it).

Let's see some examples.  Here is how you configure a job to run in CircleCI:

```yaml
jobs:
  build:
    docker:
      - image: circleci/ruby:2.6
    steps:
      - checkout
      - run:
          name: "Bundle Install"
          command: "bundle check --path=vendor/bundle || bundle install --path=vendor/bundle"
```

The crux of the problem is the key `build`.  This key, and *only* this key in the snippet above, is chosen by the
user.  All the other keys (`jobs`, `docker`, `steps`, `run`, `checkout`, `deploy`, `name`, `command`) are special
keywords recognized by the configuration format.

The reason this is a problem is that it means that, when viewing any circle configuration, you cannot know if the
key of a hash is a keyword provided by Circle or a user-provided symbol you can reference.  This becomes more
problematic when you add _Orbs_, which is their system of re-use.  Here's an example:

```yaml
version: 2.1
orbs:
  aws-cli: circleci/aws-cli@0.1.13
jobs:
  build:
    steps:
      - aws-cli/install
      - checkout
      - run: "bundle install"
```

Here, the string `aws-cli/install` is a combination of user-selected values and Circle-provided values. The `aws-cli` in `aws-cli/install` must match the key `aws-cli:` underneath Orb, and this value can be anything, however `install` is provided by the Orb and must match exactly what the Orb has specified.

Hopefully you can start to see the problem.  It becomes difficult to understand what the keys in the hashes actually represent.  In order to understand any given Circle configuration, you must have a reasonable command of `all` keys Circle provides (so you can distinguish user-provided from Circle-provided) as well as a good understanding of how Orbs work so you can mentally parse the meaning of a key like `aws-cli/install` (which, in this case, is “Find an Orb referenced as `aws-cli`, then go into its documentation and find the `install` command)

A better design decision around this would be to standardize the configuration such that *all keys are provided by
Circle*.  Thus, anywhere in any configuration file, if you see a key, you know that you can reference it in the
documentation.  It also means that, when parsing this file, Circle can easily find mistakes.

For Orbs, requiring the user to specify a name doesn't seem to have a lot of value. The orb should have a unique
name and that's what we should use.  I also want to call out that the Orb names themselves are a *different* form
of configuration (we see this in Webpack with stuff like `filename: '[chunkhash]-bundle.js'`), because the value
given to the arbitrarily-chosen key (in this case `aws-cli`) is a GitHub org name, a repo name, and a version
specifying, al in one string.

So, how should this look?  It should look like so:

```yaml
orbs:
  - name: "aws-cli"
    github_org: "circleci"
    version: "0.1.13"
jobs:
  - name: "build"
    docker:
      - image: circleci/ruby:2.6
    steps:
      - checkout
      - run:
          from_orb: "aws-cli"
          orb_command: install
      - run:
          name: "Bundle Install"
          command: "bundle check --path=vendor/bundle || bundle install --path=vendor/bundle"
```

It's very similar, but we've now changed it so that all keys are owned by Circle.  We've also made it so that
every configuration is option is named explicitly (I'm ignoring the Docker images since that's beyond Circle's control).

Inside `run`, we also make it painfully obvious that the command after checkout is provided from an orb.  If we'd
used `command` instead of `orb_command`, that would be confusing, since `command` is for running a command-line
invocation, which the Orb-provided `install` is definitely not.

This makes the config slightly more verbose, but this is 100% a good thing. Whoever created this is not likely to
need to edit it for days, weeks, or even months!  And when they come back and have to re-learn how this works and
what Orbs are, it's going to be much easier for them.

Now, let's look at Terraform, which falls victim to the same problem.

Here is how to configure an S3 bucket using Terraform:

```
resource "aws_s3_bucket" "my-bucket" {
  bucket = "davetrons-bucket"
  acl    = "authenticated-read"

  tags = {
    Name        = "My bucket"
    Environment = "Prod"
  }
}
```

What's confusing here is that not all unquoted symbols are provided by Terraform, some quoted strings *are*
special to Terraform, some quoted strings are user provided, and some are restricted by the infrastructure
provider (AWS in this case).

The value `"aws_s3_bucket"` is special to terraform - you cannot use just any string after the `resource` keyword.
The value `"my-bucket"` is a global identifier inside your terraform configuration and can be anything.  You can
reference it in other Terraform config via `"${aws_s3_bucket.my-bucket.id}"`.  The value for `bucket` can be
anything (more or less - it's subject to uniqueness on the AWS side), whereas the value for `acl` can only be one
of a certain number of known values (again, at the whims of AWS).  Lastly, both the keys *and* values inside
`tags` are user-specified.

This creates quite a bit of confusion when learning Terraform, and I think the solution here is a simple one.  The
format should make it clear which values are special to Terraform, which ones are subject to the provider's rules
and which ones are provided by the user and entirely internal to the Terraform configuration.

Here is a way to do that:

```
resource aws_s3_bucket $my-bucket {
  bucket = "davetrons-bucket"
  acl    = "authenticated-read"

  tags = {
    "Name"        = "My bucket"
    "Environment" = "Prod"
  }
}
```

It's a small change, but we remove the quotes from `aws_s3_bucket` to indicate it's special to Terraform. We also
remove the quotes from `my-bucket` and prepend with a `$` to indicate it's a value we provide that's internal and
exists for us to reference later (since referencing happens with a `$`, this seems reasonable to me).

Lastly, we require quotes around the tags, since they are user-provided.  This means that, when reading any
Terraform config:

* unquoted symbols are special to Terraform, thus you can confidently expect to find them in the documentation
* symbols prepended by a `$` are provided by you and internal to your configuration
* all quoted strings are arbitrary values sent to the provider and subject to the provider's rules

I realize this might not be possible based on the syntax of HCL but given that Hashicorp owns both, they could
make it all work however they like.  But you can see the issue in the HCL documentation which says that this:

```
variable "ami" {
    description = "the AMI to use"
}
```

is equivalent to this JSON:

```json
{
  "variable": {
    "ami": {
      "description": "the AMI to use"
    }
  }
}
```

So, just like in the Circle config, we have keys that are sometimes special and sometimes not.  Were it me, I'd
have it work like so:

```json
{
  "variable": [
    { 
      "name": "ami",
      "description": "the AMI to use"
    }
  ]
}
```

Not sure what this turns into in HCL, but you see the same idea here - keys are always and only special to the
system.

[circle2]: https://circleci.com/blog/say-hello-to-circleci-2-0/
