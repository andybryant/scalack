package actors

import akka.actor.{Terminated, Actor, ActorRef, Props}
import play.libs.Akka


class UserActor(userId: String) extends Actor {

  var sessions: Set[ActorRef] = Set.empty

  // TODO on creation subscribe to all public channels and private channels for all other uers
  // TODO listen on new users and subscribe to private channel for them

  override def receive = {
    case Login(id, _) =>
      sessions += sender()
      context.watch(sender())
    case Terminated(session) =>
      sessions -= session
    case msg @ ChatMessage(_, _, _, _) =>
      sessions.foreach(_ ! msg)
  }
}

object UsersActor {
  lazy val usersActor: ActorRef = Akka.system.actorOf(Props(classOf[UsersActor]))
}

class UsersActor extends Actor {
  var users: Set[ActorRef] = Set.empty

  override def receive = {
    case message @ Login(id, _) =>
      context.child(id).getOrElse{
        val child = context.actorOf(Props(new UserActor(id)), id)
        users += child
        context.watch(child)
        child
      } forward message
    case Terminated(user) =>
      users -= user
  }
}

case class Login(user: String, password: String)
case object LoginSuccessful
case object LoginFailed
case class UserCreated(id: String, name: String)

