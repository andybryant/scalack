package actors

import akka.actor.{Actor, ActorRef, Props}
import play.api.Play
import play.api.libs.json._
import play.api.libs.functional.syntax._

object WebSocketSessionActor {
  def props(out: ActorRef) = Props(new WebSocketSessionActor(out))
}

class WebSocketSessionActor(out: ActorRef) extends Actor {

  implicit val loginReads: Reads[Login] = (
    (__ \ "userId").read[String] and
    (__ \ "password").read[String]
  )(Login.apply _)

  implicit val messageReads: Reads[PostMessage] = (
    (__ \ "channelId").read[String] and
      (__ \ "sender").read[String] and
      (__ \ "message").read[String]
    )(PostMessage.apply _)

  private def processMessage(msg: JsObject): Unit = {
    def withBody[A](success: A => Unit) {
      val message = (msg \ "body").validate[A]
      message match {
        case s: JsSuccess[A] =>
          success(s.value)
        case e: JsError =>
          out ! JsError.toJson(e).toString()
      }
    }

    val msgType: String = (msg \ "type").as[String]
    msgType match {
      case "login" =>
        withBody[Login] {
          UsersActor.usersActor ! _
        }
      case "channels" =>
        out ! SubscribeChannels
      case "postMessage" => {
        withBody[PostMessage] {
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
    case unknown =>
      out ! JsString("Unknown message: " + unknown)
  }

}
