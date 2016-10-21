const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    return runSequence(
        'clean:build', 
        'config:build',
        'html:template', 
        'html:build', 
        'css:build', 
        'js:build', 
        //'minify',
        callback
    );
};