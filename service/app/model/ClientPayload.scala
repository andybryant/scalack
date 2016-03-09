package model

import actors.{Sender, User, Channel}
import akka.actor.ActorRef

sealed trait ClientPayloadIn

case class Login(userName: String, password: String) extends ClientPayloadIn
case object Logout extends ClientPayloadIn

/**
  * Chat message received from client.
  *
  * @param clientMessageId id client uses to correlate response
  * @param channelId if of chat channel message was posted to
  * @param text message body
  */
case class PostedMessage(
                          channelId: String,
                          clientMessageId: String,
                          text: String) extends ClientPayloadIn
case class UpdateMessage(
                          channelId: String,
                          messageId: String,
                          text: String) extends ClientPayloadIn with ClientPayloadOut
case class DeleteMessage(
                          channelId: String,
                          messageId: String) extends ClientPayloadIn with ClientPayloadOut


sealed trait ClientPayloadOut

case class LoginSuccessful(userRef: ActorRef, userId: String, userName: String) extends ClientPayloadOut
case object LoginFailed extends ClientPayloadOut
case object LogoutSuccessful extends ClientPayloadOut
case class ChannelSet(channels: Set[Channel]) extends ClientPayloadOut
case class UserSet(users: Set[User]) extends ClientPayloadOut
case class MessageHistory(channelId: String, history: Seq[PublishMessage]) extends ClientPayloadOut

/**
  * Chat message to send to client.
  */
case class PublishMessage(
             channelId: String,
             messageId: String,
             sender: Sender,
             clientMessageId: String,
             text: String,
             timestamp: Long,
             edited: Boolean = false) extends ClientPayloadOut
