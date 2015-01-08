jbst - Binary Search Trees in JavaScript
========================================

jbst is an implementation of BSTs (Binary Search Trees) in JS.

> The reason binary-search trees are important is that the following operations can be implemented efficiently:

>
- insert a key value
- determine whether a key value is in the tree
- remove a key value from the tree
- print all of the key values in sorted order

Install
-------
Using bower, run the following:
```bash
bower install --save jbst
```

Data structure implementation
-----------------------------
jbst uses a recursive way for creating the tree instead of using the graph theory model, i.e. nodes and edges.

Recursion pattern
-----------------
Most methods in jbst are implemented using the recursion pattern. Here is how it looks like in JS:
```javascript
return (function _aux (node) {
    if (!node) return base_value;
    return recursive_case();
})(initial_value);
```

API & usage
-----------
jbst comes with two constructors:
- `Node` which defines a BST node.
- `BST` which defines a binary search tree (is just a wrapper for the data structure containing the root)

### Node
To create a Node object:
```javascript
var n = j.Node('A', 3, null, null); // With or without new
```
In this case the node `n` has the key 'A' and the value 3. It has no children (no left nor right subtrees).

| Property      | Description
| ------------- |-------------  |
| `key`         | Lookup value  |
| `val`         | Node's value  |
| `left`        | Left subtree  |
| `right`       | Right subtree |

| Method        | Description | Example
| ------------- |------------- | ------
| `constructor` |              | See above
| `height`      | Gets the height of a node (i.e. the distance from the node to the deepest leaf) | `n.height() >> 0`

### BST (work in progress...)

### Creating a BST
To create a BST object just pass to the BST constructor the root:
```javascript
var tree = new j.BST(
    j.Node('A', 3, null,
        j.Node('B', 45, null, null)
    )
);
```
This example will create a node 'A' with one children in the right subtree which in turn has no children.

A tree can be created in a faster and more readable way from an array of single-key objects:
```javascript
var tree = j.BST.fromArray([
    {'G': 3},
    {'A': 52},
    {'B': 12},
    {'R': 94},
    {'Z': 23},
]);
```
In this case the node 'G' is the root of `tree`.

In addition a tree can be initialised with an object:
```javascript
var tree = j.BST.fromObject({
    'G': 3,
    'A': 53,
    'B': 12,
    'R': 94,
    'Z': 23
});
```

#### Properties
| Property      | Description
| ------------- |-------------
| `root`        | Holds the entire data structure (defined recursively)

#### Static methods
| Method        | Description | Example
| ------------- |------------- | ------
| `fromArray`   | Creates a BST from an array of single-key objects | See above (section 'Creating a BST')
| `fromObject`  | Creates a BST from an object | See above (section 'Creating a BST')

**Methods**
| Method        | Description | Example
| ------------- |------------- | ------
| `constructor` |              | See above
| `height`      | Gets the height of the root node (i.e. height of the tree) | `tree.height() >> 1`
