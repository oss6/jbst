;(function (window, undefined) {
    
// Exception constructor
    
    function BSTException(message) {
        this.message = message;
    }

// Private variables and functions    

// Node constructor
    
    function Node(value, left, right) {
        if (!(this instanceof Node)) {
            return new Node(value, left, right);
        }
        
        if (!(left instanceof Node && right instanceof Node) && (left !== null && right !== null))
            return new BSTException('Error! Not a valid node.');
        
        this.value = value;
        this.left = left;
        this.right = right;
    }
    
    Node.prototype = {
        
        height: function () {
            var lh = 0,
                rh = 0;
            
            return (function _aux (node, depth) {
                if (!node) return -1;
                
                lh = _aux(node.left, lh);
                rh = _aux(node.right, rh);
                
                return 1 + Math.max(lh, rh);
            })(this);
        }
        
    };
    
// BST constructor
    
    function BST(root) {
        this.root = root;   
    }
    
    BST.prototype = {
        
        size: function () {
            
        },
        
        height: function () {
            return this.root.height();
        },
        
        inOrder: function () {
            var ret = [];
            
            (function _aux (node) {
                if (node) {
                    _aux(node.left);
                    ret.push(node.value);
                    _aux(node.right);
                }
            })(this.root);
            
            return ret;
        },
        
        preOrder: function () {
            var ret = [];
            
            (function _aux (node) {
                if (node) {
                    ret.push(node.value);
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
                    ret.push(node.value);
                }
            })(this.root);
            
            return ret;
        },
        
        insert: function (val) {
               
        }
        
    };
    
// Expose the module
    window.jbst = {
        'Node': Node,
        'BST': BST
    };
})(window);