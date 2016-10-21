const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    runSequence(
        'js:app',  
        'config:js', 
        'config:css',
        callback
    );
};