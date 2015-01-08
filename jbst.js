;(function (window, undefined) {
    
// Exception constructor
    
    function BSTException(message) {
        this.message = message;
    }
    
    function GeneratorException(message) {
        this.message = message;   
    }
    
// Private variables and functions
    var
    pack = function (key, val) {
        var obj = {};
        return obj[key] = val, obj;
    },
    
    unpackg = function (obj) {
        var k = Object.keys(obj)[0],
            v = obj[k],
            i = 0;
        
        return function () {
            if (i >= 2) throw new GeneratorException('');
            var val = !i ? k : v;
            return i++, val;
        }
    };
/*var rec = function (obj, cases) {
    // Unpack of cases
    var base_case = cases.base_base,
        rec_case = cases.rec_case;

    return (function _aux (node) {
        // Base case
        if (!node) return base_case;
        // Recursive case
        return rec_case.call(null, node, _aux);
    })(obj);
};*/

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
    
// Node constructor
    
    function Node(obj, left, right) {
        if (!(this instanceof Node)) {
            return new Node(obj, left, right);
        }
        
        if (!(left instanceof Node && right instanceof Node) && (left !== null && right !== null))
            throw new BSTException('Error! Not a valid node.');
        
        // Unpack object
        var unpack = unpackg(obj);
        this.key = unpack();
        this.val = unpack();
        
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
    
    BST.fromJSON = function (jsonStr) {
          
    };
    
    BST.fromArray = function (arr) {
        var tree = new BST(null);
        
        for (var i = 0, len = arr.length; i < len; i++) {
            tree.insert(arr[i]);   
        }
        
        return tree;
    };
    
    BST.prototype = {
        
        size: function () {
            return (function _aux (node) {
                if (!node) return 0;                            // Base case
                return 1 + _aux(node.left) + _aux(node.right);  // Recursive case
            })(this.root);
        },
        
        height: function () {
            return this.root.height();
        },
        
        inOrder: function () {
            var ret = [];
            
            (function _aux (node) {
                if (node) {
                    _aux(node.left);
                    ret.push(node.val);
                    _aux(node.right);
                }
            })(this.root);
            
            return ret;
        },
        
        preOrder: function () {
            var ret = [];
            
            (function _aux (node) {
                if (node) {
                    ret.push(node.val);
                    _aux(node.left);
                    _aux(node.right);
                }
            })(this.root);
            
            return ret;
        },
        
        postOrder: function () {
            var ret = [];
            
            (function _aux (node) {
                if (node) {
                    _aux(node.left);
                    _aux(node.right);
                    ret.push(node.val);
                }
            })(this.root);
            
            return ret;
        },
        
        sum: function () {
            return (function _aux (node) {
                if (!node) return 0;
                return node.val + _aux(node.left) + _aux(node.right);
            })(this.root);
        },
        
        search: function (key) {
            var root = this.root;
            
            // 2 base cases
            if (!root) throw new BSTException('Key not found. Empty tree');
            if (root.key === key) return root.val;
            
            return (function _aux (node) {
                if (!node) throw new BSTException('Key not found');
                    
                if (key === node.key) return node.val;
                if (key < node.key) return _aux(node.left);
                if (key > node.key) return _aux(node.right);
            })(root);
        },
        
        insert: function () {
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
                if (!node) {
                    var obj = pack(k, v);
                    return new Node(obj, null, null);
                }
                
                var k1 = node.key,
                    v1 = node.val,
                    obj = pack(k1, v1);
                
                if (k === k1)       throw new BSTException('Same key provided');
                else if (k < k1)    return new Node(obj, _aux(node.left), node.right);
                else                return new Node(obj, node.left, _aux(node.right));
            })(this.root);
            
            return this; // For chaining
        },
        
        // If the given key is equal to the key at the root, we return the number of keys t in the left subtree;
        // if the given key is less than the key at the root, we return the rank of the key in the left subtree;
        // and if the given key is larger than the key at the root, we return t plus one (to count the key at the root) plus the rank of the key in the right subtree.
        rank: function (k) {
            var root = this.root,
                kr = root.key,
                lstree = new BST(root.left),    // Left subtree
                rstree = new BST(root.right);   // Right subtree
            
            if (k === kr) return lstree.size();
            if (k < kr)   return lstree.rank(k);
            if (k > kr)   return 1 + lstree.size() + rstree.rank(k);
        },
        
        min: function () {
            return (function _aux (node) {
                if (!node.left) return pack(node.key, node.val);
                return _aux(node.left);
            })(this.root);
        },
        
        max: function () {
            return (function _aux (node) {
                if (!node.right) return pack(node.key, node.val);
                return _aux(node.right);
            })(this.root);
        },
        
        // For delete the minimum, we go left until finding a node that has a null left link and then replace the link to that node by its right link
        deleteMin: function () {
            
        },
        
        deleteMax: function () {
            
        },
        
        /*let rec delete k = function
          | Empty                -> Empty
          | Node ((k', v), l, r) ->
             if k < k'      then delete k Node ((k', v), delete k l, r)
             else if k > k' then delete k Node ((k', v), l, delete k r)
             else if l = Empty then r
             else if r = Empty then l
             else let (k'', v'') = first_inorder r in
              Node ((k'', v''), l, delete k'' r)
        ;;*/
        
        delete: function (key) {
               
        }
        
    };
    
// Expose the module
    window.jbst = {
        'Node': Node,
        'BST': BST
    };
})(window);