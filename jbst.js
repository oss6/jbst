;(function (window, undefined) {
    
    // Exception constructor
    function BSTException(message) {
        this.message = message;
    }
    
    // Node constructor (Empty constructor is null)
    function Node(value, left, right) {
        if (!(this instanceof Node)) {
            return new Node(value, left, right);
        }
        
        if (!(left instanceof Node && right instanceof Node) && (left !== null && right !== null))
            return new BSTException('');
        
        this.value = value;
        this.left = left;
        this.right = right;
    }
    
    function BST(root) {
        this.root = root;   
    }
    
    BST.prototype = {
        
        height: function () {
            
        },
        
        inOrder: function () {
            return (function _aux (node) {
                if (node) {
                    _aux(node.left);
                    console.log(node.value);
                    _aux(node.right);
                }
            })(this.root);
        }
        
    };
    
    // Expose the module
    window.jbst = {
        'Node': Node,
        'BST': BST
    };
})(window);