--- 
wordpress_id: 35
title: "REST Security: Signing requests with secret key, but does it work?"
wordpress_url: http://www.naildrivin5.com/daveblog5000/?p=35
layout: post
ad:
  title: "Rails is truly full-stack"
  subtitle: "Create SPAs backed by APIs with Rails"
  link: "https://pragprog.com/book/dcbang2/rails-angular-postgres-and-bootstrap-second-edition"
  image: "/images/dcbang2.jpg"
  cta: "Buy Now $24.95"
---
Both <a href="http://docs.amazonwebservices.com/AmazonS3/2006-03-01/gsg/?ref=get-started">Amazon Web Services</a> and the <a href="http://www.flickr.com/services/api/auth.howto.web.html">Flickr Services</a> provide <a href="http://en.wikipedia.org/wiki/Representational_State_Transfer">REST</a> APIs to their services.  I'm currently working on developing such a service, and noticed that both use signatures based on a shared secret to provide security (basically using a <a href="http://en.wikipedia.org/wiki/HMAC">Hash Message Authentication Code</a>).

It works as follows:

1. Applications receive a shared secret known only to them and the service provider.
1. A request is constructed (either a URL or a query string)
1. A digest/hash is created using the shared secret, based on the request (for Flickr, the parameter keys and values are assembled in a certain way, so that Flickr can easily generate the same string)
1. The digest is included in the request
1. The service provider, using the shared secret, creates a digest/hash on the request it receives
1. If the service provider's signature matches the one included in the request, the request is serviced

It's actually quite simple, and for one-time requests, is effective.  The problem, however, is that anyone intercepting the request can make it themselves, without some other state being shared with the client and service provider.  Consider a request for an image.  The unsigned request might look like:

    /api/images?image_id=45&type=jpg

The signed request, would look like so:

    /api/images?image_id=45&type=jpg&signature=34729347298473

So, anyone can then take that URL and request the resource.  They don't need to know the shared secret, or the signature algorithm.  This is a bit of a problem.  One of the advantages of REST is that URLs that request resources are static and can be cached (much as WWW resources are).  So, if I wish to protect the given URL, how can I do so?

## HTTP Authentication

The usual answer is HTTP Authentication; the service provide protects the resource, and the client must first log in.  Login can be done programmatically, and this basically accomplishes sending a second shared secret with the request that cannot be easily intercepted.  HTTP Auth has its issues, however, and might not be feasible in every context.

Another way to address this is to provide an additional piece of data that makes each request unique and usable only once.  To do so requires state to be saved on the client and the server.

## Negotiated One-time Token

Authentication can be avoided by using the shared secret to establish a token, usable for one request of the given resource.  It would work like this:

1. Client requests a token for a given resource
1. Service Provider creates a token (via some uuid algorithm ensuring no repeats) and associates it with the resource
1. Client creates a second request, as above, for the resource, including the token in the request
1. Service Provider checks not just for a valid signature, but also that the provided token is associated with the given resource
1. If so, the token is retired, and the resource data is returned

<div data-ad></div>

Here, the URL constructed in step 3 can be used only once.  Anyone intercepting the request can't make it again, without constructing a new one, which they would be unable to do without the shared secret.  Further, this doesn't preclude caching.  The main issue here is that since two requests are required, simultaneous access to one resource could result in false errors: if Client A acquires a token, and Client B requests one before Client A <b>uses</b> the token, Client A's token could be squashed, resulting in an error when he makes his request.  The service provider can alleviate this by allowing the issuance of multiple active tokens per resource.

## Timestamp

A disadvantage to the One-Time Token method is that it requires two requests of the service provider for every actual request (one to get the token and one to request the resource).  A way around that is to include a timestamp in the request.  This would work as follows:


1. Client creates request, including the current time.  This request is signed as per above procedure
1. Service provider validates the request and compares it's time with the given timestamp.
1. If the difference in the service provider's time and the client's provided time is within some tolerance, the request is serviced


This obviously requires the two clocks to be vaguely in sync.  It also allows the resource to be requested by anyone within the timespan of the tolerance.  But, it does save a second request to the client.

## Self-created One-time Token

This is an amalgam of the Timestamp solution and the Negotiated One-time Token solution.  Here, the client creates its own token, as a simple integer of increasing value.  The server maintains the last requested value and accepts only requests with a higher number:


1. Client creates request, using a global long-lived number
1. Client signs requests and sends it to the service provider
1. Service provider validates the signature and compares the provided numeric token with the one last used (the tokens can be globally scoped, or scoped for a given resource)
1. If the provided numeric token is greater than the previous, the request is serviced
1. The Client increments his numeric token for next time


As with the Timestamp solution, only one request is required.  As with the negotiated one-time token solution, the URL can never be used twice.  The main issue here is if the client forgets its numeric token.  This could be addressed with an additional call to re-establish the token, made only when the Client has determined it no longer knows the last used value.

Unfortunately, this is much more susceptible to race conditions than the Negotiated one-time token.  Since the service provider doesn't know what tokens to expect (only that they should be greater than the last requested one), the client has to ensure that the "create request, submit request, receive response, update local numeric token" cycle is atomic.  That is not straightforward.

**Update** Got another idea from a co-worker

## Session Token

When a user access the system that uses the REST API, they get issued a token (via the REST API).  This token is just like a session token, with an inactivity timeout and so forth.  The token can be manually invalidated via the API, so that when a user logs out or completes some logical task, the token can be invalidated.

This suffers none of the problems of the other solutions, though it isn't the most secure.  However, the security problem it has (using the valid URL before the session times out) is fairly minor, and the tradeoff of getting one request per actual request and no race conditions makes it probably the best way to go.
