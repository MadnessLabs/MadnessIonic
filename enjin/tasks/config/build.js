const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    return runSequence(
        'vars', 
        'config',
        'router',
        'html:build', 
        'js:build', 
        'css:build',
        callback
    );
};
