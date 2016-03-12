package actors

import actors.ChannelActor._
import akka.actor._
import model.ClientPayload._
import play.api.Play
import play.api.Play.current
import play.libs.Akka
import utils.IdGenerator

import scala.collection.JavaConversions._
import scala.collection.immutable.{HashSet, Queue}

object ChannelActor {
  sealed trait Channel {
    val channelId: ChannelId
  }
  case class PublicChannel(channelId: ChannelId, name: String) extends Channel
  case class PrivateChannel(channelId: ChannelId, exclusiveUserIds: Set[UserId]) extends Channel


  case class RequestMessageHistory(channel: Channel)
  case class SubscribeChannel(channel: Channel)
  case class UnsubscribeChannel(channel: Channel)
  case object SubscribeChannelList
  case class SubscribeChannels(channels: Set[Channel])
  case class CreatePrivateChannels(exclusiveUserIdsIterator: Iterable[Set[UserId]])

}

class ChannelActor(id: ChannelId) extends Actor with ActorLogging {
  val idGenerator = IdGenerator.create("Msg")
  var messageHistory: Queue[PublishMessage] = Queue.empty[PublishMessage]
  var subscribers: HashSet[ActorRef] = HashSet.empty[ActorRef]

  def receive = {
    case message: SubscribeChannel =>
      context.watch(sender)
      subscribers += sender
    case message: UnsubscribeChannel =>
      context.unwatch(sender)
      subscribers -= sender
    case message: RequestMessageHistory =>
      log.debug("Sending history {} to {}", messageHistory, sender)
      sender ! MessageHistory(id, messageHistory.toSeq)
    case message @ PostMessage(channelId, sender, clientMessageId, text, timestamp) =>
      val id = idGenerator.next()
      val publishMsg: PublishMessage = PublishMessage(channelId, id, sender, clientMessageId, text, timestamp)
      messageHistory :+= publishMsg
      subscribers.foreach(_ ! publishMsg)
    case message @ UpdateMessage(_, messageId, text) =>
      val index = messageHistory.indexWhere(_.messageId == messageId)
      if (index >= 0) {
        val oldMessage = messageHistory(index)
        messageHistory = messageHistory.updated(index, oldMessage.copy(text = text, edited = true))
        subscribers.foreach(_ ! message)
      }
    case message @ DeleteMessage(_, messageId) =>
      messageHistory = messageHistory.filterNot(_.messageId == messageId)
      subscribers.foreach(_ ! message)
    case Terminated(subscriber) =>
      subscribers -= subscriber
  }
}

object ChannelsActor {
  lazy val channelsActor: ActorRef = Akka.system.actorOf(Props(classOf[ChannelsActor]))
}

class ChannelsActor extends Actor with ActorLogging {
  val idGenerator = IdGenerator.create("Channel")
  var subscribers: HashSet[ActorRef] = HashSet.empty[ActorRef]
  var channelsById: Map[ChannelId, Channel] = Map.empty

  {
    val defaultChannels = Play.application.configuration.getStringList("default.channels")
      .map(_.toList).getOrElse(List.empty)
    defaultChannels.foreach {channelName =>
      val id: ChannelId = idGenerator.next()
      val channel = PublicChannel(id, channelName)
      channelsById += (id -> channel)
      log.info("Adding default channel {}", channel)
      context.actorOf(Props(new ChannelActor(id)), id)
    }
  }

  def receive = {
    case SubscribeChannelList =>
      subscribers += sender
      context.watch(sender)
      sender ! ChannelSet(channelsById.values.toSet)
    case message @ SubscribeChannel(channel) =>
      val id = channel.channelId
      context.child(id).foreach {
        _ forward message
      }
    case message @ RequestMessageHistory(channel) =>
      val id = channel.channelId
      context.child(id).foreach {
        _ forward message
      }
    case message @ UnsubscribeChannel(channel) =>
      val id = channel.channelId
      context.child(id).foreach {
        _ forward message
      }
    case CreatePrivateChannels(userIdsIterable) =>
      userIdsIterable.foreach{
        userIds => {
          val id: ChannelId = idGenerator.next()
          val channel = PrivateChannel(id, userIds)
          context.actorOf(Props(new ChannelActor(id)), id)
          channelsById += (channel.channelId -> channel)
        }
      }
      val channels = ChannelSet(channelsById.values.toSet)
      subscribers.foreach(_ ! channels)
    case message @ PostMessage(channelId, _, _, _, _) =>
      context.child(channelId).foreach(_ ! message)
    case message @ UpdateMessage(channelId, _, _) =>
      context.child(channelId).foreach(_ ! message)
    case message @ DeleteMessage(channelId, _) =>
      context.child(channelId).foreach(_ ! message)
    case Terminated(subscriber) =>
      subscribers -= subscriber
  }

}



