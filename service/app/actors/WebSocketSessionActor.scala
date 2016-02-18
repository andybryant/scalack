package actors

import akka.actor.{FSM, Actor, ActorRef, Props}
import model.PostedMessage
import play.api.libs.json._

package websocket {

  import actors.user.UsersActor
  import model._
  import utils.JsonSerializer

  object WebSocketSessionActor {
    def props(out: ActorRef) = Props(new WebSocketSessionActor(out))
  }

  class WebSocketSessionActor(out: ActorRef) extends Actor with FSM[SessionState, SessionData] {
    val serializer: JsonSerializer = new JsonSerializer
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
      case Event(msg: JsObject, Unauthenticated) =>
        val msgType: String = (msg \ "type").as[String]
        log.info("Received client message in Initial {}", msg)
        if (msgType == "login" ) {
          val payload = (msg \ "payload").validate[Login]
          withPayload(payload) {login =>
            UsersActor.usersActor ! login
          }
        } else {
          log.warning("Unexpected message {}", msg)
        }
        stay
      case Event(msg @ LoginSuccessful(userRef, userId), Unauthenticated)  =>
        send(msg)
        goto(Authenticated) using UserDetails(userRef, userId)
      case Event(msg @ LoginFailed, Unauthenticated) =>
        send(msg)
        stay
    }

    when(Authenticated) {
      case Event(msg: JsObject, UserDetails(userRef, userId)) =>
        log.info("Received client message in Authenticated {}", msg)
        val msgType: String = (msg \ "type").as[String]
        msgType match {
          case "channels" =>
            userRef ! SubscribeChannelList
          case "users" =>
            UsersActor.usersActor ! SubscribeUserList
          case "postMessage" =>
            val payload = (msg \ "payload").validate[PostedMessage]
            withPayload(payload) {
              ChannelsActor.channelsActor ! PostMessage(Sender(self, userId), _)
            }
        }
        stay
      case Event(channelsMsg @ ChannelSet(_), _) =>
        send(channelsMsg)
        stay
      case Event(usersMsg @ UserSet(_), _) =>
        send(usersMsg)
        stay
      case Event(msg @ MessageHistory(_, _), _) =>
        send(msg)
        stay
      case Event(msg @ PublishMessage(_, _), _) =>
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
      log.info("Sending {}", payload)
      out ! payload
    }



  }

  sealed trait SessionState
  case object Initial extends SessionState
  case object Authenticated extends SessionState

  sealed trait SessionData
  case object Unauthenticated extends SessionData
  case class UserDetails(userRef: ActorRef, userId: String) extends SessionData

}



// Messages to other actors

case class Sender(clientRef: ActorRef, user: String)
case class PostMessage(
      sender: Sender,
      message: PostedMessage,
      timestamp: Long = System.currentTimeMillis())
