# Home Trax Mobile

This is the mobile version of Home Trax. Home Trax was written because we are in transition between two different
time tracking systems at work and I needed a way to keep track of time using two different schemes. This application
may actually become even more simple if we ever transition to just one system.

The name is kind of an inside joke. Where I work, everthing thing is named for the company, so PentaFoo and
PentaBar, and PentaBazBarFoo, etc. So, I wrote this at home, so it is HomeBazBarFoo... Meh, whatever.

## Quick Start

Besides the basics ([Git](http://git-scm.com/), [Node](http://nodejs.org/), and [MongoDB](https://www.mongodb.org/)),
you will need to install a few tools in order to do any real work.

  - npm install bower -g
  - npm install karma-cli -g
  - npm install gulp-cli -g
  - npm install phantomjs -g
  - npm install mocha -g
  - npm install protractor -g (not used yet, but you should, and so should I)

## Summary of gulp commands

Here are the most useful gulp tasks. For a list of the other ones, see the gulpfile.js

  - gulp - this does a dev build, including tests, linting, and code style checks
  - gulp dev - does a dev build and waits for changes
  - gulp test - just run the tests
  
You can also run one of these command to kick off the tests:
  - karma start - run the tests once
  - karma start karma-watch.conf.js - run tests, watch for changes, then re-run

## Deployment

For how, this is not deployed in any stores, nor is it shared via ionic view. I will probably just deploy it
manually to my devices when the time comes (this is just used by me, after all).

In order to do a build for deployment: ```gulp --type=release```