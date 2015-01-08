// jbst.js
// JS implementation of binary-search trees (BST)
// Ossama Edbali - MIT License 2015

;(function (window, undefined) {
    
// Exception constructor
    
    function BSTException(message) {
        this.message = message;
    }
    
// Private variables and functions
var
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
    
    firstInOrder = function (x) {
        if (x === null) throw new BSTException('Empty tree');
        
        var k = x.key,
            v = x.val,
            l = x.left,
            r = x.right,
            a = {};
        a[k] = v;
        
        if (l === null) return a;
        else firstInOrder(l);
    },
    
    del = function (k, x) {
        if (x === null) return null;
        
        // Unpack node
        var k1 = x.key, v = x.val, l = x.left, r = x.right;
        
        if (k < k1)          return del(k, Node(k1, v, del(k, l), r));
        else if (k > k1)     return del(k, Node(k1, v, l, del(k, r)));
        else if (l === null) return r;
        else if (r === null) return l;
        else {
            var obj = firstInOrder(r),
                k2 = Object.keys(obj)[0],
                v2 = obj[k2];
            
            return Node(k2, v2, l, del(k2, r));
        }
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
    };

// Polyfills
    
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
    
// Node constructor
    
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
        
        height: function () {
            return (function _aux (node) {
                if (!node) return -1;
                return 1 + Math.max(_aux(node.left), _aux(node.right));
            })(this);
        },
        
    };
    
// BST constructor
    
    function BST(root) {
        this.root = root;   
    }
    
    BST.fromObject = function (obj) {
        var keys = Object.keys(obj),
            tree = new BST(null);
        
        keys.forEach(function (key, index, array) {
            var val = obj[key];
            tree.put(key, val);
        });
        
        return tree;
    };
    
    BST.fromArray = function (arr) {
        var tree = new BST(null);
        
        arr.forEach(function (el, index, array) {
            tree.put(el); 
        });
        
        return tree;
    };
    
    BST.prototype = {
        
        ceil: function (key) {
            var x = ceil(this.root, key);
            if (x === null) return null;
            else return x.key;
        },
        
        check: function () {
            return this.isBST() && this.rankConsistent();
        },
        
        contains: function (key) {
            return this.get(key) !== null;  
        },
        
        // Check
        delete: function (key) {
            if (this.isEmpty()) throw new BSTException('Empty tree');
            /*this.root = del(key, this.root);
            // check();
            return this;*/
        },
        
        deleteMax: function () {
            if (this.isEmpty()) throw new BSTException('Empty tree');
            this.root = deleteMax(this.root);
            if (!this.check()) throw new BSTException('BST not consistent');
            return this;
        },
        
        deleteMin: function () {
            if (this.isEmpty()) throw new BSTException('Empty tree');
            this.root = deleteMin(this.root);
            if (!this.check()) throw new BSTException('BST not consistent');
            return this;
        },
        
        floor: function (key) {
            var x = floor(this.root, key);
            if (x === null) return null;
            else return x.key;
        },
        
        get: function (key) {
            return get(this.root, key);
        },
        
        height: function () {
            return this.root.height();
        },
        
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
        
        isBST: function () {
            return isBST(this.root, null, null);
        },
        
        isEmpty: function () {
            return this.size() === 0;  
        },
        
        max: function () {
            if (this.isEmpty()) return null;
            return max(this.root).key;
        },
        
        min: function () {
            if (this.isEmpty()) return null;
            return min(this.root).key;
        },
        
        size: function () {
            return size(this.root);
        },
        
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
        
        // If the given key is equal to the key at the root, we return the number of keys t in the left subtree;
        // if the given key is less than the key at the root, we return the rank of the key in the left subtree;
        // and if the given key is larger than the key at the root, we return t plus one (to count the key at the root) plus the rank of the key in the right subtree.
        rank: function (k) {
            return rank(k, this.root);
        },
        
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
        
        select: function (k) {
            if (k < 0 || k >= this.size()) return null;
            var x = select(this.root, k);
            return x.key;
        },
        
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