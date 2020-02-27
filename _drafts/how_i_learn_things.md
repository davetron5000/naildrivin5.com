In my copious free time, I've been trying to learn some new things that I believe will be generally useful.  One
of them has been serverless architecture and AWS Lambda in particular.  I had read Avdi Grimm's twitter rants
about it and was not looking forward to it, however I didn't have a ton of trouble getting it going, even though
it took my quite a long time.

I thought it would be interesting to outline how I learn things like this, in case it's useful to anyone else
trying to learn something potentially complex.

The first thing I do is try to have some sort of useful end goal in mind, but to keep it as simple as possible.
Ideally something I know how to build in another way.  The point is to avoid struggling with both product
decisions and the new thing I'm learning.

In my case, I wanted to make a Graphviz-as-a-service, which would largely amount to "post some source code to a
server, run it through graphviz, save the results and serve that up".

The second thing I do is commit myself to learning the topic in the way it is presented and intended.  In other
words, whatever AWS says I should do, I do it that way.  I try very hard not to start off by making the "thing"
work in some unintended or undocumented way.  The phrase "learn the rules before you break the rules" is apt.

After that, I break the problem down into very, very small steps, each of which are scriptable and verifiable.  I
want my knowledge to be captured in code as much as I can, and document my decisions if I can't put them in code.

Now this all might sound reasonable, but you might not make steps as small as mine, and I think that's key.
Taking seriously baby steps.

So let's see how this worked for my graphviz service.  I read enough documentation to figure out how to make all
this work, and my architecture was going to look something like so:

1. A React app posts a JSON blob containing the Graphviz source to some URL
1. That URL would be an API Gateway URL, because API Gateway can map a URL to a Lambda Function
1. That Lambda function would do two things.  First, it would assign an ID to the diagram, saving it to S3 with a "in progress" status.  Second, it would return that ID back to the front-end so the front-end could poll.
1. The front-end will then start polling the url provided by the lambda.
1. *This* URL is a cloudfront URL directly to the JSON.  The front end will keep requesting it until the status is either "errored" or "completed".
1. A second lambda function will be triggered by an objects being created in S3, namely the object the first lambda function created.
1. This lambda would run graphviz and save the results back to S3, updating the blob created in step 3.
1. When this happens, the front-end sees the results and renders them.

Remember, this is not a quest to build the best Graphviz service, but a framing device so I can learn some stuff
about serverless develompent in AWS.  Also of note is that I *want* to learn the AWS part. I don't want to have it
abstracted by the Serverless framework.

So, creating this architecture required a lot of reading up front, but every part of it is a very common use case
for these tedchnologies and based on the documentation and tutorials in AWS.  In other words, I designed the
architecture around what AWS documented explicitly could be done.

With this going, it was time to get to work.

I had to learn about more front-end that I'd hoped, but I started there.  I used create-react-app to get things
going.

## Front End

The front-end has a few parts to it I knew I would need:

* The React App Itself
* Tests of that App
* Integration with the back-end (POSTing the Graphviz source and polling for results)
* Deploying this app to CloudFront for actual deployment

The trick to breaking this up is to do just enough work to get you to a "hard part".  Here are the steps I went
through.

### Set Up Production

1. Register a domain name
1. Create an SSL certificate using AWS' ACM.  I have done this many times and it's hard to automate, so I just did it by hand.
1. Set up Terraform with Remote State on S3.  Terraform is critical, because I'm not gonna want to click in
   console that much, and I want repeatable builds. I consider "being able to use Terraform with XXX" a required
   part of learning XXX.  Remote state is critical if I lose my computer..
1. Create an S3 bucket and a Cloudfront distribution behind my domain name with Terraform.  Verify by going into
   console and seeing that it's set up properly.
1. Create a "hello world" `index.html` file in my new S3 bucket and verify that the `https` url to my website
   returns that HTML through cloudfront. I inspected the headers to make sure it wans't going to S3 directly.

Now I have a place to deploy.

### Bootstrap the Front-End

