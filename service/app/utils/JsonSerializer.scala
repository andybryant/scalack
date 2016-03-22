package utils

import actors.ChannelActor.{PrivateChannel, PublicChannel}
import actors.{Sender}
import akka.actor.ActorRef
import model.ClientPayload._
import play.api.libs.json.{JsString, JsArray, Json, JsValue}

class JsonSerializer {

  def payloadToJson(payload: ClientPayloadOut, sessionActor: ActorRef): JsValue = {
    payload match {
      case LoginSuccessful(_, userId, userName) =>
        Json.obj(
          "type" -> "loginSuccessful",
          "payload" -> Json.obj(
            "userId" -> userId,
            "userName" -> userName
          )
        )
      case LoginFailed =>
        Json.obj("type" -> "loginFailed")
      case LogoutSuccessful =>
        Json.obj("type" -> "logoutSuccessful")
      case ChannelSet(channels) =>
        Json.obj(
          "type" -> "channels",
          "payload" -> JsArray(
            channels.toSeq.map {
              channel => {
                channel match {
                  case PublicChannel(channelId, name) =>
                    Json.obj(
                      "id" -> channelId,
                      "name" -> name,
                      "private" -> false
                    )
                  case PrivateChannel(channelId, exclusiveUserIds) =>
                    Json.obj(
                      "id" -> channelId,
                      "contactIds" -> exclusiveUserIds.toSeq,
                      "private" -> true
                    )
                }
              }
            }
          )
        )
      case UserSet(users) =>
        Json.obj(
          "type" -> "users",
          "payload" -> JsArray(users.toSeq.map(user => Json.obj(
            "id" -> user.id,
            "name" -> user.name
          )))
        )
      case MessageHistory(channelId, history) =>
        Json.obj(
          "type" -> "messageHistory",
          "payload" -> Json.obj(
            "channelId" -> channelId,
            "history" -> JsArray(history.map(messageToJson(_, sessionActor)))
          )
        )
      case msg @ PublishMessage(_, _, _, _, _, _, _) =>
        Json.obj(
          "type" -> "publishMessage",
          "payload" -> messageToJson(msg, sessionActor)
        )
      case msg @ UpdateMessage(channelId, messageId, text) =>
        Json.obj(
          "type" -> "updateMessage",
          "payload" -> Json.obj(
            "channelId" -> channelId,
            "messageId" -> messageId,
            "text" -> text
          )
        )
      case msg @ DeleteMessage(channelId, messageId) =>
        Json.obj(
          "type" -> "deleteMessage",
          "payload" -> Json.obj(
            "channelId" -> channelId,
            "messageId" -> messageId
          )
        )

    }
  }

  def messageToJson(message: PublishMessage, sessionActor: ActorRef): JsValue = {
    val PublishMessage(channelId, messageId, Sender(clientRef, user),
      clientMessageId, text, timestamp, edited) = message
    Json.obj(
      "messageId" -> messageId,
      "clientMessageId" -> (if (clientRef == sessionActor) clientMessageId else ""),
      "channelId" -> channelId,
      "senderId" -> user,
      "text" -> text,
      "timestamp" -> timestamp,
      "edited" -> edited
    )
  }
}
