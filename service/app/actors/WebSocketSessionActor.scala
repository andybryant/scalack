package actors

import akka.actor.{FSM, Actor, ActorRef, Props}
import play.api.libs.json._

package websocket {

  import actors.user.UsersActor

  object WebSocketSessionActor {
    def props(out: ActorRef) = Props(new WebSocketSessionActor(out))
  }

  class WebSocketSessionActor(out: ActorRef) extends Actor with FSM[SessionState, SessionData] {

    implicit val loginReads: Reads[Login] = Json.reads[Login]
    implicit val messageReads: Reads[PostedMessage] = Json.reads[PostedMessage]

    startWith(Initial, Unauthenticated)

    def withPayload[ClientMessage](message: JsResult[ClientMessage])(success: ClientMessage => Unit) = {
      message match {
        case s: JsSuccess[ClientMessage] =>
          success(s.value)
        case e: JsError =>
          log.error("Failed to parse {}: {}", message, e)
          send(JsError.toJson(e))
      }
    }

    when(Initial) {
      case Event(msg: JsObject, _) =>
        val msgType: String = (msg \ "type").as[String]
        var sessionData: SessionData = Unauthenticated
        log.info("Received client message in Initial {}", msg)
        if (msgType == "login" ) {
          val payload = (msg \ "payload").validate[Login]
          withPayload(payload) {login =>
            UsersActor.usersActor ! login
            sessionData = UserDetails(login.user)
          }
        } else {
          log.warning("Unexpected message {}", msg)
        }
        stay using sessionData
      case Event(msg @ LoginSuccessful, UserDetails(_))  =>
        send(msg)
        goto(Authenticated)
      case Event(msg @ LoginFailed, _) =>
        send(msg)
        stay using Unauthenticated
    }

    when(Authenticated) {
      case Event(msg: JsObject, UserDetails(userId)) =>
        log.info("Received client message in Authenticated {}", msg)
        val msgType: String = (msg \ "type").as[String]
        msgType match {
          case "channels" =>
            ChannelsActor.channelsActor ! SubscribeChannels
          case "postMessage" =>
            val payload = (msg \ "payload").validate[PostedMessage]
            withPayload(payload) {
              ChannelsActor.channelsActor ! PostMessage(Sender(self, userId), _)
            }
        }
        stay
      case Event(msg @ Channels(channels), _) =>
        send(msg)
        stay
      case Event(msg @ PublishMessage(_, _), _) =>
        send(msg)
        stay
      case unknown =>
        log.error("Unexpected message {}", unknown)
        send(JsString("Unknown message from client: " + unknown))
        stay
    }

    initialize()

    def send(payload: ClientPayloadOut): Unit = {
      send(payloadToJson(payload))
    }

    def send(payload: JsValue): Unit = {
      out ! payload
    }

    def payloadToJson(payload: ClientPayloadOut): JsValue = {
      payload match {
        case LoginSuccessful =>
          Json.obj("type" -> "loginSuccessful")
        case LoginFailed =>
          Json.obj("type" -> "loginFailed")
        case Channels(channels) =>
          Json.obj(
            "type" -> "channels",
            "payload" -> JsArray(
              channels.map {
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
                        "contactIds" -> Json.arr(exclusiveUserIds.toSeq),
                        "private" -> true
                      )
                  }
                }
              }
            )
          )
        case PublishMessage(messageId,
              PostMessage(
                Sender(clientRef, user),
                PostedMessage(clientMessageId, channelId, text), timestamp)) =>
          Json.obj(
            "type" -> "publishMessage",
            "payload" -> Json.obj(
              "messageId" -> messageId,
              "clientMessageId" -> (if (clientRef == self) clientMessageId else ""),
              "channelId" -> channelId,
              "senderId" -> user,
              "text" -> text,
              "timestamp" -> timestamp
            )
          )
      }
    }

  }

  sealed trait SessionState
  case object Initial extends SessionState
  case object Authenticated extends SessionState

  sealed trait SessionData
  case object Unauthenticated extends SessionData
  case class UserDetails(userId: String) extends SessionData

}

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


sealed trait ClientPayloadOut

case object LoginSuccessful extends ClientPayloadOut
case object LoginFailed extends ClientPayloadOut
case class Channels(channels: Seq[Channel]) extends ClientPayloadOut

/**
  * Chat message to send to client.
  */
case class PublishMessage(messageId: String, postMessage: PostMessage) extends ClientPayloadOut


// Messages to other actors

case class Sender(clientRef: ActorRef, user: String)
case class PostMessage(
      sender: Sender,
      message: PostedMessage,
      timestamp: Long = System.currentTimeMillis())