1. Use create-react-app to make my front-end app.
1. Run it locally to make sure it works
1. Replace all the code, HTML, and CSS with a very basic React Component
1. Add a `package.json` script to deploy the production build to my cloud front distro and create an invalidation for index.html.  This allows me to set the caching age for `index.html` to be very long, but invalidate it whenever I make a new version.  Because the CSS and JS are deployed with a unique name each time, there's no need to invalidate the caches for those—they can be cached forever.
1. Change the CSS, JS, and HTML and redeploy, verifying that my changes are available almost instantly.  This
   verifies my invalidation is working and that teh hashed names are working as desired.

At this point, I can now deploy code changes to my URL easily.  Note that I am *not* setting up continuous
integration to do this because it's only me, I only ever work from one computer, and introducing CI would slow
down the feedback cycle, which I need to be very fast right now.

And wow, this is a lot of steps for doing almost nothing.  But this is what I mean!  Each of these steps is so
small, if anything goes wrong, it's very obvious where the problem is.

While I'm no React expert, I'm relatively confident I can write a React app, but I am not confident in how to make
it talk to a back-end, so I tackled that next.

(Well, not exactly.  I did build out the React app's UI as much as I could, making it as polished as I could.  I
 did this because I wanted to make sure that the user experience was locked down and mostly done so I didn't have
 to revisit it and could be sure it wouldn't break some other assumption.  I did this and deployed it.  I also had
 to learn a bunch of stupid shit about testing React that I will not bother boring you with)

### Talking to the back-end

I decided to use React Hooks and also decided to use SWR, which is a hook based tool from Zeit that can talk to a
back-end in what seems like a straightforward manner.  I was interested in learning how to do this, so I chose
that for this reason.

1. Create a test server I can run locally.  All it does is serve up documents from some root, so just a few lines of Node.  I wrote code for this so if I had to do anything fancy, I'd have a shell in place (vs using an off-the-shelf web server).
1. Implement a single poll. Basically if the URL contains a diagram ID, the front-end will poll the backend for a well-known URL with that ID in it. I used SWR to make a single GET request and to alter the UI with the results, either an error message or the diagram's metadata.  I could verify this by pointing it at my test server.
1. Deploy this and create fake files on S3 to verify this worked in production.  This sussed out some CORS
   problems that I solved right then.  At this point, I don't have to mess with CORS again.
1. Make the GET requests poll.  The SWR docs aren't great, so this took some trial and error.
1. Deploy *that*.
1. Implement POST.  I did not implement POST in my test-server, which I probably should've done, but I was mostly confident that if I had gotte GET working, POST wouldn't be a big deal.
1. Deploy *that*.  At this point, I should be able to see that a POST of code to my backend fails and the UI properly shows a useful error message. It's important that all of the failures of all of these pieceds of architecture result in very clear error messages so I can diagnose problems and also make a nice user experience.

I should also note that the front-end has a *ton* of `console.log` in it.  Basically every path through the code
will generate log messages so I can know exactly what's happening.  This was super useful later one when I got
responses that weren't exactly the way I'd expected them to be.

At this point, it's time to make a real back-end.

## Back-End

As mentioned, the back-end was API Gateway connected to a Lambda.  API Gateway is like the manifestation of the
Rails routes file.  You configure a resource, then indicate which methods are supported and what they actually do.
API Gateway triggering a lambda is a documented use case and there is a tutorial on it.

1. Manually follow the tutorial in AWS' docs.  I could verify this by using `curl` against the API Gateway's URL.
1. Manually change the lambda's code in the console and observe how it gets updated/deployed.  Verify again with `curl`.
1. Recreate the entire thing using Terraform.  Verify this both by comparing it to the manually-made one in console as well as with `curl`.
1. Delete the manually-made one.

This was slightly complicated because Terraform has a bit of chicken-and-egg thing going on, and the console kinda
handles ordering for you.  But the error messages from AWS were *mostly* helpful in figuring it out.

Also, without logging, it was hard to diagnose errors here, but the abilitiy to test the API in the console was
helpful, because that *did* show logging.

At this point I have a few things to accomplish:

