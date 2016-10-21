const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    runSequence(
        'css:minify', 
        'js:minify'
    );
};