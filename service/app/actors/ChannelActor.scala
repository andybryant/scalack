package actors

import akka.actor.{Terminated, Actor, Props, ActorRef}
import play.libs.Akka

import scala.collection.immutable.{HashSet, Queue}

class ChannelActor(id: String) extends Actor {
  var messageHistory: Queue[ChatMessage] = Queue.empty[ChatMessage]
  var subscribers: HashSet[ActorRef] = HashSet.empty[ActorRef]

  def receive = {
    case message @ ChatMessage(_, _, _) =>
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

  def receive = {
    case SubscribeChannels =>
      subscribers += sender()
      context.watch(sender())
    case message @ SubscribePublicChannel(_) =>

    case message @ ChatMessage(id, _, _) =>
      context.child(id).foreach {
        _ forward message
      }
    case Terminated(subscriber) =>
      subscribers -= subscriber
  }
}


case class Channel(channelId: String, exclusiveUserIds: Option[Set[String]])
case object SubscribeChannels
case class SubscribePublicChannel(id: String)
case class SubscribePrivateChannel(exclusiveUserIds: Set[String])
case class ChatMessage(channelId: String, sender: String, message: String)
