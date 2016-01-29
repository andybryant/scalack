package actors

import java.util

import akka.actor.{Terminated, Actor, Props, ActorRef}
import play.api.{Configuration, Play}
import play.libs.Akka
import scala.collection.JavaConversions._
import scala.collection.immutable.{HashSet, Queue}

class ChannelActor(id: String) extends Actor {
  var messageHistory: Queue[PostMessage] = Queue.empty[PostMessage]
  var subscribers: HashSet[ActorRef] = HashSet.empty[ActorRef]

  def receive = {
    case message @ PostMessage(_, _, _) =>
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
    case message @ SubscribeChannel(channelId) =>
      context.child(channelId).foreach(_ forward message)
    case message @ PostMessage(id, _, _) =>
      context.child(id).foreach(_ forward message)
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
case class SubscribeChannel(channelId: String)
case class PostMessage(channelId: String, sender: String, message: String)
case class Channels(channels: Seq[Channel])