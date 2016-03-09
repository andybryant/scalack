package actors

import akka.actor._
import play.libs.Akka

package user {

  import model._
  import utils.IdGenerator

  class UserActor(userId: String, userName: String) extends FSM[UserState, UserData] with Stash {

    startWith(Initial, Uninitialized)


    when(Initial) {
      case Event(l: Login, Uninitialized) =>
        stash
        goto(Active) using ActiveData(Set.empty, None)
    }

    when (Active) {
      case Event(l: Login, data: ActiveData) =>
        context.watch(sender)
        sender ! LoginSuccessful(self, userId, userName)
        stay
      case Event(Logout, data @ ActiveData(sessions, _)) =>
        stay using data.copy(sessions = sessions - sender())
      case Event(Terminated(ref), data @ ActiveData(sessions, _)) =>
        stay using data.copy(sessions = sessions - ref)
      case Event(SubscribeChannelList, data @ ActiveData(sessions, maybeChannels)) =>
        maybeChannels.foreach(sender ! ChannelSet(_))
        stay using data.copy(sessions = sessions + sender)
      case Event(ChannelSet(channels), data @ ActiveData(sessions, maybeOldChannels)) =>
        val filteredChannels = channels.filter {
          case PublicChannel(_, _) => true
          case PrivateChannel(_, userIds) => userIds.contains(userId)
        }
        maybeOldChannels match {
          case Some(oldChannels) =>
            val removedChannels = oldChannels.diff(filteredChannels)
            removedChannels.foreach(ChannelsActor.channelsActor ! UnsubscribeChannel(_))
            val newChannels = filteredChannels.diff(oldChannels)
            newChannels.foreach(ChannelsActor.channelsActor ! SubscribeChannel(_))
          case None =>
            filteredChannels.foreach(ChannelsActor.channelsActor ! SubscribeChannel(_))
        }
        val channelMsg = ChannelSet(filteredChannels)
        sessions.foreach(_ ! channelMsg)
        stay using ActiveData(sessions, Some(filteredChannels))
      case Event(msg: PublishMessage, ActiveData(sessions, _)) =>
        sessions.foreach(_ ! msg)
        stay
      case Event(msg: UpdateMessage, ActiveData(sessions, _)) =>
        sessions.foreach(_ ! msg)
        stay
      case Event(msg: DeleteMessage, ActiveData(sessions, _)) =>
        sessions.foreach(_ ! msg)
        stay
    }

    onTransition {
      case Initial -> Active =>
        ChannelsActor.channelsActor ! SubscribeChannelList
        unstashAll
    }

    initialize()

  }

  sealed trait UserState
  case object Initial extends UserState
  case object Active extends UserState

  sealed trait UserData
  case object Uninitialized extends UserData
  case class ActiveData(sessions: Set[ActorRef], channels: Option[Set[Channel]]) extends UserData

  object UsersActor {
    lazy val usersActor: ActorRef = Akka.system.actorOf(Props(classOf[UsersActor]))
  }

  class UsersActor extends Actor with ActorLogging {
    val idGenerator = IdGenerator.create("User")
    var userNameToId: Map[String, String] = Map.empty
    var userNameToPassword: Map[String, String] = Map.empty
    var userListSubscribers: Set[ActorRef] = Set.empty

    def userSet = {
      UserSet((userNameToId map { case (name, id) => User(id, name) }).toSet)
    }

    override def receive = {
      case message @ Login(userName, password) =>
        val alreadyLoggedIn = userNameToId.contains(userName)
        if (alreadyLoggedIn && userNameToPassword(userName) != password) {
          sender ! LoginFailed
        } else {
          val id = if (alreadyLoggedIn) {
            userNameToId(userName)
          } else {
            idGenerator.next()
          }
          context.child(id).getOrElse {
            log.info("Adding new user id={} name={}", id, userName)
            val child = context.actorOf(Props(new UserActor(id, userName)), id)
            val userIdSets = userNameToId.values.map {
              (otherUserId) => Set(id, otherUserId)
            }
            ChannelsActor.channelsActor ! CreatePrivateChannels(userIdSets)
            userNameToId += (userName -> id)
            userNameToPassword += (userName -> password)
            userListSubscribers.foreach(_ ! userSet)
            child
          } forward message
        }
      case SubscribeUserList =>
        userListSubscribers += sender
        sender ! userSet
        context.watch(sender)
      case Terminated(subscriber) =>
        userListSubscribers -= subscriber
    }
  }

}


case object SubscribeUserList
case class User(id: String, name: String)