const { NotImplementedError } = require('../extensions/index.js');

const { ListNode } = require('../extensions/list-node.js');

/**
 * Implement the Queue with a given interface via linked list (use ListNode extension above).
 *
 * @example
 * const queue = new Queue();
 *
 * queue.enqueue(1); // adds the element to the queue
 * queue.enqueue(3); // adds the element to the queue
 * queue.dequeue(); // returns the top element from queue and deletes it, returns 1
 * queue.getUnderlyingList() // returns { value: 3, next: null }
 */
class Queue {
  #list = null;
  #last = null;
  getUnderlyingList = () => this.#list;

  enqueue = value => {
    if(this.#list) {
      this.#last.next = new ListNode(value);
      this.#last = this.#last.next;
    }
    else {
      this.#list = new ListNode(value);
      this.#last = this.#list;
    }
  }

  dequeue = () => {
    if(!this.#list) return null;
    const value = this.#list.value;
    this.#list = this.#list.next;
    if(!this.#list) this.#last = null;
    return value;
  }
}

module.exports = {
  Queue
};
