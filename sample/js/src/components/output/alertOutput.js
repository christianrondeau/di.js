var createAlertOutput = function(){
    var self = {};

    self.send = function(value) {
        alert(value);
    };

    return self;
}