/**
 * @file JS implementation of binary-search trees (BST)
 * @author Ossama Edbali
 * @version 0.1.1
 */

/**
 * Main namespace for the jbst library. API's entry point.
 * @namespace j
 */
;(function (window, undefined) {

  /*************************************
   *  Private variables and functions  *
   *************************************/

var
    BSTException = function (message) {
        this.message = message;
    },

    pack = function (key, val) {
        var obj = {};
        obj[key] = val;
        return obj;
    },

    size = function (x) {
        if (x === null) return 0;                 // Base case
        return 1 + size(x.left) + size(x.right);  // Recursive case
    },

    sum = function (x) {
        if (x === null) return 0;
        return x.val + sum(x.left) + sum(x.right);
    },

    min = function (x) {
        if (x.left === null) return x;
        return min(x.left);
    },

    max = function (x) {
        if (x.right === null) return x;
        return max(x.right);
    },

    get = function (x, k) {
        if (x === null) return null; // be careful

        var k1 = x.key;
        if (k === k1) return x.val;
        if (k < k1)   return get(x.left, k);
        if (k > k1)   return get(x.right, k);
    },

    rank = function (k, x) {
        if (x === null) return 0;

        var kr = x.key;
        if (k === kr) return size(x.left);
        if (k < kr)   return rank(k, x.left);
        if (k > kr)   return 1 + size(x.left) + rank(k, x.right);
    },

    floor = function (x, k) {
        if (x === null) return null;

        var k1 = x.key;
        if (k === k1) return x;
        if (k <  k1)  return floor(x.left, k);

        var t = floor(x.right, k);
        return (t !== null) ? t : x;
    },

    ceil = function (x, k) {
        if (x === null) return null;

        var k1 = x.key;
        if (k === k1) return x;
        if (k < k1) {
            var t = ceil(x.left, k);
            return (t !== null) ? t : x;
        }
        return ceil(x.right, k);
    },

    deleteMin = function (x) {
        if (x.left === null) return x.right;
        x.left = deleteMin(x.left);
        return x;
    },

    deleteMax = function (x) {
        if (x.right === null) return x.left;
        x.right = deleteMax(x.right);
        return x;
    },

    del = function (x, k) {
        if (x === null) return null;

        var k1 = x.key;

        if      (k < k1) x.left  = del(x.left,  k);
        else if (k > k1) x.right = del(x.right, k);
        else {
            if (x.right === null) return x.left;
            if (x.left  === null) return x.right;

            var t = x;
            x = min(t.right);
            x.right = deleteMin(t.right);
            x.left = t.left;
        }

        return x;
    },

    isBST = function (x, min, max) {
        if (x === null) return true;

        var k = x.key, l = x.left, r = x.right;
        if (min !== null && k <= min) return false;
        if (max !== null && k >= max) return false;
        return isBST(l, min, k) && isBST(r, k, max);
    },

    select = function (x, k) {
        if (x === null) return null;

        var t = size(x.left);
        if      (t > k) return select(x.left,  k);
        else if (t < k) return select(x.right, k - t - 1);
        else            return x;
    },

    makeBalancedAux = function (arr, left, right) {
        if (left > right)
            return null;

        var mid = Math.ceil((left + right) / 2);
        return Node(arr[mid], arr[mid], makeBalancedAux(arr, left, mid - 1), makeBalancedAux(arr, mid + 1, right));

        /*if (left > right)
            return MakeBT(a[left], EmptyTree, EmptyTree)

        mid = (left + right) / 2
        return MakeBT(arr[mid],
            makeBalBSTAux(a, left, mid - 1),
            makeBalBSTAux(a, mid + 1, right))*/
    };

    /*************************************
    *  Private variables and functions  *
    *************************************/

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function() {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                  'toString',
                  'toLocaleString',
                  'valueOf',
                  'hasOwnProperty',
                  'isPrototypeOf',
                  'propertyIsEnumerable',
                  'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.io/#x15.4.4.18
    if (!Array.prototype.forEach) {

      Array.prototype.forEach = function(callback, thisArg) {

        var T, k;

        if (this == null) {
          throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
          throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
          T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

          var kValue;

          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          if (k in O) {

            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[k];

            // ii. Call the Call internal method of callback with T as the this value and
            // argument list containing kValue, k, and O.
            callback.call(T, kValue, k, O);
          }
          // d. Increase k by 1.
          k++;
        }
        // 8. return undefined
      };
    }

    /**
     * Represents a BST node.
     * @constructor
     * @param {string} key - The lookup key.
     * @param {mixed} val - The associated data.
     * @param {Node} left - The left subtree.
     * @param {Node} right - The right subtree.
     * @memberof j
     */
    function Node(key, val, left, right) {
        if (!(this instanceof Node)) {
            return new Node(key, val, left, right);
        }

        if (!(left instanceof Node && right instanceof Node) && (left !== null && right !== null)) {
            throw new BSTException('Error! Not a valid node.');
        }

        this.key = key;
        this.val = val;
        this.left = left;
        this.right = right;
    }

    Node.prototype = {

        /**
         * NumberNumberReturns the height of node (i.e. distance from itself to the deepest leaf in the BST)
         * @returns {Number} The height of the node
         * @memberof j.Node
         * @instance
         */
        height: function () {
            return (function _aux (node) {
                if (!node) return -1;
                return 1 + Math.max(_aux(node.left), _aux(node.right));
            })(this);
        }
    };

    /**
     * Represents a BST (Binary Search Tree)
     * @constructor
     * @param {Node|null} root - The root of the tree
     * @memberof j
     */
    function BST(root) {
        this.root = root;
    }

    /**
     * Creates a tree from an object
     * @params {Object} obj - The object to parse
     * @returns {BST} The tree
     * @memberof j.BST
     */
    BST.fromObject = function (obj) {
        var keys = Object.keys(obj),
            tree = new BST(null);

        keys.forEach(function (key, index, array) {
            var val = obj[key];
            tree.put(key, val);
        });

        return tree;
    };

    /**
     * Creates a tree from a single-key array
     * @params {Array} arr - The array to parse
     * @returns {BST} The tree
     * @memberof j.BST
     */
    BST.fromArray = function (arr) {
        var tree = new BST(null);

        arr.forEach(function (el, index, array) {
            tree.put(el);
        });

        return tree;
    };

    BST.makeBalanced = function (arr) {
        arr.sort();
        return makeBalancedAux(arr, 0, arr.length - 1);
    };

    BST.prototype = {

        /**
         * Gets the smallest key in the BST larger than or equal to 'key'
         * @params {string} key - The key to match against
         * @returns {string|null} The
         * @memberof j.BST
         * @instance
         */
        ceil: function (key) {
            var x = ceil(this.root, key);
            if (x === null) return null;
            else return x.key;
        },

        /**
         * Checks the consistency of the tree
         * @returns {boolean} Whether the BST is consistent
         * @memberof j.BST
         * @instance
         */
        check: function () {
            return this.isBST() && this.rankConsistent();
        },

        /**
         * Checks whether the given key is in the tree
         * @params {string} key - The lookup key
         * @returns {boolean} True when the key exists, false otherwise
         * @memberof j.BST
         * @instance
         */
        contains: function (key) {
            return this.get(key) !== null;
        },

        /**
         * Deletes a node given the key
         * @params {string} key - The lookup key
         * @returns {this} The current object (for chaining capabilities)
         * @memberof j.BST
         * @instance
         */
        delete: function (key) {
            if (this.isEmpty()) throw new BSTException('Empty tree');
            this.root = del(this.root, key);
            if (!this.check()) throw new BSTException('BST not consistent');
            return this;
        },

        /**
         * Deletes the far right node
         * @returns {this} The current object (for chaining capabilities)
         * @memberof j.BST
         * @instance
         */
        deleteMax: function () {
            if (this.isEmpty()) throw new BSTException('Empty tree');
            this.root = deleteMax(this.root);
            if (!this.check()) throw new BSTException('BST not consistent');
            return this;
        },

        /**
         * Deletes the far left node
         * @returns {this} The current object (for chaining capabilities)
         * @memberof j.BST
         * @instance
         */
        deleteMin: function () {
            if (this.isEmpty()) throw new BSTException('Empty tree');
            this.root = deleteMin(this.root);
            if (!this.check()) throw new BSTException('BST not consistent');
            return this;
        },

        /**
         * Gets the largest key in the BST less than or equal to 'key'
         * @params {string} key - The key to match against
         * @returns {string|null} The
         * @memberof j.BST
         * @instance
         */
        floor: function (key) {
            var x = floor(this.root, key);
            if (x === null) return null;
            else return x.key;
        },

        /**
         * Gets the node's value given the key
         * @params {string} The lookup key
         * @returns {mixed} The found value (null if not)
         * @memberof j.BST
         * @instance
         */
        get: function (key) {
            return get(this.root, key);
        },

        /**
         * Gets the height of the tree (i.e. the height of the root node)
         * @returns {number} The height of the tree
         * @memberof j.BST
         * @instance
         */
        height: function () {
            return this.root.height();
        },

        /**
         * Gets an array (linear) representation of the BST visiting the
         * left subtree first, then the current node and then the right subtree
         * @returns {Array} The array representation
         * @memberof j.BST
         * @instance
         */
        inOrder: function () {
            var ret = [];

            (function _aux (node) {
                if (node) {
                    _aux(node.left);
                    ret.push(node.key);
                    _aux(node.right);
                }
            })(this.root);

            return ret;
        },

        /**
         * Checks whether the data structure satisfy symmetric order
         * @returns {boolean} True if the rule is satisfied, false otherwise
         * @memberof j.BST
         * @instance
         */
        isBST: function () {
            return isBST(this.root, null, null);
        },

        /**
         * Checks whether the tree is empty
         * @returns {boolean} True if the BST is empty, false otherwise
         * @memberof j.BST
         * @instance
         */
        isEmpty: function () {
            return this.size() === 0;
        },

        /**
         * Gets the key of the far right most node
         * @returns {string} The key
         * @memberof j.BST
         * @instance
         */
        max: function () {
            if (this.isEmpty()) return null;
            return max(this.root).key;
        },

        /**
         * Gets the key of the far left most node
         * @returns {string} The key
         * @memberof j.BST
         * @instance
         */
        min: function () {
            if (this.isEmpty()) return null;
            return min(this.root).key;
        },

        /**
         * Gets the number of nodes in the tree
         * @returns {number} The number of nodes
         * @memberof j.BST
         * @instance
         */
        size: function () {
            return size(this.root);
        },

        /**
         * Gets an array (linear) representation of the BST visiting the
         * left subtree first, then the right subtree and then the current node
         * @returns {Array} The array representation
         * @memberof j.BST
         * @instance
         */
        postOrder: function () {
            var ret = [];

            (function _aux (node) {
                if (node) {
                    _aux(node.left);
                    _aux(node.right);
                    ret.push(node.key);
                }
            })(this.root);

            return ret;
        },

        /**
         * Gets an array (linear) representation of the BST visiting the
         * current node first, then the left and the right subtrees
         * @returns {Array} The array representation
         * @memberof j.BST
         * @instance
         */
        preOrder: function () {
            var ret = [];

            (function _aux (node) {
                if (node) {
                    ret.push(node.key);
                    _aux(node.left);
                    _aux(node.right);
                }
            })(this.root);

            return ret;
        },

        /**
         * Inserts an node in the tree (maintaining the structure order)
         * @returns {this} The current object (for chaining capabilities)
         * @memberof j.BST
         * @instance
         */
        put: function () {
            // Unpacking arguments
            var args = arguments, alen = args.length, k, v;

            if (alen === 1) {
                var obj = args[0];
                k = Object.keys(obj)[0];
                v = obj[k];
            }
            else if (alen === 2) {
                k = args[0];
                v = args[1];
            }
            else throw new BSTException('Wrong number of arguments provided');

            this.root = (function _aux (node) {
                if (!node) return new Node(k, v, null, null);

                var k1 = node.key,
                    v1 = node.val;

                if (k === k1)       throw new BSTException('Same key provided');
                else if (k < k1)    return new Node(k1, v1, _aux(node.left), node.right);
                else                return new Node(k1, v1, node.left, _aux(node.right));
            })(this.root);

            return this; // For chaining
        },

        /**
         * Gets the rank of the given key
         * @params {string} key - The key
         * @returns {number} The rank of the key
         * @memberof j.BST
         * @instance
         */
        rank: function (k) {
            return rank(k, this.root);
        },

        /**
         * Checks if the tree is rank consistent
         * @returns {boolean} True if rank consistency is satisfied, false otherwise
         * @memberof j.BST
         * @instance
         */
        rankConsistent: function () {
            for (var i = 0, size = this.size(); i < size; i++)
                if (i !== this.rank(this.select(i))) return false;

            var keys = this.inOrder(),
                that = this;

            keys.forEach(function (key, index, array) {
                if (key !== this.select(this.rank(key))) return false;
            }, this);

            return true;
        },

        /**
         * Gets the key of rank 'k'
         * @params {number} k - The rank of the key
         * @returns {string} The key of rank 'k'
         * @memberof j.BST
         * @instance
         */
        select: function (k) {
            if (k < 0 || k >= this.size()) return null;
            var x = select(this.root, k);
            return x.key;
        },

        /**
         * Returns the sum of the nodes value
         * @returns {number} Sum of nodes value
         * @memberof j.BST
         * @instance
         */
        sum: function () {
            return sum(this.root);
        }
    };

// Expose the module
    window.j = {
        'VERSION': '0.0.2',
        'Node': Node,
        'BST': BST
    };
})(window);
