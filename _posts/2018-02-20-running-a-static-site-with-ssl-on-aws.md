---
layout: post
title: "Running a Static Site with SSL on AWS"
date: 2018-02-20 9:00
ad:
  title: "Focus on Results"
  subtitle: "11 Practices You Can Start Doing Now"
  link: "http://bit.ly/dcsweng"
  image: "/images/sweng-cover.png"
  cta: "Buy Now $25"
---

As I mentioned previously, non-SSL sites are heading toward being marked as security issues by browsers.  If you want SSL and
full control over your website, including a top-notch CDN, AWS provides the tools you need, and it's not too hairy to get going.
Considering what a nightmare anything SSL usually is, AWS makes it as painless as can be, as long as you are willing to get your
feet wet with some infrastructure, and do a bit of manual scripting.

<!-- more -->

The thing that makes this bearable is [Terraform](https://www.terraform.io), which is a way to describe your infrastructure as a
series of configuration files that Terraform then applies to your hosting provider, making it so.  This allows you to almost
entirely avoid going into the AWS console, which I find overwhelming to the point of panic.

To make all this work, you need four main pieces of infrastructure:

* An S3 bucket - this is where your website's files will live.
* A CloudFront distribution backed by that bucket - Cloudfront is a CDN that serves up your website much more quickly than S3.
* DNS Entries - to connect your domain name to your CloudFront distribution.
* An SSL Certificate - We'll create one for free via AWS

Creating the SSL Certificate *does* require poking around in the console and doing some manual things, but everything else can be
scripted once you set up Terraform.

Let's get the manual stuff out of the way first and create our SSL Certificate.

## Make sure you have DNS Access

I'm using DNSimple and if you don't have DNS set up yet, just use DNSimple.  If you already have DNS set up, just make sure you
have access to create CNAME records.

## Create an SSL Cert with AWS

You'll need an AWS account. **DO NOT** use your normal Amazon login for this.  Use a different one.

The easiest way to explain this is to point you at the [AWS Documentation for Creating a
Certificate](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html).  Just follow that.  When you are asked to
type in your domain name, enter the apex domain (e.g. `example.com`) as well as the `www` subdomain (e.g. `www.example.com`).

Once you request it, it's going to ask you if you want to verify with DNS or Email.  Assuming you have access to your domains DNS
Entries, choose DNS and follow the instructions.  This part is very confusing, because the strings AWS wants you to copy into
your DNS provider aren't correct.  The [Validate with DNS page](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html) has a better example of what you want to do.

Once this is done, you should be able to refresh the certificates page and see that your certs have been issued.  With this done,
everything else can be scripted with Terraform.  Time to set it up.

## Set Up Terraform

First, [install Terraform](https://www.terraform.io/intro/getting-started/install.html).  I'm on OS X, so I use Homebrew:

```
> brew install terraform
```

For Terraform to work, you need API keys for each service in question. We'll start with AWS, which calls them _access keys_.

Currently, you can create one in IAM -> Users -> Create Access Key (note that you should not use your
root account for this long-term, so do some googling after you've set this all up to create a non-root account for you to work).

Now, time to set up a workspace.  I put all my Terraform stuff in `~/Projects/infrastructure`, so make a place where this stuff
will live.

Now, we have to create some files so that Terraform knows our API keys.  Create the file `terraform.tfvars` like so:

```
access_key="«your access key»"
secret_key="«your secret key»"
```

Terraform also requires that you explicitly define any variables, apart from setting their values.  Declare this in
`variables.tf` by making that file look like so:

```
variable "access_key" {}
variable "secret_key" {}

variable "region" {
  default = "us-east-1"
}
```

This means that the variables `access_key` and `secret_key` can be used in your Terraform files, and that `region` can also be
used, but it's default value is `us-east-1`.

Now create a file to set up your AWS credentials.  I call mine `aws.tf`, and it looks like so:

```
provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}
```

In Terraform a _provider_ is a cloud services provider where you want to create infrastructure.  Each one requires different
values to be set up.  In the case of AWS, we need an access key, secret key, and region, and we get those from the variables we
just set up.  The Terraform syntax for that is `${var.«var name»}`.

Now, to test all this, let's create an S3 bucket.  Create a file called `s3_bucket_test.tf` like so (note that the value for
`bucket` must be unique to all of AWS, so replace `«hyourname»` with something unique like your name):

```
resource "aws_s3_bucket" "my-test-s3-bucket" {
  bucket = "«yourname»-test-s3-bucket"
  acl    = "authenticated-read"
}
```

Log into the AWS console in your browser, and navigate to your S3 buckets.  It should be empty.

Back in the terminal, check the plan:

```
> terraform plan
```

This should output what Terraform plans to do.  If there is anything wrong, you likely have misconfigured your keys, so go back
and check everything.

When you are ready, apply these changes:

```
> terraform apply
```

You may need to answer `yes` to a prompt, but after all this goes, go back to the AWS console.  You should see the S3 bucket
there!  Neat!

Next, delete the file `s3_bucket_test.tf`, then do `terraform plan` again.  It should indicate that it will remove that bucket.
Do `terraform apply`, say `yes`, and then go back to AWS.  You should no longer see your bucket.

## How to Use Terraform

Terraform is *not* an abstraction layer over cloud infrastructure.  In other words, it does not relieve you of the burden of
understanding how the infrastructure you are creating works.  The way to use Terraform is to open the documentation for Terraform
*and* the documentation for the cloud services provider's API and translate.   The names of configuration options in Terraform
almost always match the name of the concept in the provider's API, making it easy to know how to set things up.

OK, with Terraform set up, we can make our website.

## Create S3 Buckets

You need three S3 buckets.  One for your site itself, one for www to redirect, and one for logs.  We'll create these with
Terraform, but first a bit of info about how Terraform works that I found confusing.

Above, we created an S3 bucket like so:

```
resource "aws_s3_bucket" "my-test-s3-bucket" {
  bucket = "«yourname»-test-s3-bucket"
  acl    = "authenticated-read"
}
```

What's confusing is that it's not clear what values are special to Terraform and what aren't.

`resource` means that we are declaring a resource to create.  The string following it—`"aws_s3_bucket"` is the type of bucket.
This is special to Terraform and tells it what keys to recognize inside the braces.  Here's where it gets confusing. The string
*after* that—"my-test-s3-bucket"—is the id of this resource in your infrastructure.  It can be anything, but it must be unique to
all of your Terraform files *and resources*.  Meaning, you cannot have an S3 bucket with the ID "foo" as well as a CloudFront
distro named "foo". If you do this, the error you get will be very confusing and unclear.

You will be referencing this id many times, so make it descriptive and specific.  For my site's S3 bucket, I used
"naildrivin5-com-s3".

With that out of the way, let's see the configuration.  I put all of the code we're about to see inside `naildrivin5.com.tf`
(Terraform sucks in all `.tf` files when you run it).  I've added comments for what each thing does, but you can look at AWS's
documentation to understand these as well.

```
resource "aws_s3_bucket" "«your site»-com-s3" {
  # Unique name of the bucket in all of AWS
  bucket = "«your site».com"

  # You want the files to be readable by anyone, since it's a website :)
  acl    = "public-read"

  # A valid AWS region
  region = "us-east-1"

  # We'll talk about this file in a moment
  policy = "${file("«your site».com.s3.policy.json")}"

  # This tells AWS you want this S3 bucket to serve up a website
  website {

    # This tells AWS to use the file index.html if someone requests 
    # a directory like http://www.«your site».com/about/
    index_document = "index.html"
  }

  # This is the name of the S3 bucket where access logs will be
  # written.  We'll create this bucket in a moment
  logging {
    target_bucket = "${aws_s3_bucket.logs-«your site»-com-s3.id}"
    target_prefix = "root/"
  }

  # You can omit this if you like—tags can be helpful for managing
  # lots of stuff in AWS if you have to poke around the console
  tags {
    site        = "«your site»"
    environment = "production"
  }
}
```

The syntax for `target_bucket` is a demonstration of referencing another Terraform-managed resource.  It's verbose.  Let's see
how it gets defined by creating our logging S3 bucket:

```
resource "aws_s3_bucket" "logs-«your site»-com-s3" {
  bucket = "logs.«your site».com"
  region = "us-east-1"

  # Tells AWS to allow logs to be written here.
  # See https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
  acl    = "log-delivery-write"

  tags {
    site        = "«your site»"
    environment = "production"
  }
}
```

Because we gave this resource the ID `logs-«your site»-com-s3`, we can refer to it in Terraform via
`${vars.logs-«your site»-com-s3.id}`.  This says "replace me with the internal ID AWS generates for this resource".

Finally, create the S3 bucket to redirect `www`:

```
resource "aws_s3_bucket" "www-«your site»-com-s3" {
  bucket = "www.«your site».com"
  region = "us-east-1"

  website {
    redirect_all_requests_to = "${aws_s3_bucket.«your site»-com-s3.website_endpoint}"
  }

  tags {
    site        = "«your site»"
    environment = "production"
  }
}
```

The value for `redirect_all_requests_to` looks similar to what we saw earlier, but it's using `website_endpoint` and not `id`.  The documentation for [S3 buckets in Terraform](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html) indicates that `website_endpoint` is the Website  endpoint assigned by AWS for a bucket.  This is the (very long) URL to your website's S3 bucket, and is what we want `www` to redirect to.

Now, we have to make a Policy file.  This can't be done directly in Terraform for whatever reason, so you have to create a JSON
document.  We referenced it above, and it looks like so:

```
{
  "Version":"2012-10-17",
  "Statement": [{
    "Sid": "Allow Public Access to All Objects",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::«your site».com/*"
  }
 ]
}
```

I'm not 100% sure why this needs to exist at all, but it does, so add it :)

At this point, you can `terraform plan` and see everything looking good, and even `terraform apply`.  If you look at the output,
you'll see the website endpoint, and you can put your website's files into the S3 bucket, request the given URL and see your
site hosted over S3.

Next, we need to make a CloudFront distribution so that our site is served up from a CDN in a performant manner.

## Create CloudFront Distribution

Get ready for a big blob of configuration.  I'll comment each bit as to what it's for, but again, you can refer to AWS's
documentation for what all this is.

```
# This is a _data source_ which allows us to get the internal
# ID (which AWS calls an "ARN") from AWS
data "aws_acm_certificate" "«your site»-com" {
  domain   = "«your site».com"
  statuses = ["ISSUED"]
}

resource "aws_cloudfront_distribution" "«your site»-com-cf_distribution" {
  # This says where CloudFront should get the data it's caching
  origin {

    # CloudFront can front any website, so in our case, we use the website from
    # our S3 bucket.
    domain_name = "${aws_s3_bucket.«your site»-com-s3.website_endpoint}"
    origin_id   = "${aws_s3_bucket.«your site»-com-s3.bucket_domain_name}"

    # This allows requests for / to serve up /index.html which cloudfront won't do
    # There is a simpler configuration that doesn't require this, but it won't translate
    # a request for / to one for /index.html  This is what enables that to work
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["SSLv3", "TLSv1"]
    }
  }

  tags {
    site        = "«your site»"
    environment = "production"
  }

  aliases             = ["«your site».com", "www.«your site».com"]
  default_root_object = "index.html"
  enabled             = "true"

  # You can override this per object, but for our purposes, this is fine for everything
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id   = "${aws_s3_bucket.«your site»-com-s3.bucket_domain_name}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    # This says to redirect http to https
    viewer_protocol_policy = "redirect-to-https"
    compress               = "true"
    min_ttl                = 0

    # default cache time in seconds.  This is 1 day, meaning CloudFront will only
    # look at your S3 bucket for changes once per day.
    default_ttl            = 86400
    max_ttl                = 604800
  }

  # This allows us to save CloudFront logs to our existing S3 bucket for logging
  # above
  logging_config {
    include_cookies = false
    bucket          = "${aws_s3_bucket.logs-«your site»-com-s3.bucket_domain_name}"

    # Inside the bucket, the CloudFront logs will be in the cf/ directory
    prefix          = "cf/"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # This configures our SSL certificate.
  viewer_certificate {
    
    # The data source we set up above allows us to access the AWS internal ID (ARN) like so
    acm_certificate_arn      = "${data.aws_acm_certificate.«your site»-com.arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }
}
```

Whew!  We're almost done.  Last thing is to set up DNS.

## Setting up DNS

You need to set up DNS so that your apex domain redirects to www, and for www to be a CNAME for your CloudFront distribution.

If you are using DNSimple, you'll need to get an API key and place it in `terraform.tfvars`:

```
access_key="«aws access key»"
secret_key="«aws secret key»"
dnsimple_account = "«account number»"
dnsimple_v2_token = "«api token»"
```

Then add some variables to `variables.tf`:

```
variable "access_key" {}
variable "secret_key" {}

variable "region" {
  default = "us-east-1"
}

variable "dnsimple_v2_token" {}
variable "dnsimple_account" {}
```

And finally, create `dnsimple.tf`:

```
provider "dnsimple" {
  token   = "${var.dnsimple_v2_token}"
  account = "${var.dnsimple_account}"
}
```

Now, you can create your DNS records like so:

```
resource "dnsimple_record" "www-«your site»-com-dns" {
  domain = "«your site».com"
  name   = "www"
  value  = "${aws_cloudfront_distribution.«your site»-com-cf_distribution.domain_name}"
  type   = "CNAME"
  ttl    = 1
}

resource "dnsimple_record" "«your site»-com-dns" {
  domain = "«your site».com"
  name   = ""
  value  = "www.«your site».com"
  type   = "ALIAS"
  ttl    = 1
}
```

If you aren't using DNSimple, check their documentation as to how to do this, and check Terraform's documentation for how to
configure it.

Now, you can `terraform plan` to check everything, then `terraform apply` to make it so!

## Getting Files up There

OK, so there are two more things to know.  First, is how to get your files up to S3.

I use the AWS CLI to do this.  You'll need to install it and put your keys in `~/.aws/credentials` like so:

```
[personal]
aws_access_key_id = «your access key»
aws_secret_access_key = «your secret key»
```

You can use the same values you used above.

Now, you can use the AWS CLI to sync files to your S3 bucket.  Suppose you have your site's files in `site/`.

```
aws s3 sync --profile=personal site/ s3://«your site».com
```

That's all there is to it!  You should be able to go to your site now, see the files served up *and* see that you are doing so
over SSL!

One last thing, which is invalidating the cache.  Above, we set the default cache time to 24 hours. We generally want that
because our site isn't changing often and it allows CloudFront to be efficient with caching.  But, if we *do* change our site and
want to see the changes immediately, we have to invalidate the cache.

## Invalidating Pages to See Changes Immediately

The most common case is if you host a blog, your main `index.html` page will need to be updated to reflect a newly-added entry.
You can invalidate that page like so:

```
aws cloudfront create-invalidation --profile-personal --distribution-id=«Distribution ID» --paths=/index.html
```

To get your distribution ID, run `terraform plan`.  You should see it output like so:

```
aws_cloudfront_distribution.«your site»-com-cf_distribution: Refreshing state... (ID: XKi345904e54)
```

The value after `ID:` is the distribution ID.

You can use `aws cloudfront create-invalidation` to invalidate any page by changing `--paths`.

## Conclusion

OK, maybe this isn't so _simple_, but it's way easier than using the AWS Console/Web UI to do this, and it's repeatable and
suitable for version control.  When AWS changes their UI, these instructions will stay the same.

This setup is also fairly cheap (a few dollars a month unless you are a very popular blogger :) and results in a blazingly-fast website, since CloudFront is a great CDN.
