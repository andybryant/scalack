# Scalack
## Introd
uction

Scalack is a web-based chat app created to get more familiar with Scala and Play along with the Scala API for Akka.

## Architecture

The backend is written in Scala and uses Akka and the Play framework. It communicates with an HTML5 single page app using websockets. The frontend was written in ES2015 and utilizes react and react-redux along with a number of other open source libraries.

## Features

The following features are _included_ currently:

1. Single page HTML5 app
1. Immediate availability of new messages (push via websockets)
1. Individual users able to log in from multiple browsers concurrently. All sessions will receive all messages relevant to that user.
1. Supports public channels and private messaging
1. Messages support markdown format.
1. Ability to edit or delete any message written by the current user.

What features are _not included_ currently:

1. Any kind of user or message persistence. Restarting the server will cause all state to be lost.
1. Ability to select channels to subscribe to
1. Ability to add or edit public channels
1. Search

TODO - include screenshot
