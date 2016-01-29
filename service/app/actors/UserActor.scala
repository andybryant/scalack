package actors

import akka.actor.{Terminated, Props, ActorRef, Actor}
import play.api.Play
import play.libs.Akka

class UserActor extends Actor {

  var sessions: Set[ActorRef] = Set.empty

  override def receive = {
    case Login(id, _) =>
      sessions += sender()
  }
}

object UsersActor {
  lazy val usersActor: ActorRef = Akka.system.actorOf(Props(classOf[UsersActor]))
}

class UsersActor extends Actor {

  private def login(user: Login): Unit = {
    this.user = Option.apply(user)
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
