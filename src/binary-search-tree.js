const { NotImplementedError } = require('../extensions/index.js');

// const { Node } = require('../extensions/list-tree.js');

/**
* Implement simple binary search tree according to task description
* using Node from extensions
*/

class Node {
  data;
  parent;
  left;
  right;

  #setData(data) { return data == null ? null : new Node(data, this); }
  setLeftData(data) { this.left = this.#setData(data); }
  setRightData(data) { this.right = this.#setData(data); }
  killChild(data) {
    if (this.left && this.left.data == data) this.setLeftData(null);
    else
    if (this.right && this.right.data == data) this.setRightData(null);
    else throw Error("incorrect data!");
  }

  setLeftNode(node) { this.left = node; node.parent = this; }
  setRightNode(node) { this.right = node; node.parent = this; }
  replaceChild(oldNode, newNode) {
    if (this.left && this.left.data == oldNode.data) this.setLeftNode(newNode);
    else
    if (this.right && this.right.data == oldNode.data) this.setRightNode(newNode);
    else throw Error("incorrect node!");
  }

  toString(t = 0) {
    const tab = ' '.repeat((t+1) * 2);
    let str = `{ ${this.data}`;
    if (this.left || this.right) {
      str = str + ',';
      if (this.left)
        str = str + `\r\n${tab}l:${this.left.toString(t+1)}`;
      if (this.right)
        str = str + `\r\n${tab}r:${this.right.toString(t+1)}`;
      //str = str + `\r\n${tab}p:${this.parent ? this.parent.data : null}`;
      str = str + `\r\n${' '.repeat(t * 2)}`;
    } else {
      str = str + ' ';
    }
    str = str + '}';

    return str;
  }

  constructor(data, parent, left, right) {
    this.data = data;
    this.parent = parent;
    this.left = left?? null;
    this.right = right?? null;
  }
}

class BinarySearchTree {
  #root = null;

  root = () => this.#root;

  #searchNode = (node, data) => {
    if (data == node.data) return node;
    return (data < node.data) 
      ? (node.left)
        ? this.#searchNode(node.left, data)
        : node
      : (node.right)
        ? this.#searchNode(node.right, data)
        : node;
  }

  add = data => {
    if (!this.#root) {
     this.#root = new Node(data, null);
     return;
    }

    const nodeToAdd = this.#searchNode(this.#root, data)
    if (data == nodeToAdd.data) throw Error('data was already added!');
    if (data < nodeToAdd.data)
      nodeToAdd.setLeftData(data);
    else
      nodeToAdd.setRightData(data);
  }

  has = data => this.#searchNode(this.#root, data).data == data;

  find = data => {
    const node = this.#searchNode(this.#root, data);
    return node.data == data ? node : null;
  }

  min = () => this.#searchNode(this.#root, -Infinity).data;
  max = () => this.#searchNode(this.#root, Infinity).data;

  remove = data => {
    const node = this.#searchNode(this.#root, data);
    if (node.data !== data) throw Error('data not found!');
    if (node.left && node.right) {
      const closestLeft = this.#searchNode(node, node.data - 1);
      const closestRight = this.#searchNode(node, node.data + 1);
      const avg = (node.left.data + node.right.data) / 2;
      
      const closestNode = (Math.abs(avg - closestLeft.data) < Math.abs(closestRight.data - avg)) 
                          ? closestLeft : closestRight; 

      if(closestNode.left) {
        if (closestNode.parent == node) node.setLeftNode(closestNode.left);
        else closestNode.parent.setRightNode(closestNode.left);
      } else if (closestNode.right) {
        if (closestNode.parent == node) node.setRightNode(closestNode.right);
        else closestNode.parent.setLeftNode(closestNode.right);
      } else 
      if (closestNode.parent) closestNode.parent.killChild(closestNode.data);

      node.data = closestNode.data;
    } else
    if (node.left) {
      if (node.parent) {
        node.parent.replaceChild(node, node.left);
      } else {
        node.left.parent = null;
        this.#root = node.left;
      }
    } else
    if (node.right) {
      if (node.parent) {
        node.parent.replaceChild(node, node.right);
      } else {
        node.right.parent = null;
        this.#root = node.right;
      }
    } else /* if (!node.left && !node.right)*/ {
      if (node.parent) node.parent.killChild(node.data);
      else this.#root = null;
    }
  }
}

module.exports = {
  BinarySearchTree
};