* Get my lambda code deployed instead of the tutorial's code
* Configure logging and APM so I can observe how the lambda is working.  There's not a default way to look at the
log output of API Gateway or Lambda if you don't set it up.
* Have my code return a real response to the front-end.

I decided to tackle logging first.

### Logging

Logging in AWS is done via Cloud Watch, and APM is done via X-Ray.  To make these work requires setting up a bunch
of IAM roles, but fortunately, all of this documented explicitly in the AWS docs.  All I had to do was make it
work in Terraform.

1. Modify my API Gateway configuration to use CloudWatch. This is so common that between AWS's docs and Terraform's examples, it was easy to set up.  I verified this by `curl`ing my endpoints and looking in Cloudwatch to see what showed up.
1. Do the same for the lambda.  Again, this was such a common case that examples in AWS and Terraform showed me almost exactly what to do.
1. Verify that `curl` to my API endpoint causes logging for both API Gateway *and* Lambda.  I also verified the mechanism by which I could connect the requests, i.e. the request ID that's in both log messages.  I learned that if you don't quote a uuid in the cloudwatch search, it basically doesn't work.  Cool.
1. Configure X-Ray for the lambda function.  This was almost exactly in the Terraform docs and worked the first time.  I verified this by `curl`ing the endpoint a lot and then going into X-Ray and seeing results.

Now that I can see what's going on with my code in production, it was time get my code actually deployed.

### Deploying My Lambda

Deploying a lambda involves making a `.zip` file of the code, copying it to AWS, and then explicitly triggering a
deploy.  Because Terraform is more about making infrastructure, it doesnt' exactly map to this model.  But
Hashicorp is aware of that and there is a happy path to making this work.

1. Create a new directory for my lambda code
1. Create some basic Node scripts to package up the `.zip` file.  I knew it would be less than 50MB so no need to
   upload it to S3; I could upload from my laptop.
1. Create the terraform configuration to upload my `.zip` whenever it had changed.  Validate it by running my Node
   script (`npm build`), then doing a `terraform apply`, the `curl`ing my API Gateway to make sure my changes
   showed up.
1. Repeat this a few times just to make sure I know how it works and how quickly the deploy happens (answer is
   very quickly)

At this point, I can now deploy changes to my lambda in two steps and validate what it's doing by looking at logs.

Next is to actually make it do something!

### Implementing The Real Lambda

1. Set up Jest so I can run tests of the lambda.  Because the lambda is an async function (despite being a
   synchronous service), the test code had to make sure to execute it.  Verify that my test will pass based on the
existing behavior as well as fail if a) I didn't make the lambda async or b) forgot to call the lambda in the
test.  This makes sure I can rely on my test.
1. Implement the lambda to log what it gets from the front-end and return a real diagram ID (but not write to S3 yet).  Unit test for that as well.
1. Change build script to require that tests pass so I don't forget to run them.
1. Deploy this.
1. Now, the real front end should experience a successful POST to the back-end, get a real diagram ID back, and
   begin polling.  The front-end should get a 404 from that polling and render a nice error message.  I can then
   view all of this in the Cloud Watch logs.
1. Time to write the real code to save the diagram to S3.  The code for this sucks because it's Node and it's
   callback hell, but I was able to mock the S3 API and at least execute everything to be sure I called the S3 API
   in the way that I thought it would be called.  I could've made a dev bucket and gotten dev credentials, but
   I've been down this road before and it doesn't really scale.
1. To make this work the "right" way, I don't want my lambda having to manage S3 keys.  AWS allows this via IAM
   roles.  I would need to give my lambda access to write objects to S3.  Again, this is a common case, so I was
   able to copy directly from examples to make this work.  When you do this, AWS gives the lambda dynamic keys at
   runtime that you don't have to manage.  Since I had a *ton* of logging in the code, I would know what went
   wrong, if anything.
1. Deploy that, verify that the blob got written, and verify that the front-end no longer gets a 404, but instead
   gets an "in progress" diagram.  Woot!
1. Refactor the lambda code, mostly just for fun to see if I could organized it a bit better than one giant blob
   of code.





