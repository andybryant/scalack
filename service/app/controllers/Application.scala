package controllers

import actors.WebSocketSessionActor$
import play.api.mvc._
import play.api.libs.json._
import play.api.Play.current

class Application {

  def socket = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    WebSocketSessionActor.props(out)
  }

}
