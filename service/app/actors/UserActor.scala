package actors

import akka.actor._
import akka.event.Logging
import play.libs.Akka


class UserActor(userId: String) extends FSM[UserState, UserData] with Stash {

  startWith(Initial, Uninitialized)

  
  when(Initial) {
    case Event(Login(_, _), Uninitialized) =>
      stash
      goto(Active) using ActiveData(Set.empty, Seq.empty)
      
  }

  when (Active) {
    case Event(Login(_,_), data @ ActiveData(sessions, _)) =>
      context.watch(sender)
      sender ! LoginSuccessful
      stay using data.copy(sessions = sessions + sender)
    case Event(Channels(channels), ActiveData(_, _)) =>
      channels.foreach {
        case channel@PublicChannel(_, _) =>
          ChannelsActor.channelsActor ! SubscribeChannel(channel)
        case channel@PrivateChannel(_, users) =>
          if (users contains userId)
            ChannelsActor.channelsActor ! SubscribeChannel(channel)
      }
      stay
    case Event(Terminated(ref), data @ ActiveData(sessions, _)) =>
      stay using data.copy(sessions = sessions - ref)
    case Event(msg @ ChatMessage(_, _, _, _), ActiveData(sessions, _)) =>
      sessions.foreach(_ ! msg)
      stay
  }
  
  onTransition {
    case Initial -> Active =>
      ChannelsActor.channelsActor ! SubscribeChannels
      unstashAll
  }

  initialize()

}

object UsersActor {
  lazy val usersActor: ActorRef = Akka.system.actorOf(Props(classOf[UsersActor]))
}

class UsersActor extends Actor {
  val log = Logging(context.system, this)
  var users: Set[String] = Set.empty

  override def receive = {
    case message @ Login(name, _) =>
      context.child(name).getOrElse{
        log.info("Adding new user {}", name)
        val child = context.actorOf(Props(new UserActor(name)), name)
        users.foreach {
          user => ChannelsActor.channelsActor ! CreatePrivateChannel(Set(name, user))
        }
        users += name
        child
      } forward message
  }
}

sealed trait UserState
case object Initial extends UserState
case object Active extends UserState

sealed trait UserData
case object Uninitialized extends UserData
case class ActiveData(sessions: Set[ActorRef], channels: Seq[Channel]) extends UserData

case class Login(user: String, password: String)
case object LoginSuccessful
case object LoginFailed
case class UserCreated(id: String, name: String)

