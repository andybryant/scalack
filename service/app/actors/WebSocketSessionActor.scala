package actors

import akka.actor.{FSM, Actor, ActorRef, Props}
import model.PostedMessage
import play.api.libs.json._

package websocket {

  import actors.user.{ActiveData, UsersActor}
  import model._
  import utils.JsonSerializer

  object WebSocketSessionActor {
    def props(out: ActorRef) = Props(new WebSocketSessionActor(out))
  }

  class WebSocketSessionActor(out: ActorRef) extends Actor with FSM[SessionState, SessionData] {
    val serializer: JsonSerializer = new JsonSerializer
    implicit val loginReads: Reads[Login] = Json.reads[Login]
    implicit val postMessageReads: Reads[PostedMessage] = Json.reads[PostedMessage]
    implicit val updateMessageReads: Reads[UpdateMessage] = Json.reads[UpdateMessage]
    implicit val deleteMessageReads: Reads[DeleteMessage] = Json.reads[DeleteMessage]

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
      case Event(msg: JsObject, Unauthenticated) =>
        val msgType: String = (msg \ "type").as[String]
        log.debug("Received client message in Initial {}", msg)
        if (msgType == "login" ) {
          val payload = (msg \ "payload").validate[Login]
          withPayload(payload) {login =>
            UsersActor.usersActor ! login
          }
        } else {
          log.warning("Unexpected message {}", msg)
        }
        stay
      case Event(msg @ LoginSuccessful(userRef, userId, _), Unauthenticated)  =>
        send(msg)
        goto(Authenticated) using UserDetails(userRef, userId, None)
      case Event(msg @ LoginFailed, Unauthenticated) =>
        send(msg)
        stay
    }

    when(Authenticated) {
      case Event(msg: JsObject, UserDetails(userRef, userId, _)) =>
        log.debug("Received client message in Authenticated {}", msg)
        val msgType: String = (msg \ "type").as[String]
        msgType match {
          case "logout" =>
            userRef ! Logout
            send(LogoutSuccessful)
            goto(Initial) using Unauthenticated
          case "channels" =>
            userRef ! SubscribeChannelList
            stay
          case "users" =>
            UsersActor.usersActor ! SubscribeUserList
            stay
          case "postMessage" =>
            val payload = (msg \ "payload").validate[PostedMessage]
            withPayload(payload) { msg =>
              val PostedMessage(channelId, clientMessageId, text) = msg
              ChannelsActor.channelsActor ! PostMessage(channelId, Sender(self, userId), clientMessageId, text)
            }
            stay
          case "updateMessage" =>
            val payload = (msg \ "payload").validate[UpdateMessage]
            withPayload(payload) {
              ChannelsActor.channelsActor ! _
            }
            stay
          case "deleteMessage" =>
            val payload = (msg \ "payload").validate[DeleteMessage]
            withPayload(payload) {
              ChannelsActor.channelsActor ! _
            }
            stay
        }
      case Event(usersMsg @ UserSet(_), _) =>
        send(usersMsg)
        stay
      case Event(channelsMsg @ ChannelSet(channels), data @ UserDetails(userRef, userId, maybeOldChannels)) =>
        maybeOldChannels match {
          case Some(oldChannels) =>
            val newChannels = channels.diff(oldChannels)
            newChannels.foreach(ChannelsActor.channelsActor ! RequestMessageHistory(_))
          case None =>
            channels.foreach(ChannelsActor.channelsActor ! RequestMessageHistory(_))
        }
        send(channelsMsg)
        stay using UserDetails(userRef, userId, Some(channels))
      case Event(msg: MessageHistory, _) =>
        send(msg)
        stay
      case Event(msg: PublishMessage, _) =>
        send(msg)
        stay
      case Event(msg: UpdateMessage, _) =>
        send(msg)
        stay
      case Event(msg: DeleteMessage, _) =>
        send(msg)
        stay
      case unknown =>
        log.error("Unexpected message {}", unknown)
        send(JsString("Unknown message: " + unknown))
        stay
    }

    initialize()

    def send(payload: ClientPayloadOut): Unit = {
      send(serializer.payloadToJson(payload, self))
    }

    def send(payload: JsValue): Unit = {
      log.debug("Sending {}", payload)
      out ! payload
    }



  }

  sealed trait SessionState
  case object Initial extends SessionState
  case object Authenticated extends SessionState

  sealed trait SessionData
  case object Unauthenticated extends SessionData
  case class UserDetails(userRef: ActorRef, userId: String, channels: Option[Set[Channel]]) extends SessionData

}



// Messages to other actors

case class Sender(clientRef: ActorRef, user: String)
case class PostMessage(
      channelId: String,
      sender: Sender,
      clientMessageId: String,
      text: String,
      timestamp: Long = System.currentTimeMillis())
