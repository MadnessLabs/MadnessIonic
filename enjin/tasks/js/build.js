const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    return runSequence(
        'config:js', 
        //'js:lint', 
        'js:compile', 
        'js:concat'
    );
};