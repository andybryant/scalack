package actors

import akka.actor.{Actor, ActorRef, Props}
import akka.event.Logging
import play.api.libs.json._
import play.api.libs.functional.syntax._

object WebSocketSessionActor {
  def props(out: ActorRef) = Props(new WebSocketSessionActor(out))
}

class WebSocketSessionActor(out: ActorRef) extends Actor {
  val log = Logging(context.system, this)

  implicit val loginReads: Reads[Login] = (
    (__ \ "userId").read[String] and
    (__ \ "password").read[String]
  )(Login.apply _)

  implicit val messageReads: Reads[ChatMessage] = (
    (__ \ "channelId").read[String] and
    (__ \ "sender").read[String] and
    (__ \ "message").read[String] and
    (__ \ "timestamp").read[Long]
  )(ChatMessage.apply _)

  implicit val messageWrites = new Writes[ChatMessage] {
    def writes(message: ChatMessage) = Json.obj(
      "channelId" -> message.channelId,
      "sender" -> message.sender,
      "message" -> message.message,
      "timestamp" -> message.timestamp
    )
  }

  private def processMessage(msg: JsObject): Unit = {
    def withBody[A](message: JsResult[A])(success: A => Unit) = {
      message match {
        case s: JsSuccess[A] =>
          success(s.value)
        case e: JsError =>
          log.error("Failed to parse {}: {}", msg, e)
          out ! JsError.toJson(e).toString()
      }
    }
    log.info("Received message {}", msg)
    val msgType: String = (msg \ "type").as[String]
    msgType match {
      case "login" =>
        val message = (msg \ "body").validate[Login]
        withBody(message) {
          UsersActor.usersActor ! _
        }
      case "channels" =>
        out ! SubscribeChannels
      case "postMessage" => {
        val message = (msg \ "body").validate[ChatMessage]
        withBody(message) {
          ChannelsActor.channelsActor ! _
        }
      }
    }
  }

  override def receive = {
    case clientMessage: JsObject =>
      processMessage(clientMessage)
    case LoginSuccessful =>
      out ! Json.obj("type" -> "LoginSuccessful")
    case LoginFailed =>
      out ! Json.obj("type" -> "LoginFailed")
    case msg @ ChatMessage(_, _, _, _) =>
      out ! Json.toJson(msg)
    case unknown =>
      out ! JsString("Unknown message from client: " + unknown)
  }

}
