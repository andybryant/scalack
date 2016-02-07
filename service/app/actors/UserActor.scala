package actors

import akka.actor._
import play.libs.Akka

package user {

  import utils.IdGenerator

  class UserActor(userId: String, userName: String) extends FSM[UserState, UserData] with Stash {

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
      case Event(msg @ PublishMessage(_, _), ActiveData(sessions, _)) =>
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

  class UsersActor extends Actor with ActorLogging {
    var userNameToId: Map[String, String] = Map.empty
    val idGenerator = IdGenerator.create("User")

    override def receive = {
      case message@Login(userName, _) =>
        val id = if (userNameToId.contains(userName)) {
          userNameToId(userName)
        } else {
          idGenerator.next()
        }
        context.child(id).getOrElse {
          log.info("Adding new user id={} name={}", id, userName)
          val child = context.actorOf(Props(new UserActor(id, userName)), id)
          userNameToId.keys.foreach {
            (user) => ChannelsActor.channelsActor ! CreatePrivateChannel(Set(userName, user))
          }
          userNameToId += (userName -> id)
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
}


case class UserCreated(id: String, name: String)

