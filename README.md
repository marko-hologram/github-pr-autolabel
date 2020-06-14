# GitHub PR Autolabel

Simple and dumb experiment that allows you to automatically add labels before you open a PR in certain, user specified GitHub repositories.

I created this because I wanted to avoid situations where forgetting to set proper labels would prevent some automatic events from triggering, such as GitHub Slack integration not notifying proper channels that are subscribed to particular labels. Only way to trigger the proper automatic events in that case is to close the PR and try to open it again while not forgetting to set proper labels.

This is by no means perfect since it works in a really crude way by triggering click and such events on the page to "simulate" adding labels, but it was an experiment for me and it works fine enough when it works.