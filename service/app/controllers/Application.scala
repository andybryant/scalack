package controllers

import actors.WebSocketSessionActor
import play.api.Play.current
import play.api.libs.json._
import play.api.mvc._

class Application {

  def socket = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    WebSocketSessionActor.props(out)
  }

}
