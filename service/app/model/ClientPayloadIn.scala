package model

sealed trait ClientPayloadIn

case class Login(user: String, password: String) extends ClientPayloadIn
/**
  * Chat message received from client.
  *
  * @param clientMessageId id client uses to correlate response
  * @param channelId if of chat channel message was posted to
  * @param text message body
  */
case class PostedMessage(
        clientMessageId: String,
        channelId: String,
        text: String) extends ClientPayloadIn
