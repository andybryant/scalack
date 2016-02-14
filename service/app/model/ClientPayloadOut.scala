package model

import actors.{PostMessage, Channel}
import akka.actor.ActorRef

sealed trait ClientPayloadOut

case class LoginSuccessful(userRef: ActorRef, userId: String) extends ClientPayloadOut
case object LoginFailed extends ClientPayloadOut
case class ChannelSet(channels: Set[Channel]) extends ClientPayloadOut
case class UserSet(userIds: Set[String]) extends ClientPayloadOut
case class MessageHistory(channelId: String, history: Seq[PublishMessage]) extends ClientPayloadOut

/**
  * Chat message to send to client.
  */
case class PublishMessage(messageId: String, postMessage: PostMessage) extends ClientPayloadOut