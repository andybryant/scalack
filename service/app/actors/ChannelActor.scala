package actors

import akka.actor.{Actor, ActorRef, Props, Terminated}
import play.api.Play
import play.libs.Akka

import scala.collection.JavaConversions._
import scala.collection.immutable.{HashSet, Queue}

class ChannelActor(id: String) extends Actor {
  var messageHistory: Queue[ChatMessage] = Queue.empty[ChatMessage]
  var subscribers: HashSet[ActorRef] = HashSet.empty[ActorRef]

  def receive = {
    case message @ ChatMessage(_, _, _, _) =>
      subscribers.foreach(_ ! message)
  }
}

object ChannelsActor {
  lazy val channelsActor: ActorRef = Akka.system.actorOf(Props(classOf[ChannelsActor]))
}

class ChannelsActor extends Actor {
  var nextId: Long = 1L
  var subscribers: HashSet[ActorRef] = HashSet.empty[ActorRef]
  var channelsById: Map[String, Channel] = Map.empty

  {
    val defaultChannels = Play.application.configuration.getStringList("default.channels")
      .map(_.toList).getOrElse(List.empty)
    defaultChannels.foreach {channel =>
      val id: String = nextId.toString
      nextId += 1
      channelsById += (id -> PublicChannel(id, channel))
    }
  }

  def receive = {
    case SubscribeChannels =>
      subscribers += sender()
      context.watch(sender())
      sender() ! Channels(channelsById.values.toSeq)
    case message @ SubscribeChannel(channel) =>
      val id = channel.channelId
      context.child(id).getOrElse {
        val child = context.actorOf(Props(new ChannelActor(id)), id)
        channelsById += (id -> channel)
        val channels = Channels(channelsById.values.toSeq)
        subscribers.foreach(_ ! channels)
        child
      } forward message
    case message @ ChatMessage(id, sender, msg, timestamp) =>
      context.child(id).foreach(_ ! message)
    case Terminated(subscriber) =>
      subscribers -= subscriber
  }
}


sealed trait Channel {
  val channelId: String
}
case class PublicChannel(channelId: String, name: String) extends Channel
case class PrivateChannel(channelId: String, exclusiveUserIds: Set[String]) extends Channel

case object SubscribeChannels
case class SubscribeChannel(channel: Channel)
case class ChatMessage(channelId: String, sender: String,
                       message: String, timestamp: Long = System.currentTimeMillis())
case class Channels(channels: Seq[Channel])
