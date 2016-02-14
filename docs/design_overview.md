# Scalack design overview

## Introduction

Scalack is a web-based chat client written to learn Scala and become familiar with the Scala API of Akka.

## Architecture

The backend is written in Scala and uses Akka and the Play framework. It communicates with an HTML5 single page app using websockets. The frontend was written in ES2015 and utilizes react and react-redux along with a number of other open source libraries.

## Features

The following features are _included_ currently:

1. Single page HTML5 app
1. Immediate availability of new messages (push via websockets)
1. Ability to log in multiple times as same user and receive all messages everywhere

What features are _not included_ currently:

1. Any kind of user or message persistence. Restarting the server will cause all state to be lost.
1. Ability to select channels to subscribe to
1. Ability to add or edit public channels
1. Search

## End to end workflows

**TODO** add sequence diagrams

### Login

1. Client sends `login` message
1. WSSession sends `Login` to Users actor
    1. Users actor creates User actor with new id if not there
    1. Send `CreatePrivateChannels` to Channels actor to create private channels with all existing users
    1. Channels actor creates new `PrivateChannel` instances
    1. Channels actor sends updated channel list to all subscribers
1. Users actor forwards `Login` to User actor
1. If first session, User actor sends `SubscribeChannelList` to Channels actor
    1. Channels actor adds ref of User actor to list of active subscribers
    1. Channels actor sends `Channels` message back to WSSession actor containing all currently known public and applicable private channels
1. User actor sends `LoginSuccessful` to WSSession actor
1. WSSession sends `loginSuccessful` action to client

### Request channels

1. Client sends `channels` message
1. WSSession sends `SubscribeChannelList` to user actor
1. User actor adds ref of WSSession actor to list of active sessions
1. If User actor has received channels from user actor yet, it sends these to WSSession actor in `Channels` message

### Request contacts

1. Client sends `contacts` message
1. WSSession sends `SubscribeUserList` to Users actor
1. Users actor adds ref of WSSession actor to list of active sessions
1. If User actor has received channels from user actor yet, it sends these to WSSession actor in `Channels` message

## #Subscribe channels

1. Client sends `channels` message


**TODO** - pass user ref back in login successful. HAve User actor manage channel list subscription for all sessions. Likewise it should subscribe to channels, not sessions.


### Send message
