package model

import actors.ChannelActor.Channel
import actors.user.UserActor.User
import actors.{Sender, User, Channel}
import akka.actor.ActorRef

object ClientPayload {

  type ChannelId = String
  type MessageId = String
  type UserId = String

  sealed trait ClientPayloadIn
  sealed trait ClientPayloadOut

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
                            channelId: ChannelId,
                            clientMessageId: String,
                            text: String) extends ClientPayloadIn
  case class UpdateMessage(
                            channelId: ChannelId,
                            messageId: MessageId,
                            text: String) extends ClientPayloadIn with ClientPayloadOut
  case class DeleteMessage(
                            channelId: ChannelId,
                            messageId: MessageId) extends ClientPayloadIn with ClientPayloadOut

  case class LoginSuccessful(userRef: ActorRef, userId: UserId, userName: String) extends ClientPayloadOut
  case object LoginFailed extends ClientPayloadOut
  case object LogoutSuccessful extends ClientPayloadOut
  case class ChannelSet(channels: Set[Channel]) extends ClientPayloadOut
  case class UserSet(users: Set[User]) extends ClientPayloadOut
  case class MessageHistory(channelId: ChannelId, history: Seq[PublishMessage]) extends ClientPayloadOut

  /**
    * Chat message to send to client.
    */
  case class PublishMessage(
                             channelId: ChannelId,
                             messageId: MessageId,
                             sender: Sender,
                             clientMessageId: String,
                             text: String,
                             timestamp: Long,
                             edited: Boolean = false) extends ClientPayloadOut

}





