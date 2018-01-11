---
layout: post
title: "Explaining Serverless Architectures"
date: 2018-01-11 9:00
link: https://what-problem-does-it-solve.com/serverless/index.html
---

I've added another “problem” to “What problem does it solve?” about [serverless architectures][link], which I think are
the future of distributed systems (though that future isn't here yet):

> The less code you are responsible for running in production, the better. Running an actual server means it's all on you. Using virtual servers delegates some to your hosting provider. Using a platform-as-a-service like Heroku delegates yet more. A serverless architecture reduces this to what might be the absolute minimum - you are responsible for your code, and everything else is handled by the provider.

There are three big challenges: deployment, vendor lock-in, and *testing*.

[link]: https://what-problem-does-it-solve.com/serverless/index.html
