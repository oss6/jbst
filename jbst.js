;(function (window, undefined) {
    
    var _bst = function (val, left, right) {
        
    };
    
    var _BtreeDef = (function () {
        
    })();
    
    function BSTException(message) {
        this.message = message;
    }
    
    // Empty cons is null
    function Node(value, left, right) {
        if (!(left instanceof Node && right instanceof Node) && (left !== null && right !== null))
            return new BSTException('');
        
        this.value = value;
        this.left = left;
        this.right = right;
    }
    
    // Node(0, Node(0, null, null), null);
    
    // Root
    /*function Node(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
    {
        Empty: null,
        Node: { value: int, left: 0, right: 0 }
    }
    */
    
    // Expose the module
    window.jbst = _bst;
})(window);