const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    runSequence(
        'html:lint', 
        'css-lint', 
        'js:lint'
    );
};