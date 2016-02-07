package utils

object IdGenerator {

  def create(prefix: String): IdGenerator = {
    new IdGenerator(prefix)
  }

}

class IdGenerator(prefix: String) {

  private var nextId: Long = 1L

  def next(): String = {
    val id = prefix + nextId
    nextId += 1
    id
  }

}
