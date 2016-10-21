const runSequence = require('run-sequence');


module.exports = function(gulp, callback) {
    runSequence(
        'img:icon:favorite', 
        'img:icon:copy', 
        'html:template'
    ); 
};