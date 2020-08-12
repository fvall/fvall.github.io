---
layout: post
title:  "Making better decisions"
date:   2020-08-10
categories: statistics
permalink: /posts/en/:title/
---

We tend to make better decisions once learn more about the world around us. Supplied with more information, we can utilise that experience to recognize patterns and, sometimes, we can "see" how things are going to turn up. I say "tend to" because I am sure you have that friend who doesn't learn from bad decisions. Luckily, they have got you as a friend to steer them towards the right path. :+1:

This is also true in the complicated world of probabilities. The more we know, the greater our chance to achieve the best possible outcome. The idea is quite simple, but sometimes the options are presented to us in a way that is not entirely clear how we can make use of our previous knowledge to make the best decision.

The idea of using known information in probability theory is known as _conditional probability_ and sometimes the results are so counterintuitive that our minds can't grasp anything else than "WTF?". Let's start with a simple example first and then we develop the idea into actual mathematics. 

## A simple problem

Let's think about those kinds of textbooks problems that will probably never happen in real life. I know these problems are a bit silly, but there is a reason why they come up over and over again. The problem itself is not important, the key here is the idea.

Imagine you have three drawers:

* drawer one (D1) has two <span style="color:red">red</span> balls
* drawer two (D2) has one <span style="color:red">red</span> ball and one <span style="color:blue">blue</span> ball
* drawer three (D3) has two <span style="color:blue">blue</span> balls

The problem is: suppose you open one drawer at random and pick one ball with closed eyes. Later, we see the ball is **blue**. What is the probability the other ball in that drawer is also blue?

After thinking for a few seconds, there is one response that normally comes up quite quickly.

_""
Well, if one ball is blue, it could only have come from either D2 or D3. Since there is only one ball left, it will be red if I am in D2 or blue if I am in D3. Hence, the chance is 50% of having selected D3.
""_

If you came to this conclusion, unfortunately, you would be wrong. :confused:

Worse, this reasoning seems so plausible it is hard to see a different answer to this problem.

## What was wrong?

The key idea in this post is: more information leads to a higher probability. If we stop and think, _"what was the probability of selecting two blue balls at the beginning?"_, most of us will come up with 1/3, the correct answer. Once we know the colour of the first ball, our probabilities **_increase_**, from 33% to 50% (in the answer above, which is incorrect).

So, what is the problem with the reasoning above? The issue is that the information was oversimplified. The reasoning above acknowledges that we know **in which drawer cannot be**. However, we know more! We know what the color of one the balls actually is! 

At first, it may seem these are equivalent, but in fact, they are not. I created a visual representation, with the solution, to our original problem.

<img src="https://ebezgw.ch.files.1drv.com/y4mlilHMiHKDloxOFKlM4JtDtGrDCsFhIOi-5yt-Jf62VZ0igMLcyOx4Vm-njXT4execoFraQ8045ppxyGaqWaeseyqZar3JekzLfNiK7Zidk2mNY8QBO6s661oJaUiIiQru40cF0rB0NCn2lLzKk3taB4PyIZVG8AaaqhZOEL-Lr-8pW52SRS4KShVzOOauQqyZhKadRcCOEvEWv5SiVtPhQ/bayes_rule_1.gif">

## The actual mathematics

Once we know what the color of the first ball is, we can safely **exclude** the first drawer as we know it is **_impossible_** the blue ball came from there. After extracting the first ball, 3 balls are remaining, 2 of which are blue. Therefore, our chance of getting an extra blue ball is 2/3.

That is the key idea behind conditional probability. Once we obtain information, we can update our views of how likely an event can occur and improve our odds.

You may have noticed this is an introduction to the topic, as so far I have not talked about any formulas. But for those you love formulas, I will throw one to make you happy. The conditional probability of an event $B$ occurring **_given_** that event $A$ occurred is

$$
 P(B|A) = \dfrac{P(B \cap A)}{P(A)}
$$

If you are familiar with sets, this is quite intuitive. Since we know $A$ has already happened, the only section of $B$ that can happen must have something in common with $A$. This is represented by $B \cap A$. Normally we would consider all possibilities, but this would be incorrect in this case since we know $A$ has occurred. We only need to consider the events which belong to $A$.

If we represent the number of elements of a set $S$ by $N(S)$, we can "derive" the formula above based on our intuition

<br>

$$
 \dfrac{N(B \cap A)}{N(A)} = \dfrac{N(B \cap A)}{N(A)} \times \dfrac{N(\text{all possibilities})}{N(\text{all possibilities})} = \dfrac{N(B \cap A)}{N(\text{all possibilities)}} \times \dfrac{N(\text{all possibilities})}{N(A)} = \dfrac{P(B \cap A)}{P(A)}
$$

<br>

I created the same GIF as above, but using [Venn diagrams](https://en.wikipedia.org/wiki/Venn_diagram) instead of boxes, so it looks like more "math-like".

<br>

<img src="https://gbcydw.ch.files.1drv.com/y4mHQcqSHkBOlv5dTJ94FD4YLyJ4LoU8PwfsQTWu2r64ROY-HS6RsS3lR1LboCeXWDITGIHYus0bBQWqP-3qLzZCGEa6zfYAv_oIyMoGt8keK0qxSv3czpQCgeYzbx9LoAVE_bMCLz-pBI0jTRweI_mu7YTbwQHxFLjn6TMmtCHPk8nAmQa8ublRqd3_Zg7Oau7VvR_VqsqTVhPPs3kR93qKw/bayes_rule_2.gif">

## Conditional probability "in action"

I hope after the explanation above, it is clear how we can use information to improve our odds and make better decisions. You may have seen conditional probability in a few places before. The most recent example I can think of is in the movie 21.

<br>

<iframe width="800" height="450" src="https://www.youtube-nocookie.com/embed/iBdjqtR2iK4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>

That's the gist of conditional probability. If you fully understood the basics of conditional probability, you should be able to solve this riddle without a problem.

<iframe width="800" height="450" src="https://www.youtube-nocookie.com/embed/cpwSGsb-rTs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>


Until next time. :v: