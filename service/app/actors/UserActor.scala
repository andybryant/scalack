package actors

import akka.actor.{Terminated, Props, ActorRef, Actor}
import play.api.Play
import play.libs.Akka

class UserActor extends Actor {
  override def receive = {
    case
  }
}

object UsersActor {
  lazy val usersActor: ActorRef = Akka.system.actorOf(Props(classOf[UsersActor]))
}

class UsersActor extends Actor {

  private def login(user: Login): Unit = {
    this.user = Option.apply(user)
    Play.application.configuration.getStringList("default.stocks");
  }


  override def receive = {
    case message @ Login(id, _) =>
      context.child(id).getOrElse{
        context.actorOf(Props(new ChannelActor(id)))
      } forward message
  }
}

case class Login(user: String, password: String)
case object LoginSuccessful
case object LoginFailed
case class UserCreated(id: String, name: String)
