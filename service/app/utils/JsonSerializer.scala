package utils

import actors.{Sender, PostMessage, PrivateChannel, PublicChannel}
import akka.actor.ActorRef
import model._
import play.api.libs.json.{JsString, JsArray, Json, JsValue}

class JsonSerializer {

  def payloadToJson(payload: ClientPayloadOut, sessionActor: ActorRef): JsValue = {
    payload match {
      case LoginSuccessful(_, userId) =>
        Json.obj(
          "type" -> "loginSuccessful",
          "payload" -> Json.obj(
            "userId" -> userId
          )
        )
      case LoginFailed =>
        Json.obj("type" -> "loginFailed")
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
      case msg @ PublishMessage(_, _) =>
        Json.obj(
          "type" -> "publishMessage",
          "payload" -> messageToJson(msg, sessionActor)
        )
    }
  }

  def messageToJson(message: PublishMessage, sessionActor: ActorRef): JsValue = {
    val PublishMessage(messageId, PostMessage(
        Sender(clientRef, user),
        PostedMessage(clientMessageId, channelId, text), timestamp)) = message
    Json.obj(
      "messageId" -> messageId,
      "clientMessageId" -> (if (clientRef == sessionActor) clientMessageId else ""),
      "channelId" -> channelId,
      "senderId" -> user,
      "text" -> text,
      "timestamp" -> timestamp
    )
  }
}
