;(function (window, undefined) {
    
// Exception constructor
    
    function BSTException(message) {
        this.message = message;
    }
    
// Private variables and functions    
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
            return new BSTException('Error! Not a valid node.');
        
        // Unpack object
        this.key = Object.keys(obj)[0];
        this.val = obj[this.key];
        
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
            
            if (!root) return new BSTException('Key not found. Empty tree');
            if (root.key === key) return root.val;
            
            return (function _aux (node) {
                if (!node) return 0;
                return node.val + _aux(node.left) + _aux(node.right);
            })(this.root);
        },
        
        insert: function () {
            // Unpacking arguments
            var args = arguments,
                alen = args.length,
                k = alen === 1 ? Object.keys(obj)[0] : args[0],
                v = alen === 1 ? obj[k] : args[1];
            
            return (function _aux (node) {
                if (!node) return new Node({k:v}, null, null);
                
                var k1 = node.key,
                    v1 = node.val;
                
                if (k === k1)       return new BSTException('');
                else if (k < k1)    return new Node({k1:v1}, _aux(node.left), node.right);
                else                return new Node({k1:v1}, node.left, _aux(node.left));
            })(this.root);
        },
        
        delete: function (key) {
               
        }
        
    };
    
// Expose the module
    window.jbst = {
        'Node': Node,
        'BST': BST
    };
})(window);